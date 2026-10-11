"use client";

import {
  buildExportFilename,
  toJsonReport,
  toMarkdownReport,
} from "@/lib/seo/export-report";
import type { AnalysisResult } from "@/lib/seo/types";

function downloadTextFile(filename: string, content: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export function ExportButtons({ result }: { result: AnalysisResult }) {
  function downloadMarkdown() {
    const filename = buildExportFilename(result, "md");
    downloadTextFile(filename, toMarkdownReport(result), "text/markdown;charset=utf-8");
  }

  function downloadJson() {
    const filename = buildExportFilename(result, "json");
    downloadTextFile(filename, toJsonReport(result), "application/json;charset=utf-8");
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={downloadMarkdown}
        className="inline-flex min-h-11 items-center rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
      >
        Download Markdown
      </button>
      <button
        type="button"
        onClick={downloadJson}
        className="inline-flex min-h-11 items-center rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
      >
        Download JSON
      </button>
    </div>
  );
}
