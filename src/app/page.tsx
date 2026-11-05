import Link from "next/link";
import { SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { EXAMPLE_QUESTIONS } from "@/lib/questions";

const steps = [
  { n: "1", title: "Ask in plain English", body: "\"Compare inflation in Australia, New Zealand and the US since 2010.\" Claude turns it into a precise query plan." },
  { n: "2", title: "Real World Bank data", body: "TrendLens fetches the actual series for 200+ economies and computes growth rates, changes and rankings in tested code." },
  { n: "3", title: "Insights you can cite", body: "AI writes the takeaways from those statistics, and every number is checked against the data. Charts, sources, CSV." },
];

export default function Home() {
  return (
    <div className="space-y-14">
      <section className="pt-6 text-center sm:pt-12">
        <p className="mx-auto inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800">
          For students, analysts and anyone comparing countries
        </p>
        <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          Global development trends, explained with numbers you can trust.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
          Ask a question about countries. Get charts, statistics and AI insights built on real World Bank data, with
          every number verified.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <SignedOut>
            <SignUpButton mode="modal">
              <button className="btn-primary px-6 py-3 text-base">Ask a question, free</button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link href="/ask" className="btn-primary px-6 py-3 text-base">Ask a question</Link>
          </SignedIn>
          <Link href="/example" className="btn-secondary px-6 py-3 text-base">See an example report</Link>
          <Link href="/explore" className="btn-secondary px-6 py-3 text-base">Explore the data</Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {steps.map((s) => (
          <div key={s.n} className="card">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-blue-700 text-sm font-bold text-white">{s.n}</span>
            <h2 className="mt-3 font-semibold">{s.title}</h2>
            <p className="mt-1 text-sm text-slate-600">{s.body}</p>
          </div>
        ))}
      </section>

      <section className="card">
        <h2 className="text-xl font-semibold">Questions people ask</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {EXAMPLE_QUESTIONS.map((q) => (
            <li key={q}>
              <Link href={`/ask?q=${encodeURIComponent(q)}`} className="block rounded-lg border border-slate-200 p-3 text-sm text-slate-700 hover:border-blue-300">
                {q}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="card grid gap-6 sm:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold">Not another chatbot</h2>
          <p className="mt-2 text-slate-600">
            Chatbots can misremember statistics. In TrendLens the AI never supplies data: it chooses what to look up and
            explains what the real numbers show. A verifier flags any figure that isn&apos;t in the data.
          </p>
        </div>
        <ul className="space-y-2 text-sm text-slate-700">
          <li>📈 32 indicators: GDP, inflation, internet, ageing, renewables, CO₂, health, education…</li>
          <li>🌏 217 economies plus regional and income-group benchmarks</li>
          <li>✅ Every AI number checked against computed statistics</li>
          <li>🔗 Shareable report links, sources and CSV download</li>
        </ul>
      </section>
    </div>
  );
}
