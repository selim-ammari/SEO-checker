"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { saveAnalysisResult } from "@/lib/client/analysis-storage";
import type { AnalysisResult } from "@/lib/seo/types";

type ApiErrorBody = {
  error?: {
    message?: string;
  };
};

export function AnalyzeForm({ initialUrl = "" }: { initialUrl?: string }) {
  const router = useRouter();
  const [url, setUrl] = useState(initialUrl);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const trimmed = url.trim();
    if (!trimmed) {
      setError("Please enter a website URL.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      });

      const data = (await response.json()) as AnalysisResult | ApiErrorBody;

      if (!response.ok) {
        const message =
          "error" in data && data.error?.message
            ? data.error.message
            : "Analysis failed. Please try again.";
        setError(message);
        return;
      }

      saveAnalysisResult(data as AnalysisResult);
      router.push("/results");
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full space-y-3" id="analyze-form">
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-stretch">
        <label className="sr-only" htmlFor="url">
          Website URL
        </label>
        <input
          id="url"
          name="url"
          type="url"
          inputMode="url"
          autoComplete="url"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={loading}
          className="field font-[family-name:var(--font-mono)] text-[14px] sm:flex-1"
        />
        <button type="submit" disabled={loading} className="btn-primary min-w-[10.5rem] px-5">
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span
                className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white"
                aria-hidden
              />
              Analyzing…
            </span>
          ) : (
            "Analyze website"
          )}
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-[var(--brand-ink-secondary)]" role="status" aria-live="polite">
          Fetching HTML and running technical checks…
        </p>
      ) : (
        <p className="text-sm text-[var(--brand-ink-tertiary)]">
          Public pages only · HTTPS preferred · Single-page HTML analysis
        </p>
      )}

      {error ? (
        <p
          className="rounded-[var(--radius-sm)] bg-[var(--status-error-bg)] px-3 py-2 text-sm text-[var(--status-error)] ring-1 ring-[var(--status-error-border)]"
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </form>
  );
}
