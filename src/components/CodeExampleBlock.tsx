"use client";

import { useState } from "react";
import type { CodeExample } from "@/lib/seo/types";

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to legacy path
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

export function CodeExampleBlock({ example }: { example: CodeExample }) {
  const [feedback, setFeedback] = useState<"idle" | "copied" | "failed">("idle");

  async function onCopy() {
    const ok = await copyText(example.code);
    setFeedback(ok ? "copied" : "failed");
    window.setTimeout(() => setFeedback("idle"), 2000);
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-3 py-2">
        <p className="text-xs font-semibold text-slate-700">{example.label}</p>
        <button
          type="button"
          onClick={onCopy}
          className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
          aria-label={`Copy code example: ${example.label}`}
        >
          {feedback === "copied" ? "Copied" : feedback === "failed" ? "Copy failed" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-3 text-xs leading-relaxed text-slate-800">
        <code>{example.code}</code>
      </pre>
      {example.note ? (
        <p className="border-t border-slate-200 px-3 py-2 text-xs text-slate-500">{example.note}</p>
      ) : null}
      <span className="sr-only" aria-live="polite">
        {feedback === "copied" ? "Code copied to clipboard" : ""}
        {feedback === "failed" ? "Unable to copy code" : ""}
      </span>
    </div>
  );
}
