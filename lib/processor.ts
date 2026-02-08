import type { Flag, HourlyInfo, RawInfo } from "./types";

const MS_PER_HOUR = 60 * 60 * 1000;

function toHourISO(ts: string): string {
  const d = new Date(ts);
  const hourMs = Date.UTC(
    d.getUTCFullYear(),
    d.getUTCMonth(),
    d.getUTCDate(),
    d.getUTCHours(),
    0,
    0,
    0
  );
  return new Date(hourMs).toISOString().replace(".000Z", "Z");
}

function addHours(hourIso: string, hours: number): string {
  const ms = Date.parse(hourIso) + hours * MS_PER_HOUR;
  return new Date(ms).toISOString().replace(".000Z", "Z");
}

function diffHours(startHourIso: string, endHourIso: string): number {
  const start = Date.parse(startHourIso);
  const end = Date.parse(endHourIso);
  return Math.floor((end - start) / MS_PER_HOUR);
}

const severity: Record<Flag, number> = {
  normal: 0,
  gap_estimated: 1,
  counter_reset: 2,
};

function mergeFlag(a: Flag, b: Flag): Flag {
  return severity[a] >= severity[b] ? a : b;
}

type Key = `${string}|${string}`;

export function processInfo(readings: RawInfo[]): HourlyInfo[] {
  // group by meter
  const byMeter = new Map<string, RawInfo[]>();
  for (const r of readings) {
    const arr = byMeter.get(r.meterId) ?? [];
    arr.push(r);
    byMeter.set(r.meterId, arr);
  }

  const acc = new Map<Key, HourlyInfo>();

  for (const [meterId, meterReadings] of byMeter.entries()) {
    // duplicate timestamps: discard duplicates
    const sorted = [...meterReadings].sort(
      (a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp)
    );

    const seen = new Set<string>();
    const deduped: RawInfo[] = [];
    for (const r of sorted) {
      if (seen.has(r.timestamp)) continue;
      seen.add(r.timestamp);
      deduped.push(r);
    }

    for (let i = 0; i < deduped.length - 1; i++) {
      const prev = deduped[i];
      const curr = deduped[i + 1];

      let delta = curr.cumulativeVol - prev.cumulativeVol;
      if (!Number.isFinite(delta)) delta = 0;

      let baseFlag: Flag = "normal";

      if (curr.cumulativeVol < prev.cumulativeVol) {
        delta = curr.cumulativeVol;
        baseFlag = "counter_reset";
      }

      const startHour = toHourISO(prev.timestamp);
      const endHour = toHourISO(curr.timestamp);
      const spanHours = diffHours(startHour, endHour);

      // bucketing: assign delta to the hour of the previous reading
      if (spanHours <= 1) {
        const key: Key = `${meterId}|${startHour}`;
        const existing = acc.get(key);

        acc.set(
          key,
          existing
            ? {
                ...existing,
                consumption: existing.consumption + delta,
                flag: mergeFlag(existing.flag, baseFlag),
              }
            : { meterId, hour: startHour, consumption: delta, flag: baseFlag }
        );
        continue;
      }

      const perBucket = Number.isFinite(delta / spanHours) ? delta / spanHours : 0;

      const distributedFlag: Flag =
        baseFlag === "counter_reset" ? "counter_reset" : "gap_estimated";

      for (let h = 0; h < spanHours; h++) {
        const hour = addHours(startHour, h);
        const key: Key = `${meterId}|${hour}`;
        const existing = acc.get(key);

        acc.set(
          key,
          existing
            ? {
              ...existing,
              consumption: existing.consumption + perBucket,
              flag: mergeFlag(existing.flag, distributedFlag),
            }
            : {
              meterId,
              hour,
              consumption: perBucket,
              flag: distributedFlag,
            }
        );
      }
    }
  }

  return Array.from(acc.values()).sort((a, b) => {
    if (a.meterId !== b.meterId) return a.meterId.localeCompare(b.meterId);
    return Date.parse(a.hour) - Date.parse(b.hour);
  });
}
