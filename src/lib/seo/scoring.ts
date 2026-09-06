import type {
  AnalysisSummary,
  Grade,
  SeoCheckResult,
} from "@/lib/seo/types";

export function calculateOverallScore(results: SeoCheckResult[]): number {
  if (results.length === 0) return 0;

  const earned = results.reduce((sum, check) => sum + check.score, 0);
  const max = results.reduce((sum, check) => sum + check.maxScore, 0);

  if (max === 0) return 0;

  return Math.round((earned / max) * 100);
}

export function getGrade(score: number): Grade {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Good";
  if (score >= 50) return "Needs improvement";
  return "Poor";
}

export function summarizeChecks(results: SeoCheckResult[]): AnalysisSummary {
  return results.reduce<AnalysisSummary>(
    (acc, check) => {
      if (check.status === "pass") acc.passed += 1;
      else if (check.status === "warning") acc.warnings += 1;
      else acc.errors += 1;
      return acc;
    },
    { passed: 0, warnings: 0, errors: 0 },
  );
}
