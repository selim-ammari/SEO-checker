export type CheckCategory = "technical" | "content" | "social";
export type CheckStatus = "pass" | "warning" | "error";

export type CodeExample = {
  language: "typescript" | "tsx" | "text";
  label: string;
  code: string;
  /** Clarifies that this is guidance, not an auto-verified fix */
  note?: string;
};

export type FrameworkId = "nextjs" | "nuxt" | "react" | "unknown";

export type FrameworkDetection = {
  framework: FrameworkId;
  label: string;
  confidence: "high" | "medium" | "low";
  evidence: string[];
};

export type SeoCheckResult = {
  id: string;
  category: CheckCategory;
  title: string;
  status: CheckStatus;
  score: number;
  maxScore: number;
  message: string;
  recommendation: string;
  /** Optional developer-oriented code samples (e.g. Next.js App Router) */
  fixExamples?: CodeExample[];
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
  /** ISO-8601 timestamp when the analysis completed */
  analyzedAt?: string;
  framework?: FrameworkDetection;
};

export type AnalyzePageInput = {
  url: string;
  finalUrl: string;
  html: string;
  isHttps: boolean;
  robotsExists: boolean;
  sitemapExists: boolean;
};
