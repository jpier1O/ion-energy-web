import { MeterTable } from "@/components/MeterTable";
import { MeterRow } from "@/components/MeterTable";
import { SummaryOverview } from "@/components/SummaryOverview";
import data from "@/data/inputs.json";
import { processInfo } from "@/lib/processor";
import type { RawInfo } from "@/lib/types";
export default function Home() {

  const raw = data as RawInfo[];
  const hourly = processInfo(raw);

  const datasetMaxMs = Math.max(...raw.map((r) => Date.parse(r.timestamp)));

  // latest per meter
  const latestByMeter = new Map<string, number>();
  for (const r of raw) {
    const ms = Date.parse(r.timestamp);
    const prev = latestByMeter.get(r.meterId);
    if (prev === undefined || ms > prev) latestByMeter.set(r.meterId, ms);
  }

  const totals = new Map<string, number>();
  for (const rec of hourly) {
    totals.set(rec.meterId, (totals.get(rec.meterId) ?? 0) + rec.consumption);
  }

  const rows: MeterRow[] = Array.from(latestByMeter.entries())
    .map(([meterId, latestMs]) => {
      const status: MeterRow["status"] =
        datasetMaxMs - latestMs <= 2 * 60 * 60 * 1000 ? "active" : "stale";

      return {
        meterId,
        latestTimestamp: new Date(latestMs).toISOString(),
        totalConsumption: totals.get(meterId) ?? 0,
        status,
      };
    })
    .sort((a, b) => a.meterId.localeCompare(b.meterId));

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Meter Telemetry Dashboard</h1>
      <SummaryOverview hourly={hourly} />
      <MeterTable rows={rows} />
    </main>
  );
}
