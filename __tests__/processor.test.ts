import { describe, expect, it } from "vitest";
import { processInfo } from "../lib/processor";
import type { RawInfo } from "../lib/types";

describe("processReadings", () => {
  it("normal delta: assigns delta to earlier hour", () => {
    const input: RawInfo[] = [
      { meterId: "MTR-X", timestamp: "2025-02-05T10:03:00Z", cumulativeVol: 1000 },
      { meterId: "MTR-X", timestamp: "2025-02-05T11:07:00Z", cumulativeVol: 1050 },
    ];  

    const out = processInfo(input);

    expect(out).toHaveLength(1);
    expect(out[0]).toMatchObject({
      meterId: "MTR-X",
      hour: "2025-02-05T10:00:00Z",
      flag: "normal",
    });
    expect(out[0].consumption).toBe(50);
  });

  it("gap handling: distributes evenly across buckets and flags gap_estimated", () => {
    const input: RawInfo[] = [
      { meterId: "MTR-GAP", timestamp: "2025-02-05T10:07:00Z", cumulativeVol: 100 },
      { meterId: "MTR-GAP", timestamp: "2025-02-05T14:02:00Z", cumulativeVol: 400 },
    ];

    const out = processInfo(input);

    expect(out).toHaveLength(4);
    expect(out.map((r) => r.hour)).toEqual([
      "2025-02-05T10:00:00Z",
      "2025-02-05T11:00:00Z",
      "2025-02-05T12:00:00Z",
      "2025-02-05T13:00:00Z",
    ]);
    for (const r of out) {
      expect(r.flag).toBe("gap_estimated");
      expect(r.consumption).toBeCloseTo(75, 10);
    }
  });

  it("counter reset: delta is current value and flag counter_reset", () => {
    const input: RawInfo[] = [
      { meterId: "MTR-RST", timestamp: "2025-02-05T12:03:00Z", cumulativeVol: 500000 },
      { meterId: "MTR-RST", timestamp: "2025-02-05T13:01:00Z", cumulativeVol: 12 },
    ];

    const out = processInfo(input);

    expect(out).toHaveLength(1);
    expect(out[0]).toMatchObject({
      meterId: "MTR-RST",
      hour: "2025-02-05T12:00:00Z",
      flag: "counter_reset",
    });
    expect(out[0].consumption).toBe(12);
  });
});
