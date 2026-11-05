"use client";

import { track } from "@vercel/analytics";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { EXAMPLE_QUESTIONS } from "@/lib/questions";
import { QUESTION_MAX, QUESTION_MIN } from "@/lib/validation";


const STEPS = ["Planning the query…", "Fetching World Bank data…", "Computing statistics…", "Writing and verifying insights…"];

export function AskForm({ initial = "" }: { initial?: string }) {
  const router = useRouter();
  const [question, setQuestion] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!busy) return;
    const t = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 4000);
    return () => clearInterval(t);
  }, [busy]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const q = question.trim();
    if (q.length < QUESTION_MIN) return setError("Please ask a longer question.");
    setBusy(true);
    setStep(0);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data = (await res.json().catch(() => ({}))) as { id?: string; error?: string };
      if (!res.ok || !data.id) throw new Error(data.error ?? "Something went wrong.");
      track("report_created");
      router.push(`/r/${data.id}`);
    } catch (err) {
      track("report_failed");
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="card space-y-4">
      <label htmlFor="question" className="block font-medium">Your question</label>
      <textarea
        id="question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        maxLength={QUESTION_MAX}
        rows={3}
        placeholder="e.g. How has life expectancy changed in Kenya, Nigeria and South Africa since 2000?"
        className="w-full rounded-lg border border-slate-300 p-3 focus:border-blue-500 focus:outline-none"
      />
      <div className="flex flex-wrap gap-2">
        {EXAMPLE_QUESTIONS.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => setQuestion(q)}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-left text-xs text-slate-700 hover:border-blue-300"
          >
            {q}
          </button>
        ))}
      </div>
      {error && <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-800">{error}</p>}
      <div className="flex flex-wrap items-center gap-3">
        <button className="btn-primary" disabled={busy}>{busy ? "Building report…" : "Build report"}</button>
        {busy && <p className="text-sm text-slate-500" aria-live="polite">{STEPS[step]}</p>}
      </div>
    </form>
  );
}
