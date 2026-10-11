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
    // fall through
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
    <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--code-border)] bg-[var(--code-bg)]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--code-border)] px-3 py-2">
        <p className="font-[family-name:var(--font-mono)] text-[11px] font-medium text-[var(--code-muted)]">
          {example.label}
        </p>
        <button
          type="button"
          onClick={onCopy}
          className="rounded-[var(--radius-sm)] border border-white/10 bg-white/5 px-2.5 py-1 font-[family-name:var(--font-mono)] text-[11px] font-semibold text-[var(--code-fg)] transition hover:bg-white/10 focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"
          aria-label={`Copy code example: ${example.label}`}
        >
          {feedback === "copied" ? "Copied" : feedback === "failed" ? "Failed" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-3.5 font-[family-name:var(--font-mono)] text-[12px] leading-relaxed text-[var(--code-fg)]">
        <code>{example.code}</code>
      </pre>
      {example.note ? (
        <p className="border-t border-[var(--code-border)] px-3.5 py-2 text-[11px] leading-relaxed text-[var(--code-muted)]">
          {example.note}
        </p>
      ) : null}
      <span className="sr-only" aria-live="polite">
        {feedback === "copied" ? "Code copied to clipboard" : ""}
        {feedback === "failed" ? "Unable to copy code" : ""}
      </span>
    </div>
  );
}
