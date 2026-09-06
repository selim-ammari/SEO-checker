import * as cheerio from "cheerio";
import { describe, expect, it } from "vitest";
import { checkTitle } from "@/lib/seo/checks/title";
import { perfectHtml, missingBasicsHtml } from "@/lib/seo/__fixtures__/html";

describe("checkTitle", () => {
  it("passes for a good title", () => {
    const result = checkTitle(cheerio.load(perfectHtml));
    expect(result.status).toBe("pass");
    expect(result.score).toBe(10);
  });

  it("errors when title is missing", () => {
    const result = checkTitle(cheerio.load(missingBasicsHtml));
    expect(result.status).toBe("error");
    expect(result.score).toBe(0);
  });

  it("warns when title is too long", () => {
    const html = `<html><head><title>${"A".repeat(80)}</title></head><body></body></html>`;
    const result = checkTitle(cheerio.load(html));
    expect(result.status).toBe("warning");
    expect(result.score).toBe(7);
  });
});
