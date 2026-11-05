"use client";

import { useState } from "react";
import { toCsv } from "@/lib/csv";
import type { SeriesByIndicator } from "@/lib/types";

export function ReportActions({ series, filename }: { series: SeriesByIndicator; filename: string }) {
  const [copied, setCopied] = useState(false);

  function download() {
    const blob = new Blob([toCsv(series)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard can be blocked; ignore */
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button onClick={copy} className="btn-secondary">{copied ? "Link copied ✓" : "Copy share link"}</button>
      <button onClick={download} className="btn-secondary">Download CSV</button>
    </div>
  );
}
