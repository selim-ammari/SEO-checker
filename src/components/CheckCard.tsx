"use client";

import { useId, useState } from "react";
import { CodeExampleBlock } from "@/components/CodeExampleBlock";
import type { CheckStatus, SeoCheckResult } from "@/lib/seo/types";

function StatusIcon({ status }: { status: CheckStatus }) {
  if (status === "pass") {
    return (
      <span
        className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-800"
        aria-label="Pass"
      >
        ✓
      </span>
    );
  }

  if (status === "warning") {
    return (
      <span
        className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-800"
        aria-label="Warning"
      >
        ⚠
      </span>
    );
  }

  return (
    <span
      className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-800"
      aria-label="Error"
    >
      ✗
    </span>
  );
}

export function CheckCard({ check }: { check: SeoCheckResult }) {
  const examplesId = useId();
  const [open, setOpen] = useState(false);
  const hasExamples = Boolean(check.fixExamples?.length);

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <StatusIcon status={check.status} />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-base font-semibold text-slate-900">{check.title}</h3>
            <span className="text-xs font-medium text-slate-500">
              {check.score}/{check.maxScore} pts
            </span>
          </div>
          <p className="text-sm text-slate-700">{check.message}</p>
          <p className="text-sm text-slate-500">
            <span className="font-medium text-slate-600">Recommendation: </span>
            {check.recommendation}
          </p>

          {hasExamples ? (
            <div className="pt-1">
              <button
                type="button"
                className="text-sm font-semibold text-teal-800 underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
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
        </div>
      </div>
    </article>
  );
}
