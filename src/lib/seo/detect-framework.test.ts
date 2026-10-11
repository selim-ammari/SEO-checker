import * as cheerio from "cheerio";
import { describe, expect, it } from "vitest";
import { detectFramework } from "@/lib/seo/detect-framework";
import {
  missingBasicsHtml,
  nextJsHtml,
  nuxtHtml,
  perfectHtml,
} from "@/lib/seo/__fixtures__/html";

describe("detectFramework", () => {
  it("detects Next.js from strong HTML markers", () => {
    const result = detectFramework(cheerio.load(nextJsHtml));
    expect(result.framework).toBe("nextjs");
    expect(result.confidence).toBe("high");
    expect(result.evidence.length).toBeGreaterThan(0);
  });

  it("returns unknown when no reliable markers exist", () => {
    const result = detectFramework(cheerio.load(perfectHtml));
    expect(result.framework).toBe("unknown");
    expect(result.label).toBe("Unknown");
  });

  it("does not treat missing Next markers as proof against Next.js", () => {
    const result = detectFramework(cheerio.load(missingBasicsHtml));
    expect(result.framework).toBe("unknown");
    expect(result.confidence).toBe("low");
  });

  it("detects Nuxt when Nuxt markers are present", () => {
    const result = detectFramework(cheerio.load(nuxtHtml));
    expect(result.framework).toBe("nuxt");
  });

  it("detects weak React SPA markers with low confidence", () => {
    const html = `<div data-reactroot><h1>App</h1></div>`;
    const result = detectFramework(cheerio.load(html));
    expect(result.framework).toBe("react");
    expect(result.confidence).toBe("low");
  });

  it("does not claim Next.js from a vercel asset string alone", () => {
    const html = `<html><body><img src="https://assets.vercel.com/logo.png" /></body></html>`;
    const result = detectFramework(cheerio.load(html));
    expect(result.framework).toBe("unknown");
  });
});
