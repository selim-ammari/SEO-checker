import type { CheerioAPI } from "cheerio";
import type { SeoCheckResult } from "@/lib/seo/types";

const TITLE_MIN = 30;
const TITLE_MAX = 60;
const MAX_SCORE = 10;

export function checkTitle($: CheerioAPI): SeoCheckResult {
  const title = $("title").first().text().replace(/\s+/g, " ").trim();

  if (!title) {
    return {
      id: "title",
      category: "content",
      title: "Title",
      status: "error",
      score: 0,
      maxScore: MAX_SCORE,
      message: "No title tag was found on the page.",
      recommendation:
        "Add a unique <title> between about 30 and 60 characters that describes the page.",
    };
  }

  const length = title.length;

  if (length < 15) {
    return {
      id: "title",
      category: "content",
      title: "Title",
      status: "warning",
      score: 4,
      maxScore: MAX_SCORE,
      message: `Your title is too short (${length} characters).`,
      recommendation: `Expand your title to roughly ${TITLE_MIN}–${TITLE_MAX} characters for better SERP display.`,
    };
  }

  if (length < TITLE_MIN) {
    return {
      id: "title",
      category: "content",
      title: "Title",
      status: "warning",
      score: 7,
      maxScore: MAX_SCORE,
      message: `Your title is a bit short (${length} characters).`,
      recommendation: `Aim for about ${TITLE_MIN}–${TITLE_MAX} characters to improve clarity in search results.`,
    };
  }

  if (length > TITLE_MAX) {
    return {
      id: "title",
      category: "content",
      title: "Title",
      status: "warning",
      score: 7,
      maxScore: MAX_SCORE,
      message: `Your title is a bit long (${length} characters).`,
      recommendation: `Shorten your title to about ${TITLE_MIN}–${TITLE_MAX} characters to avoid truncation.`,
    };
  }

  return {
    id: "title",
    category: "content",
    title: "Title",
    status: "pass",
    score: MAX_SCORE,
    maxScore: MAX_SCORE,
    message: "Your title is present and has a good length.",
    recommendation: "Keep titles unique and descriptive for every important page.",
  };
}
