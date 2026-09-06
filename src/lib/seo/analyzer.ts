import * as cheerio from "cheerio";
import { checkCanonical } from "@/lib/seo/checks/canonical";
import { checkH1, checkHeadings } from "@/lib/seo/checks/headings";
import { checkHttps } from "@/lib/seo/checks/https";
import { checkImages } from "@/lib/seo/checks/images";
import { checkMetaDescription } from "@/lib/seo/checks/meta-description";
import { checkOpenGraph } from "@/lib/seo/checks/open-graph";
import { checkRobots } from "@/lib/seo/checks/robots";
import { checkSitemap } from "@/lib/seo/checks/sitemap";
import { checkTitle } from "@/lib/seo/checks/title";
import {
  calculateOverallScore,
  getGrade,
  summarizeChecks,
} from "@/lib/seo/scoring";
import type { AnalysisResult, AnalyzePageInput } from "@/lib/seo/types";

export function analyzePage(input: AnalyzePageInput): AnalysisResult {
  const $ = cheerio.load(input.html);

  const checks = [
    checkHttps(input.isHttps),
    checkTitle($),
    checkMetaDescription($),
    checkH1($),
    checkHeadings($),
    checkImages($),
    checkCanonical($),
    checkOpenGraph($),
    checkRobots(input.robotsExists),
    checkSitemap(input.sitemapExists),
  ];

  const score = calculateOverallScore(checks);

  return {
    url: input.url,
    finalUrl: input.finalUrl,
    score,
    grade: getGrade(score),
    checks,
    summary: summarizeChecks(checks),
  };
}
