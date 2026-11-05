"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="card mx-auto max-w-lg text-center">
      <h1 className="text-xl font-semibold">Something went wrong</h1>
      <p className="mt-2 text-slate-600">
        We couldn&apos;t load this page. The data service may be busy. Please try again in a moment.
      </p>
      <div className="mt-5 flex justify-center gap-3">
        <button onClick={reset} className="btn-primary">Try again</button>
        <Link href="/explore" className="btn-secondary">Go to Explore</Link>
      </div>
    </div>
  );
}
