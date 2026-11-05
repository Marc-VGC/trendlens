import { ExploreClient } from "@/components/ExploreClient";

export const metadata = { title: "Explore · TrendLens" };

export default function ExplorePage() {
  const maxYear = new Date().getUTCFullYear() - 1;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Explore the data</h1>
        <p className="mt-1 text-slate-600">Pick countries and an indicator to chart World Bank data instantly. No sign-in needed.</p>
      </div>
      <ExploreClient maxYear={maxYear} />
    </div>
  );
}
