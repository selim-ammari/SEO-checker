import { describe, expect, it } from "vitest";
import {
  buildExportFilename,
  toJsonReport,
  toMarkdownReport,
} from "@/lib/seo/export-report";
import type { AnalysisResult } from "@/lib/seo/types";

function sampleResult(overrides: Partial<AnalysisResult> = {}): AnalysisResult {
  return {
    url: "https://example.com/path",
    finalUrl: "https://www.example.com/path",
    score: 76,
    grade: "Good",
    analyzedAt: "2026-10-11T12:00:00.000Z",
    framework: {
      framework: "nextjs",
      label: "Next.js",
      confidence: "high",
      evidence: ["Found __NEXT_DATA__ in HTML"],
    },
    summary: { passed: 7, warnings: 2, errors: 1 },
    checks: [
      {
        id: "title",
        category: "content",
        title: "Title",
        status: "error",
        score: 0,
        maxScore: 10,
        message: "No title tag was found on the page.",
        recommendation: "Add a unique page title.",
        fixExamples: [
          {
            language: "typescript",
            label: "Static metadata",
            code: "export const metadata = { title: 'Hello' };",
            note: "Example for Next.js App Router",
          },
        ],
      },
      {
        id: "https",
        category: "technical",
        title: "HTTPS",
        status: "pass",
        score: 10,
        maxScore: 10,
        message: "The page is served over HTTPS.",
        recommendation: "Keep HTTPS enabled.",
      },
    ],
    ...overrides,
  };
}

describe("buildExportFilename", () => {
  it("uses hostname and date stamp", () => {
    const name = buildExportFilename(
      sampleResult(),
      "md",
      new Date("2026-01-02T00:00:00.000Z"),
    );
    expect(name).toBe("seo-report-www.example.com-20261011.md");
  });

  it("falls back safely for invalid URLs", () => {
    const name = buildExportFilename(
      {
        url: "not-a-url",
        finalUrl: "also-bad",
      },
      "json",
      new Date("2026-05-06T00:00:00.000Z"),
    );
    expect(name).toBe("seo-report-website-20260506.json");
  });

  it("uses provided now when analyzedAt is missing", () => {
    const name = buildExportFilename(
      {
        url: "https://docs.example.org/",
        finalUrl: "https://docs.example.org/",
      },
      "md",
      new Date("2026-07-08T00:00:00.000Z"),
    );
    expect(name).toBe("seo-report-docs.example.org-20260708.md");
  });
});

describe("toJsonReport", () => {
  it("returns valid JSON with checks and examples", () => {
    const raw = toJsonReport(sampleResult());
    const parsed = JSON.parse(raw) as {
      score: number;
      analyzedAt: string | null;
      checks: Array<{ fixExamples: unknown[] }>;
      framework: { framework: string } | null;
    };

    expect(parsed.score).toBe(76);
    expect(parsed.analyzedAt).toBe("2026-10-11T12:00:00.000Z");
    expect(parsed.framework?.framework).toBe("nextjs");
    expect(parsed.checks[0]?.fixExamples).toHaveLength(1);
  });

  it("handles missing optional fields", () => {
    const raw = toJsonReport(
      sampleResult({
        analyzedAt: undefined,
        framework: undefined,
        checks: [
          {
            id: "https",
            category: "technical",
            title: "HTTPS",
            status: "pass",
            score: 10,
            maxScore: 10,
            message: "ok",
            recommendation: "ok",
          },
        ],
      }),
    );
    const parsed = JSON.parse(raw) as {
      analyzedAt: string | null;
      framework: unknown;
      checks: Array<{ fixExamples: unknown[] }>;
    };

    expect(parsed.analyzedAt).toBeNull();
    expect(parsed.framework).toBeNull();
    expect(parsed.checks[0]?.fixExamples).toEqual([]);
  });
});

describe("toMarkdownReport", () => {
  it("includes score, summary, recommendations, and code blocks", () => {
    const md = toMarkdownReport(sampleResult());
    expect(md).toContain("# SEO technical report");
    expect(md).toContain("**Score:** 76/100");
    expect(md).toContain("### Title (ERROR)");
    expect(md).toContain("Add a unique page title.");
    expect(md).toContain("```typescript");
    expect(md).toContain("export const metadata");
  });

  it("handles missing analyzedAt and framework", () => {
    const md = toMarkdownReport(
      sampleResult({ analyzedAt: undefined, framework: undefined }),
    );
    expect(md).toContain("Not available");
    expect(md).toContain("Unknown");
  });
});
