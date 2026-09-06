import type { CheerioAPI } from "cheerio";
import type { SeoCheckResult } from "@/lib/seo/types";

const DESC_MIN = 70;
const DESC_MAX = 160;
const MAX_SCORE = 10;

export function checkMetaDescription($: CheerioAPI): SeoCheckResult {
  const description = $('meta[name="description"]')
    .first()
    .attr("content")
    ?.replace(/\s+/g, " ")
    .trim();

  if (!description) {
    return {
      id: "meta-description",
      category: "content",
      title: "Meta description",
      status: "error",
      score: 0,
      maxScore: MAX_SCORE,
      message: "No meta description was found.",
      recommendation:
        "Add a meta description of about 70–160 characters summarizing the page content.",
    };
  }

  const length = description.length;

  if (length < 50) {
    return {
      id: "meta-description",
      category: "content",
      title: "Meta description",
      status: "warning",
      score: 4,
      maxScore: MAX_SCORE,
      message: `Your meta description is too short (${length} characters).`,
      recommendation: `Expand it to roughly ${DESC_MIN}–${DESC_MAX} characters.`,
    };
  }

  if (length < DESC_MIN) {
    return {
      id: "meta-description",
      category: "content",
      title: "Meta description",
      status: "warning",
      score: 7,
      maxScore: MAX_SCORE,
      message: `Your meta description is a bit short (${length} characters).`,
      recommendation: `Aim for about ${DESC_MIN}–${DESC_MAX} characters.`,
    };
  }

  if (length > DESC_MAX) {
    return {
      id: "meta-description",
      category: "content",
      title: "Meta description",
      status: "warning",
      score: 7,
      maxScore: MAX_SCORE,
      message: `Your meta description is too long (${length} characters).`,
      recommendation: `Shorten it to about ${DESC_MIN}–${DESC_MAX} characters to avoid truncation.`,
    };
  }

  return {
    id: "meta-description",
    category: "content",
    title: "Meta description",
    status: "pass",
    score: MAX_SCORE,
    maxScore: MAX_SCORE,
    message: "Your meta description is present and has a good length.",
    recommendation: "Keep descriptions compelling and unique for each page.",
  };
}
