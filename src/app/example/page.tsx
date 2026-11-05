import Link from "next/link";
import { ReportView } from "@/components/ReportView";
import { EXAMPLE_REPORT } from "@/lib/example";

export const metadata = { title: "Example report · TrendLens" };

export default function ExamplePage() {
  return (
    <ReportView
      report={EXAMPLE_REPORT}
      banner={
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
          <strong>Example report.</strong> Real World Bank data retrieved 5 Nov 2026. The insights were pre-written for this
          example and pass the same automatic number check as AI-generated reports.{" "}
          <Link href="/ask" className="font-semibold underline">Ask your own question →</Link>
        </div>
      }
    />
  );
}
