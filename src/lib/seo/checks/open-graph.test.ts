import * as cheerio from "cheerio";
import { describe, expect, it } from "vitest";
import { checkOpenGraph } from "@/lib/seo/checks/open-graph";
import { missingBasicsHtml, perfectHtml } from "@/lib/seo/__fixtures__/html";

describe("checkOpenGraph", () => {
  it("passes when all required tags exist", () => {
    const result = checkOpenGraph(cheerio.load(perfectHtml));
    expect(result.status).toBe("pass");
    expect(result.score).toBe(10);
  });

  it("errors when none exist", () => {
    const result = checkOpenGraph(cheerio.load(missingBasicsHtml));
    expect(result.status).toBe("error");
    expect(result.score).toBe(0);
  });

  it("warns when partially present", () => {
    const html = `<html><head><meta property="og:title" content="Hi" /></head></html>`;
    const result = checkOpenGraph(cheerio.load(html));
    expect(result.status).toBe("warning");
    expect(result.score).toBe(3);
  });
});
