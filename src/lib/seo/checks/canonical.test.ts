import * as cheerio from "cheerio";
import { describe, expect, it } from "vitest";
import { checkCanonical } from "@/lib/seo/checks/canonical";
import { missingBasicsHtml, perfectHtml } from "@/lib/seo/__fixtures__/html";

describe("checkCanonical", () => {
  it("passes when canonical exists", () => {
    const result = checkCanonical(cheerio.load(perfectHtml));
    expect(result.status).toBe("pass");
    expect(result.score).toBe(10);
  });

  it("errors when missing", () => {
    const result = checkCanonical(cheerio.load(missingBasicsHtml));
    expect(result.status).toBe("error");
    expect(result.score).toBe(0);
  });
});
