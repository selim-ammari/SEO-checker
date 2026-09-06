import * as cheerio from "cheerio";
import { describe, expect, it } from "vitest";
import { checkH1, checkHeadings } from "@/lib/seo/checks/headings";
import {
  messyHeadingsHtml,
  multipleH1Html,
  perfectHtml,
  missingBasicsHtml,
} from "@/lib/seo/__fixtures__/html";

describe("checkH1", () => {
  it("passes with a single H1", () => {
    expect(checkH1(cheerio.load(perfectHtml)).status).toBe("pass");
  });

  it("errors when missing", () => {
    expect(checkH1(cheerio.load(missingBasicsHtml)).status).toBe("error");
  });

  it("warns with multiple H1s", () => {
    const result = checkH1(cheerio.load(multipleH1Html));
    expect(result.status).toBe("warning");
    expect(result.score).toBe(5);
  });
});

describe("checkHeadings", () => {
  it("passes for coherent structure", () => {
    expect(checkHeadings(cheerio.load(perfectHtml)).status).toBe("pass");
  });

  it("warns on skipped levels", () => {
    const result = checkHeadings(cheerio.load(messyHeadingsHtml));
    expect(result.status).toBe("warning");
  });

  it("errors when no headings exist", () => {
    expect(checkHeadings(cheerio.load(missingBasicsHtml)).status).toBe("error");
  });
});
