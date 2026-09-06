import * as cheerio from "cheerio";
import { describe, expect, it } from "vitest";
import { checkImages } from "@/lib/seo/checks/images";
import { missingBasicsHtml, perfectHtml } from "@/lib/seo/__fixtures__/html";

describe("checkImages", () => {
  it("passes when all images have alt", () => {
    const result = checkImages(cheerio.load(perfectHtml));
    expect(result.status).toBe("pass");
    expect(result.score).toBe(10);
  });

  it("errors when many images miss alt", () => {
    const result = checkImages(cheerio.load(missingBasicsHtml));
    expect(result.status).toBe("error");
    expect(result.score).toBe(0);
    expect(result.message).toContain("2 of 2");
  });

  it("passes when there are no images", () => {
    const result = checkImages(cheerio.load("<html><body><p>Hi</p></body></html>"));
    expect(result.status).toBe("pass");
    expect(result.score).toBe(10);
  });

  it("scores by alt ratio", () => {
    const html = `
      <img alt="one" /><img alt="two" /><img /><img /><img />
    `;
    const result = checkImages(cheerio.load(html));
    expect(result.score).toBe(4);
    expect(result.status).toBe("error");
  });
});
