import type { AnalysisResult } from "@/lib/seo/types";

export const ANALYSIS_STORAGE_KEY = "seo-checker:last-analysis";

export function saveAnalysisResult(result: AnalysisResult): void {
  sessionStorage.setItem(ANALYSIS_STORAGE_KEY, JSON.stringify(result));
}

export function loadAnalysisResult(): AnalysisResult | null {
  try {
    const raw = sessionStorage.getItem(ANALYSIS_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AnalysisResult;
  } catch {
    return null;
  }
}

export function clearAnalysisResult(): void {
  sessionStorage.removeItem(ANALYSIS_STORAGE_KEY);
}
