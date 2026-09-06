import type { CheerioAPI } from "cheerio";
import type { SeoCheckResult } from "@/lib/seo/types";

const MAX_SCORE = 10;

export function checkCanonical($: CheerioAPI): SeoCheckResult {
  const href = $('link[rel="canonical"]').first().attr("href")?.trim();

  if (!href) {
    return {
      id: "canonical",
      category: "technical",
      title: "Canonical",
      status: "error",
      score: 0,
      maxScore: MAX_SCORE,
      message: "No canonical link tag was found.",
      recommendation: 'Add <link rel="canonical" href="https://example.com/page"> in the <head>.',
    };
  }

  try {
    // Relative URLs are valid; resolve-like check via URL constructor with a base
    new URL(href, "https://example.com");
  } catch {
    return {
      id: "canonical",
      category: "technical",
      title: "Canonical",
      status: "warning",
      score: 3,
      maxScore: MAX_SCORE,
      message: "A canonical tag exists but its href looks invalid.",
      recommendation: "Use an absolute HTTPS URL for the canonical href.",
    };
  }

  return {
    id: "canonical",
    category: "technical",
    title: "Canonical",
    status: "pass",
    score: MAX_SCORE,
    maxScore: MAX_SCORE,
    message: "A canonical link tag is present.",
    recommendation: "Point the canonical URL to the preferred version of this page.",
  };
}
