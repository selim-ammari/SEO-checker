import { describe, expect, it } from "vitest";
import {
  calculateOverallScore,
  getGrade,
  summarizeChecks,
} from "@/lib/seo/scoring";
import type { SeoCheckResult } from "@/lib/seo/types";

function check(
  partial: Pick<SeoCheckResult, "status" | "score"> & { id?: string },
): SeoCheckResult {
  return {
    id: partial.id ?? "x",
    category: "technical",
    title: "X",
    status: partial.status,
    score: partial.score,
    maxScore: 10,
    message: "",
    recommendation: "",
  };
}

describe("calculateOverallScore", () => {
  it("returns 0 for empty results", () => {
    expect(calculateOverallScore([])).toBe(0);
  });

  it("sums scores against max scores", () => {
    const results = [check({ status: "pass", score: 10 }), check({ status: "error", score: 0 })];
    expect(calculateOverallScore(results)).toBe(50);
  });

  it("rounds to nearest integer", () => {
    const results = [
      check({ status: "warning", score: 7 }),
      check({ status: "pass", score: 10 }),
      check({ status: "pass", score: 10 }),
    ];
    // 27/30 = 90
    expect(calculateOverallScore(results)).toBe(90);
  });
});

describe("getGrade", () => {
  it("maps score ranges", () => {
    expect(getGrade(95)).toBe("Excellent");
    expect(getGrade(80)).toBe("Good");
    expect(getGrade(60)).toBe("Needs improvement");
    expect(getGrade(20)).toBe("Poor");
  });
});

describe("summarizeChecks", () => {
  it("counts statuses", () => {
    expect(
      summarizeChecks([
        check({ status: "pass", score: 10 }),
        check({ status: "warning", score: 5 }),
        check({ status: "error", score: 0 }),
        check({ status: "pass", score: 10 }),
      ]),
    ).toEqual({ passed: 2, warnings: 1, errors: 1 });
  });
});
