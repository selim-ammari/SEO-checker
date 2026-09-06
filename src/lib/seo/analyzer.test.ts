import * as cheerio from "cheerio";
import { describe, expect, it } from "vitest";
import { analyzePage } from "@/lib/seo/analyzer";
import { perfectHtml, missingBasicsHtml } from "@/lib/seo/__fixtures__/html";

describe("analyzePage", () => {
  it("returns a full analysis with grade and summary", () => {
    const result = analyzePage({
      url: "https://example.com/",
      finalUrl: "https://example.com/",
      html: perfectHtml,
      isHttps: true,
      robotsExists: true,
      sitemapExists: true,
    });

    expect(result.score).toBe(100);
    expect(result.grade).toBe("Excellent");
    expect(result.checks).toHaveLength(10);
    expect(result.summary.passed).toBe(10);
  });

  it("scores poorly for missing basics", () => {
    const result = analyzePage({
      url: "http://example.com/",
      finalUrl: "http://example.com/",
      html: missingBasicsHtml,
      isHttps: false,
      robotsExists: false,
      sitemapExists: false,
    });

    expect(result.score).toBeLessThan(50);
    expect(result.grade).toBe("Poor");
    expect(result.summary.errors).toBeGreaterThan(0);
  });

  it("parses with cheerio without executing scripts", () => {
    const html = `<html><body><script>throw new Error('boom')</script><h1>Ok</h1></body></html>`;
    const $ = cheerio.load(html);
    expect($("h1").text()).toBe("Ok");
  });
});
