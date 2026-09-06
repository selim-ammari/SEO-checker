import type { CheerioAPI } from "cheerio";
import type { SeoCheckResult } from "@/lib/seo/types";

const MAX_SCORE = 10;

export function checkImages($: CheerioAPI): SeoCheckResult {
  const images = $("img").toArray();
  const total = images.length;

  if (total === 0) {
    return {
      id: "images",
      category: "content",
      title: "Images",
      status: "pass",
      score: MAX_SCORE,
      maxScore: MAX_SCORE,
      message: "No images found on the page.",
      recommendation:
        "When you add images, include descriptive alt text for accessibility and SEO.",
    };
  }

  let withAlt = 0;
  for (const img of images) {
    const alt = $(img).attr("alt");
    if (typeof alt === "string" && alt.trim().length > 0) {
      withAlt += 1;
    }
  }

  const withoutAlt = total - withAlt;
  const ratio = withAlt / total;
  const score = Math.round(ratio * MAX_SCORE);

  if (withoutAlt === 0) {
    return {
      id: "images",
      category: "content",
      title: "Images",
      status: "pass",
      score: MAX_SCORE,
      maxScore: MAX_SCORE,
      message: `All ${total} images have alt text.`,
      recommendation: "Continue using concise, descriptive alt text for meaningful images.",
    };
  }

  if (ratio >= 0.7) {
    return {
      id: "images",
      category: "content",
      title: "Images",
      status: "warning",
      score,
      maxScore: MAX_SCORE,
      message: `${withoutAlt} of ${total} images are missing alt text.`,
      recommendation: "Add descriptive alt attributes to the remaining images.",
    };
  }

  return {
    id: "images",
    category: "content",
    title: "Images",
    status: "error",
    score,
    maxScore: MAX_SCORE,
    message: `${withoutAlt} of ${total} images are missing alt text.`,
    recommendation: "Add meaningful alt text to images that convey content or links.",
  };
}
