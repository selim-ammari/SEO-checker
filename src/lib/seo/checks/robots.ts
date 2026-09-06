import type { SeoCheckResult } from "@/lib/seo/types";

const MAX_SCORE = 10;

export function checkRobots(exists: boolean): SeoCheckResult {
  if (exists) {
    return {
      id: "robots",
      category: "technical",
      title: "robots.txt",
      status: "pass",
      score: MAX_SCORE,
      maxScore: MAX_SCORE,
      message: "A robots.txt file was found at the site root.",
      recommendation: "Review crawl rules periodically so important pages stay indexable.",
    };
  }

  return {
    id: "robots",
    category: "technical",
    title: "robots.txt",
    status: "warning",
    score: 3,
    maxScore: MAX_SCORE,
    message: "No robots.txt file was found at /robots.txt.",
    recommendation: "Add a robots.txt file to guide crawlers and declare your sitemap.",
  };
}
