import type { CheerioAPI } from "cheerio";
import type { SeoCheckResult } from "@/lib/seo/types";

const MAX_SCORE = 10;

export function checkH1($: CheerioAPI): SeoCheckResult {
  const h1s = $("h1")
    .toArray()
    .map((el) => $(el).text().replace(/\s+/g, " ").trim())
    .filter(Boolean);

  if (h1s.length === 0) {
    return {
      id: "h1",
      category: "content",
      title: "H1",
      status: "error",
      score: 0,
      maxScore: MAX_SCORE,
      message: "No H1 heading was found on the page.",
      recommendation: "Add a single clear H1 that describes the main topic of the page.",
    };
  }

  if (h1s.length > 1) {
    return {
      id: "h1",
      category: "content",
      title: "H1",
      status: "warning",
      score: 5,
      maxScore: MAX_SCORE,
      message: `Found ${h1s.length} H1 headings. Ideally there should be only one.`,
      recommendation: "Keep a single H1 and use H2/H3 for subsections.",
    };
  }

  return {
    id: "h1",
    category: "content",
    title: "H1",
    status: "pass",
    score: MAX_SCORE,
    maxScore: MAX_SCORE,
    message: "A single non-empty H1 was found.",
    recommendation: "Ensure the H1 matches the page intent and title when relevant.",
  };
}

export function checkHeadings($: CheerioAPI): SeoCheckResult {
  const h1Count = $("h1").length;
  const h2Count = $("h2").length;
  const h3Count = $("h3").length;

  if (h1Count === 0 && h2Count === 0 && h3Count === 0) {
    return {
      id: "headings",
      category: "content",
      title: "Headings",
      status: "error",
      score: 0,
      maxScore: MAX_SCORE,
      message: "No H1, H2, or H3 headings were found.",
      recommendation: "Add a logical heading hierarchy (H1 → H2 → H3) to structure content.",
    };
  }

  // Manifestly incoherent: H3s present without any H2, or many H3s with no H1
  const skippedLevel = h3Count > 0 && h2Count === 0;
  const missingTop = h1Count === 0 && (h2Count > 0 || h3Count > 0);

  if (skippedLevel && missingTop) {
    return {
      id: "headings",
      category: "content",
      title: "Headings",
      status: "warning",
      score: 3,
      maxScore: MAX_SCORE,
      message: "Heading structure looks inconsistent (missing H1 and H2 before H3).",
      recommendation: "Start with one H1, then H2 sections, then H3 subsections.",
    };
  }

  if (skippedLevel) {
    return {
      id: "headings",
      category: "content",
      title: "Headings",
      status: "warning",
      score: 5,
      maxScore: MAX_SCORE,
      message: `Found ${h3Count} H3 heading(s) without any H2.`,
      recommendation: "Avoid skipping heading levels; add H2 sections before H3s.",
    };
  }

  if (missingTop) {
    return {
      id: "headings",
      category: "content",
      title: "Headings",
      status: "warning",
      score: 5,
      maxScore: MAX_SCORE,
      message: "Headings exist but there is no H1 at the top of the hierarchy.",
      recommendation: "Add a primary H1 before nested H2/H3 headings.",
    };
  }

  if (h2Count === 0 && h1Count === 1) {
    return {
      id: "headings",
      category: "content",
      title: "Headings",
      status: "warning",
      score: 7,
      maxScore: MAX_SCORE,
      message: "Only an H1 was found — consider adding H2 sections for longer pages.",
      recommendation: "Break content into H2 sections when the page has multiple topics.",
    };
  }

  return {
    id: "headings",
    category: "content",
    title: "Headings",
    status: "pass",
    score: MAX_SCORE,
    maxScore: MAX_SCORE,
    message: `Heading structure looks coherent (H1: ${h1Count}, H2: ${h2Count}, H3: ${h3Count}).`,
    recommendation: "Keep heading levels sequential and descriptive.",
  };
}
