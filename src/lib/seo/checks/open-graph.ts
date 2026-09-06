import type { CheerioAPI } from "cheerio";
import type { SeoCheckResult } from "@/lib/seo/types";

const MAX_SCORE = 10;

function getOg($: CheerioAPI, property: string): string | undefined {
  return (
    $(`meta[property="${property}"]`).first().attr("content")?.trim() ||
    $(`meta[name="${property}"]`).first().attr("content")?.trim()
  );
}

export function checkOpenGraph($: CheerioAPI): SeoCheckResult {
  const title = getOg($, "og:title");
  const description = getOg($, "og:description");
  const image = getOg($, "og:image");

  const present = [title, description, image].filter(Boolean).length;

  if (present === 3) {
    return {
      id: "open-graph",
      category: "social",
      title: "Open Graph",
      status: "pass",
      score: MAX_SCORE,
      maxScore: MAX_SCORE,
      message: "og:title, og:description, and og:image are all present.",
      recommendation: "Keep Open Graph tags accurate when sharing pages on social networks.",
    };
  }

  if (present === 0) {
    return {
      id: "open-graph",
      category: "social",
      title: "Open Graph",
      status: "error",
      score: 0,
      maxScore: MAX_SCORE,
      message: "No Open Graph tags (og:title, og:description, og:image) were found.",
      recommendation: "Add og:title, og:description, and og:image meta tags in the <head>.",
    };
  }

  const missing: string[] = [];
  if (!title) missing.push("og:title");
  if (!description) missing.push("og:description");
  if (!image) missing.push("og:image");

  return {
    id: "open-graph",
    category: "social",
    title: "Open Graph",
    status: "warning",
    score: Math.round((present / 3) * MAX_SCORE),
    maxScore: MAX_SCORE,
    message: `Missing Open Graph tags: ${missing.join(", ")}.`,
    recommendation: "Complete og:title, og:description, and og:image for richer social previews.",
  };
}
