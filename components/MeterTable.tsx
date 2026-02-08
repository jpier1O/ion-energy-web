import Link from "next/link";

export type MeterRow = {
  meterId: string;
  latestTimestamp: string;
  totalConsumption: number;
  status: "active" | "stale";
};

const StatusPill = ({ status }: { status: MeterRow["status"] }) => {
  const cls =
    status === "active"
      ? "bg-green-100 text-green-800"
      : "bg-gray-100 text-gray-800";

  return (
    <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${cls}`}>
      {status}
    </span>
  );
}

export const MeterTable = ({ rows }: { rows: MeterRow[] }) => {
  return (
    <div className="overflow-x-auto rounded border">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-800 text-white">
          <tr className="text-left">
            <th className="p-3">Meter</th>
            <th className="p-3">Latest Reading</th>
            <th className="p-3">Total Consumption</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((r) => (
            <tr key={r.meterId} className="border-t">
              <td className="p-3">
                <Link className="underline" href={`/meter/${encodeURIComponent(r.meterId)}`}>
                  {r.meterId}
                </Link>
              </td>
              <td className="p-3 font-mono">{r.latestTimestamp}</td>
              <td className="p-3">{r.totalConsumption.toFixed(2)}</td>
              <td className="p-3">
                <StatusPill status={r.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
