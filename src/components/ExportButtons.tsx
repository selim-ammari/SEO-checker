"use client";

import { useState } from "react";
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

function FileIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M4 1.75h5.5L13 5.25v9A1.25 1.25 0 0 1 11.75 15.5h-7.5A1.25 1.25 0 0 1 3 14.25v-11A1.25 1.25 0 0 1 4.25 2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M9.25 1.75V5.5H13"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M6 9.5h4M6 12h2.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ExportButtons({ result }: { result: AnalysisResult }) {
  const [feedback, setFeedback] = useState<"idle" | "md" | "json">("idle");

  function flash(kind: "md" | "json") {
    setFeedback(kind);
    window.setTimeout(() => setFeedback("idle"), 1600);
  }

  function downloadMarkdown() {
    const filename = buildExportFilename(result, "md");
    downloadTextFile(filename, toMarkdownReport(result), "text/markdown;charset=utf-8");
    flash("md");
  }

  function downloadJson() {
    const filename = buildExportFilename(result, "json");
    downloadTextFile(filename, toJsonReport(result), "application/json;charset=utf-8");
    flash("json");
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" onClick={downloadMarkdown} className="btn-secondary px-3.5 text-[13px]">
        <FileIcon />
        {feedback === "md" ? "Downloaded" : "Markdown"}
      </button>
      <button type="button" onClick={downloadJson} className="btn-secondary px-3.5 text-[13px]">
        <FileIcon />
        {feedback === "json" ? "Downloaded" : "JSON"}
      </button>
    </div>
  );
}
