import { describe, expect, it } from "vitest";
import { enrichChecksWithRecommendations } from "@/lib/seo/recommendations";
import type { FrameworkDetection, SeoCheckResult } from "@/lib/seo/types";

const unknownFramework: FrameworkDetection = {
  framework: "unknown",
  label: "Unknown",
  confidence: "low",
  evidence: [],
};

const nextFramework: FrameworkDetection = {
  framework: "nextjs",
  label: "Next.js",
  confidence: "high",
  evidence: ["Found __NEXT_DATA__ in HTML"],
};

function baseCheck(
  partial: Pick<SeoCheckResult, "id" | "status"> & Partial<SeoCheckResult>,
): SeoCheckResult {
  return {
    id: partial.id,
    category: partial.category ?? "content",
    title: partial.title ?? partial.id,
    status: partial.status,
    score: partial.score ?? 0,
    maxScore: partial.maxScore ?? 10,
    message: partial.message ?? "message",
    recommendation: partial.recommendation ?? "original",
  };
}

describe("enrichChecksWithRecommendations", () => {
  it("adds Next.js code examples for failing title checks", () => {
    const [enriched] = enrichChecksWithRecommendations(
      [baseCheck({ id: "title", status: "error" })],
      nextFramework,
    );

    expect(enriched.recommendation).toMatch(/Metadata API|generateMetadata/);
    expect(enriched.fixExamples?.length).toBeGreaterThan(0);
    expect(enriched.fixExamples?.[0]?.code).toContain("Metadata");
    expect(enriched.fixExamples?.[0]?.note).toMatch(/App Router/);
  });

  it("labels Next.js examples as optional when framework is unknown", () => {
    const [enriched] = enrichChecksWithRecommendations(
      [baseCheck({ id: "canonical", status: "error" })],
      unknownFramework,
    );

    expect(enriched.fixExamples?.[0]?.note).toMatch(/use only if/i);
  });

  it("does not attach bulky examples on passing checks", () => {
    const [enriched] = enrichChecksWithRecommendations(
      [baseCheck({ id: "title", status: "pass", score: 10 })],
      nextFramework,
    );

    expect(enriched.fixExamples).toBeUndefined();
    expect(enriched.recommendation.length).toBeGreaterThan(0);
  });

  it("provides robots.ts and sitemap.ts guidance", () => {
    const enriched = enrichChecksWithRecommendations(
      [
        baseCheck({ id: "robots", status: "warning", score: 3 }),
        baseCheck({ id: "sitemap", status: "warning", score: 3 }),
      ],
      nextFramework,
    );

    expect(enriched[0]?.fixExamples?.[0]?.code).toContain("MetadataRoute.Robots");
    expect(enriched[1]?.fixExamples?.[0]?.code).toContain("MetadataRoute.Sitemap");
  });

  it("keeps https guidance free of metadata-only claims", () => {
    const [enriched] = enrichChecksWithRecommendations(
      [baseCheck({ id: "https", status: "error" })],
      nextFramework,
    );

    expect(enriched.fixExamples).toBeUndefined();
    expect(enriched.recommendation).toMatch(/HTTPS/i);
    expect(enriched.recommendation).not.toMatch(/metadata\.title/i);
  });
});
