import type { HourlyInfo } from "../lib/types";

const Card = ({ title, value }: { title: string; value: string }) => {
  return (
    <div className="rounded border p-4">
      <div className="text-sm text-gray-600">{title}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}

export const SummaryOverview = ({ hourly }: { hourly: HourlyInfo[] }) => {
  const total = hourly.reduce((sum, r) => sum + r.consumption, 0);
  const gapCount = hourly.filter((r) => r.flag === "gap_estimated").length;
  const resetCount = hourly.filter((r) => r.flag === "counter_reset").length;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <Card title="Total consumption (all meters)" value={total.toFixed(2)} />
      <Card title="Gap-estimated hours" value={String(gapCount)} />
      <Card title="Counter reset hours" value={String(resetCount)} />
    </div>
  );
}
