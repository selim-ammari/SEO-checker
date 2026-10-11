"use client";

import { useId, useState } from "react";
import { CodeExampleBlock } from "@/components/CodeExampleBlock";
import { StatusBadge } from "@/components/StatusBadge";
import type { SeoCheckResult } from "@/lib/seo/types";

export function CheckCard({ check }: { check: SeoCheckResult }) {
  const examplesId = useId();
  const [open, setOpen] = useState(false);
  const hasExamples = Boolean(check.fixExamples?.length);

  return (
    <article className="border-b border-[var(--brand-border)] py-5 last:border-b-0">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-2.5">
          <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-[var(--brand-ink)]">
            {check.title}
          </h3>
          <StatusBadge status={check.status} />
        </div>
        <p className="font-[family-name:var(--font-mono)] text-[12px] tabular-nums text-[var(--brand-ink-tertiary)]">
          {check.score}/{check.maxScore}
        </p>
      </div>

      <p className="mt-2.5 text-sm leading-relaxed text-[var(--brand-ink)]">{check.message}</p>
      <p className="mt-2 text-sm leading-relaxed text-[var(--brand-ink-secondary)]">
        <span className="font-medium text-[var(--brand-ink)]">Fix: </span>
        {check.recommendation}
      </p>

      {hasExamples ? (
        <div className="mt-3">
          <button
            type="button"
            className="text-sm font-semibold text-[var(--brand-accent)] underline-offset-2 transition hover:underline focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"
            aria-expanded={open}
            aria-controls={examplesId}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? "Hide code examples" : "Show code examples"}
          </button>
          {open ? (
            <div id={examplesId} className="mt-3 space-y-3">
              {check.fixExamples?.map((example) => (
                <CodeExampleBlock
                  key={`${check.id}-${example.label}`}
                  example={example}
                />
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
