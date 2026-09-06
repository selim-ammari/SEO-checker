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
    <form onSubmit={onSubmit} className="w-full space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
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
          className="min-h-12 flex-1 rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={loading}
          className="min-h-12 rounded-xl bg-teal-700 px-6 text-base font-semibold text-white transition hover:bg-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Analyzing…" : "Analyze website"}
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-slate-600" role="status" aria-live="polite">
          Analyzing website…
        </p>
      ) : null}

      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
