import { describe, expect, it } from "vitest";
import { processInfo } from "../lib/processor";
import type { RawInfo } from "../lib/types";

describe("processReadings", () => {
  it("normal delta: assigns delta to earlier reading hour with flag normal", () => {
    const input: RawInfo[] = [
      { meterId: "MTR-X", timestamp: "2025-02-05T10:03:00Z", cumulativeVol: 1000 },
      { meterId: "MTR-X", timestamp: "2025-02-05T11:07:00Z", cumulativeVol: 1050 }
    ];

    const out = processInfo(input);
    expect(out).toEqual([
      { meterId: "MTR-X", hour: "2025-02-05T10:00:00Z", consumption: 50, flag: "normal" }
    ]);
  });

  it("gap handling: distributes evenly across hour buckets and flags gap_estimated", () => {
    const input: RawInfo[] = [
      { meterId: "MTR-GAP", timestamp: "2025-02-05T10:07:00Z", cumulativeVol: 100 },
      { meterId: "MTR-GAP", timestamp: "2025-02-05T14:02:00Z", cumulativeVol: 400 }
    ];

    const out = processInfo(input);
    expect(out).toEqual([
      { meterId: "MTR-GAP", hour: "2025-02-05T10:00:00Z", consumption: 75, flag: "gap_estimated" },
      { meterId: "MTR-GAP", hour: "2025-02-05T11:00:00Z", consumption: 75, flag: "gap_estimated" },
      { meterId: "MTR-GAP", hour: "2025-02-05T12:00:00Z", consumption: 75, flag: "gap_estimated" },
      { meterId: "MTR-GAP", hour: "2025-02-05T13:00:00Z", consumption: 75, flag: "gap_estimated" }
    ]);
  });

  it("counter reset: uses current value as delta and flags counter_reset", () => {
    const input: RawInfo[] = [
      { meterId: "MTR-RST", timestamp: "2025-02-05T12:03:00Z", cumulativeVol: 500000 },
      { meterId: "MTR-RST", timestamp: "2025-02-05T13:01:00Z", cumulativeVol: 12 },
    ];

    const out = processInfo(input);
    expect(out).toEqual([
      { meterId: "MTR-RST", hour: "2025-02-05T12:00:00Z", consumption: 12, flag: "counter_reset" }
    ]);
  });
});
