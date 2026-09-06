import * as cheerio from "cheerio";
import { describe, expect, it } from "vitest";
import { checkMetaDescription } from "@/lib/seo/checks/meta-description";
import { perfectHtml, missingBasicsHtml } from "@/lib/seo/__fixtures__/html";

describe("checkMetaDescription", () => {
  it("passes for a good description", () => {
    const result = checkMetaDescription(cheerio.load(perfectHtml));
    expect(result.status).toBe("pass");
    expect(result.score).toBe(10);
  });

  it("errors when missing", () => {
    const result = checkMetaDescription(cheerio.load(missingBasicsHtml));
    expect(result.status).toBe("error");
    expect(result.score).toBe(0);
  });

  it("warns when too long", () => {
    const html = `<html><head><meta name="description" content="${"d".repeat(200)}" /></head></html>`;
    const result = checkMetaDescription(cheerio.load(html));
    expect(result.status).toBe("warning");
  });
});
