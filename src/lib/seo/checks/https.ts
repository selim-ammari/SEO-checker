import type { SeoCheckResult } from "@/lib/seo/types";

const MAX_SCORE = 10;

export function checkHttps(isHttps: boolean): SeoCheckResult {
  if (isHttps) {
    return {
      id: "https",
      category: "technical",
      title: "HTTPS",
      status: "pass",
      score: MAX_SCORE,
      maxScore: MAX_SCORE,
      message: "The page is served over HTTPS.",
      recommendation: "Keep HTTPS enabled and redirect HTTP traffic to HTTPS.",
    };
  }

  return {
    id: "https",
    category: "technical",
    title: "HTTPS",
    status: "error",
    score: 0,
    maxScore: MAX_SCORE,
    message: "The page is not served over HTTPS.",
    recommendation: "Install a TLS certificate and redirect all traffic to HTTPS.",
  };
}
