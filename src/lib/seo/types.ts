export type CheckCategory = "technical" | "content" | "social";
export type CheckStatus = "pass" | "warning" | "error";

export type SeoCheckResult = {
  id: string;
  category: CheckCategory;
  title: string;
  status: CheckStatus;
  score: number;
  maxScore: number;
  message: string;
  recommendation: string;
};

export type Grade = "Excellent" | "Good" | "Needs improvement" | "Poor";

export type AnalysisSummary = {
  passed: number;
  warnings: number;
  errors: number;
};

export type AnalysisResult = {
  url: string;
  finalUrl: string;
  score: number;
  grade: Grade;
  checks: SeoCheckResult[];
  summary: AnalysisSummary;
};

export type AnalyzePageInput = {
  url: string;
  finalUrl: string;
  html: string;
  isHttps: boolean;
  robotsExists: boolean;
  sitemapExists: boolean;
};
