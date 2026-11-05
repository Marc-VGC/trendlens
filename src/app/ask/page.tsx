import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { AskForm } from "@/components/AskForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Ask · TrendLens" };

export default async function AskPage({ searchParams }: { searchParams: { q?: string } }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const initial = typeof searchParams.q === "string" ? searchParams.q.slice(0, 500) : "";
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Ask about global trends</h1>
        <p className="mt-1 text-slate-600">
          Name up to six countries or regions and a topic. TrendLens picks the indicators, fetches the data and explains it.
        </p>
      </div>
      <AskForm initial={initial} />
    </div>
  );
}
