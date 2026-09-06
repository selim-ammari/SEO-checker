import type { SeoCheckResult } from "@/lib/seo/types";

const MAX_SCORE = 10;

export function checkSitemap(exists: boolean): SeoCheckResult {
  if (exists) {
    return {
      id: "sitemap",
      category: "technical",
      title: "sitemap.xml",
      status: "pass",
      score: MAX_SCORE,
      maxScore: MAX_SCORE,
      message: "A sitemap.xml file was found at the site root.",
      recommendation: "Keep the sitemap updated as you publish or remove pages.",
    };
  }

  return {
    id: "sitemap",
    category: "technical",
    title: "sitemap.xml",
    status: "warning",
    score: 3,
    maxScore: MAX_SCORE,
    message: "No sitemap.xml file was found at /sitemap.xml.",
    recommendation: "Publish an XML sitemap and reference it in robots.txt.",
  };
}
