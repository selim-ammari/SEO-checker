"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCard } from "@/components/CheckCard";
import { ExportButtons } from "@/components/ExportButtons";
import { ScoreRing } from "@/components/ScoreRing";
import { loadAnalysisResult } from "@/lib/client/analysis-storage";
import type { AnalysisResult } from "@/lib/seo/types";

function FrameworkBadge({ result }: { result: AnalysisResult }) {
  const framework = result.framework;
  if (!framework || framework.framework === "unknown") {
    return (
      <p className="text-sm text-slate-500">
        Framework: Unknown — Next.js examples are shown as optional guidance.
      </p>
    );
  }

  return (
    <p className="text-sm text-slate-600">
      Framework:{" "}
      <span className="font-semibold text-slate-900">{framework.label}</span>
      <span className="text-slate-500">
        {" "}
        · confidence {framework.confidence}
      </span>
    </p>
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
      <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
        <p className="text-slate-600">Loading results…</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-slate-900">
          No analysis found
        </h1>
        <p className="mt-3 text-slate-600">
          Run a new check from the home page to see your SEO Health Score.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-teal-700 px-5 font-semibold text-white transition hover:bg-teal-800"
        >
          Analyze a website
        </Link>
      </div>
    );
  }

  const issues = result.checks.filter((c) => c.status !== "pass");
  const passed = result.checks.filter((c) => c.status === "pass");

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <section className="flex flex-col items-center gap-8 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="min-w-0 flex-1 space-y-3 text-center sm:text-left">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-800">
            SEO Health Score
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-slate-900 sm:text-4xl">
            {result.grade}
          </h1>
          <p className="break-all text-sm text-slate-600">
            Analyzed:{" "}
            <a
              href={result.finalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-teal-800 underline-offset-2 hover:underline"
            >
              {result.finalUrl}
            </a>
          </p>
          <FrameworkBadge result={result} />
          <p className="text-sm text-slate-500">
            {result.summary.passed} passed · {result.summary.warnings} warnings ·{" "}
            {result.summary.errors} errors
          </p>
          {result.analyzedAt ? (
            <p className="text-xs text-slate-400">
              Analyzed at {new Date(result.analyzedAt).toLocaleString()}
            </p>
          ) : null}
        </div>
        <ScoreRing score={result.score} grade={result.grade} />
      </section>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
        >
          Analyze another website
        </Link>
        <ExportButtons result={result} />
      </div>

      {issues.length > 0 ? (
        <section className="mt-10">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-slate-900">
            SEO issues
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Recommended actions and optional code examples for developers.
          </p>
          <div className="mt-5 grid gap-4">
            {issues.map((check) => (
              <CheckCard key={check.id} check={check} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-10">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-slate-900">
          {issues.length > 0 ? "Passed checks" : "All checks"}
        </h2>
        <div className="mt-5 grid gap-4">
          {(issues.length > 0 ? passed : result.checks).map((check) => (
            <CheckCard key={check.id} check={check} />
          ))}
        </div>
      </section>
    </div>
  );
}
