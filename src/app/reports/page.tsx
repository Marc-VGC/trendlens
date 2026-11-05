import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { listReports } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata = { title: "My reports · TrendLens" };

export default async function ReportsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const reports = await listReports(userId);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">My reports</h1>
        <Link href="/ask" className="btn-primary">+ New question</Link>
      </div>
      {reports.length === 0 ? (
        <div className="card text-center text-slate-600">
          No reports yet. <Link href="/ask" className="font-medium text-blue-700 underline">Ask your first question</Link>.
        </div>
      ) : (
        <ul className="space-y-3">
          {reports.map((r) => (
            <li key={r.id}>
              <Link href={`/r/${r.id}`} className="card block hover:border-blue-300">
                <p className="font-semibold">{r.title}</p>
                <p className="mt-1 line-clamp-2 text-sm text-slate-600">{r.question}</p>
                <p className="mt-2 text-xs text-slate-400">{new Date(r.created_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
