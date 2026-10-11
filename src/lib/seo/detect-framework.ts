import type { CheerioAPI } from "cheerio";
import type { FrameworkDetection } from "@/lib/seo/types";

/**
 * Best-effort framework detection from already-fetched HTML only.
 * Missing Next.js markers never prove the site is not Next.js
 * (SSG/export and aggressive HTML minimization can hide signals).
 */
export function detectFramework($: CheerioAPI): FrameworkDetection {
  const html = $.root().html() ?? "";
  const evidence: string[] = [];

  const hasNextData = html.includes("__NEXT_DATA__");
  const hasNextStatic = /\/_next\/static\//.test(html);
  const hasNextRoot = $("#__next").length > 0 || $("[id='__next']").length > 0;
  const generator = $('meta[name="generator"]').attr("content")?.toLowerCase() ?? "";
  const hasNextGenerator = generator.includes("next.js") || generator.includes("nextjs");

  if (hasNextData) evidence.push("Found __NEXT_DATA__ in HTML");
  if (hasNextStatic) evidence.push("Found /_next/static/ asset paths");
  if (hasNextRoot) evidence.push("Found #__next root element");
  if (hasNextGenerator) evidence.push(`Found generator meta: ${generator}`);

  const nextSignalCount = [hasNextData, hasNextStatic, hasNextRoot, hasNextGenerator].filter(
    Boolean,
  ).length;

  if (nextSignalCount >= 2 || hasNextData) {
    return {
      framework: "nextjs",
      label: "Next.js",
      confidence: hasNextData || nextSignalCount >= 2 ? "high" : "medium",
      evidence,
    };
  }

  if (nextSignalCount === 1) {
    return {
      framework: "nextjs",
      label: "Next.js (likely)",
      confidence: "medium",
      evidence,
    };
  }

  const hasNuxt =
    html.includes("__NUXT__") ||
    /\/_nuxt\//.test(html) ||
    generator.includes("nuxt");

  if (hasNuxt) {
    const nuxtEvidence: string[] = [];
    if (html.includes("__NUXT__")) nuxtEvidence.push("Found __NUXT__ in HTML");
    if (/\/_nuxt\//.test(html)) nuxtEvidence.push("Found /_nuxt/ asset paths");
    if (generator.includes("nuxt")) nuxtEvidence.push(`Found generator meta: ${generator}`);

    return {
      framework: "nuxt",
      label: "Nuxt",
      confidence: "medium",
      evidence: nuxtEvidence,
    };
  }

  // Weak React SPA markers — only when Next/Nuxt are absent.
  // Do not treat generic React usage (or Vercel hosting) as Next.js.
  const hasReactRoot =
    $("[data-reactroot]").length > 0 || html.includes("data-reactroot");
  const hasReactId = html.includes("data-reactid");

  if (hasReactRoot || hasReactId) {
    return {
      framework: "react",
      label: "React (possible SPA)",
      confidence: "low",
      evidence: [
        hasReactRoot ? "Found data-reactroot attribute" : "Found data-reactid attribute",
      ],
    };
  }

  return {
    framework: "unknown",
    label: "Unknown",
    confidence: "low",
    evidence: [],
  };
}
