import Link from "next/link";
import { processInfo } from "@/lib/processor";
import type { HourlyInfo, RawInfo } from "@/lib/types";
import data from "@/data/inputs.json";
import { ConsumptionChart } from "@/components/ConsumptionChart";
import { BackLink } from "@/components/BackLink";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function MeterPage({ params }: PageProps) {
	const { id } = await params; // ✅ unwrap
  const meterId = decodeURIComponent(id);

  const raw = data as RawInfo[];
  const records: HourlyInfo[] = processInfo(raw).filter(
    (r) => r.meterId === meterId
  );

  const availableIds = Array.from(new Set(raw.map((r) => r.meterId))).sort();

	if (records.length === 0) {
		return (
			<main className="flex p-6 space-y-4">
				<Link className="underline" href="/"> Back</Link>
				<h1 className="text-2xl font-semibold">{meterId}</h1>
				<p>No records found.</p>
			</main>
		);
	}

  return (
    <main className="p-6 space-y-4">
      <BackLink href="/" label="Back" />

      <h1 className="text-2xl font-semibold">{meterId}</h1>

      {records.length === 0 ? (
        <div className="space-y-2">
          <p className="text-sm">
            No records found for <span className="font-mono">{meterId}</span>.
          </p>
          <p className="text-sm">
            Available meterIds:{" "}
            <span className="font-mono">{availableIds.join(", ")}</span>
          </p>
        </div>
      ) : (
        <>
          <div className="rounded border p-4">
            <ConsumptionChart records={records} />
          </div>

          <div className="overflow-x-auto rounded border">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-800 text-white">
                <tr className="text-left">
                  <th className="p-3">Hour</th>
                  <th className="p-3">Consumption</th>
                  <th className="p-3">Flag</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r.hour} className="border-t">
                    <td className="p-3 font-mono">{r.hour}</td>
                    <td className="p-3">{r.consumption.toFixed(2)}</td>
                    <td className="p-3 font-mono">{r.flag}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </main>
  );
}
