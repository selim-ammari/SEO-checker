"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCard } from "@/components/CheckCard";
import { ExportButtons } from "@/components/ExportButtons";
import { ScoreRing } from "@/components/ScoreRing";
import { loadAnalysisResult } from "@/lib/client/analysis-storage";
import type { AnalysisResult } from "@/lib/seo/types";

function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

function FrameworkMeta({ result }: { result: AnalysisResult }) {
  const framework = result.framework;
  if (!framework || framework.framework === "unknown") {
    return (
      <span className="text-[var(--brand-ink-tertiary)]">
        Framework unknown · Next.js examples shown as optional guidance
      </span>
    );
  }

  return (
    <span>
      <span className="font-medium text-[var(--brand-ink)]">{framework.label}</span>
      <span className="text-[var(--brand-ink-tertiary)]">
        {" "}
        · confidence {framework.confidence}
      </span>
    </span>
  );
}

export default function ResultsPage() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setResult(loadAnalysisResult());
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div className="shell py-20">
        <p className="text-sm text-[var(--brand-ink-secondary)]" role="status">
          Loading report…
        </p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="shell py-20">
        <p className="eyebrow">Results</p>
        <h1 className="section-title mt-3">No analysis found</h1>
        <p className="body-muted mt-3 max-w-md">
          Run a new check from the home page to generate a technical SEO report. Results
          are stored in this browser session only.
        </p>
        <Link href="/#analyze" className="btn-primary mt-8 inline-flex">
          Analyze a website
        </Link>
      </div>
    );
  }

  const issues = result.checks.filter((c) => c.status !== "pass");
  const passed = result.checks.filter((c) => c.status === "pass");
  const domain = hostnameOf(result.finalUrl || result.url);

  return (
    <div className="shell py-8 sm:py-12">
      <div className="flex flex-col gap-4 border-b border-[var(--brand-border)] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="eyebrow">Technical report</p>
          <h1 className="mt-2 truncate text-2xl font-semibold tracking-[-0.03em] text-[var(--brand-ink)] sm:text-3xl">
            {domain}
          </h1>
          <p className="mt-2 break-all font-[family-name:var(--font-mono)] text-[12px] text-[var(--brand-ink-tertiary)]">
            <a
              href={result.finalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-2 hover:text-[var(--brand-accent)] hover:underline"
            >
              {result.finalUrl}
            </a>
          </p>
          <div className="mt-3 flex flex-col gap-1 text-sm text-[var(--brand-ink-secondary)] sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3">
            <FrameworkMeta result={result} />
            {result.analyzedAt ? (
              <>
                <span className="hidden text-[var(--brand-border-strong)] sm:inline" aria-hidden>
                  |
                </span>
                <time dateTime={result.analyzedAt}>
                  {new Date(result.analyzedAt).toLocaleString()}
                </time>
              </>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:items-end">
          <ExportButtons result={result} />
          <Link href="/#analyze" className="btn-ghost justify-start px-0 text-[13px] sm:justify-end">
            Analyze another website
          </Link>
        </div>
      </div>

      <section className="grid gap-8 border-b border-[var(--brand-border)] py-8 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-12">
        <ScoreRing score={result.score} grade={result.grade} />
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--brand-ink-tertiary)]">
            SEO health score
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-[var(--brand-ink)]">
            {result.grade}
          </h2>
          <p className="body-muted mt-2 max-w-xl text-sm">
            {result.summary.passed} passed · {result.summary.warnings} warnings ·{" "}
            {result.summary.errors} errors across {result.checks.length} technical checks.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-[12px]">
            <span className="status-pill-pass">{result.summary.passed} pass</span>
            <span className="status-pill-warning">{result.summary.warnings} warn</span>
            <span className="status-pill-error">{result.summary.errors} error</span>
          </div>
        </div>
      </section>

      {issues.length > 0 ? (
        <section className="py-8">
          <div className="mb-2 flex items-baseline justify-between gap-4">
            <h2 className="section-title">Issues requiring attention</h2>
            <p className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--brand-ink-tertiary)]">
              {issues.length}
            </p>
          </div>
          <p className="body-muted mb-2 max-w-2xl text-sm">
            Recommended actions and optional code examples for developers.
          </p>
          <div className="panel px-4 sm:px-5">
            {issues.map((check) => (
              <CheckCard key={check.id} check={check} />
            ))}
          </div>
        </section>
      ) : null}

      <section className={issues.length > 0 ? "pb-8" : "py-8"}>
        <div className="mb-2 flex items-baseline justify-between gap-4">
          <h2 className="section-title">
            {issues.length > 0 ? "Passed checks" : "All checks"}
          </h2>
          <p className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--brand-ink-tertiary)]">
            {issues.length > 0 ? passed.length : result.checks.length}
          </p>
        </div>
        <div className="panel px-4 sm:px-5">
          {(issues.length > 0 ? passed : result.checks).map((check) => (
            <CheckCard key={check.id} check={check} />
          ))}
        </div>
      </section>
    </div>
  );
}
