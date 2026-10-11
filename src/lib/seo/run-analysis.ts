import { resourceExists, safeFetch, SafeFetchError } from "@/lib/security/fetch-safe";
import { UrlValidationError } from "@/lib/security/url-validation";
import { analyzePage } from "@/lib/seo/analyzer";
import type { AnalysisResult } from "@/lib/seo/types";

export type AnalyzeServiceError = {
  status: number;
  code: string;
  message: string;
};

export type AnalyzeServiceSuccess = {
  ok: true;
  data: AnalysisResult;
};

export type AnalyzeServiceFailure = {
  ok: false;
  error: AnalyzeServiceError;
};

function isHtmlContentType(contentType: string | null): boolean {
  if (!contentType) return true; // some servers omit it; still try to parse
  const normalized = contentType.toLowerCase();
  return (
    normalized.includes("text/html") ||
    normalized.includes("application/xhtml+xml")
  );
}

function mapError(error: unknown): AnalyzeServiceError {
  if (error instanceof UrlValidationError) {
    return {
      status: 400,
      code: error.code,
      message: error.message,
    };
  }

  if (error instanceof SafeFetchError) {
    const status =
      error.code === "TIMEOUT" || error.code === "NETWORK_ERROR"
        ? 502
        : error.code === "RESPONSE_TOO_LARGE"
          ? 413
          : error.code === "HTTP_ERROR"
            ? 502
            : 400;

    return {
      status,
      code: error.code,
      message: error.message,
    };
  }

  return {
    status: 500,
    code: "INTERNAL_ERROR",
    message: "Something went wrong while analyzing this website. Please try again.",
  };
}

export async function runAnalysis(rawUrl: string): Promise<
  AnalyzeServiceSuccess | AnalyzeServiceFailure
> {
  try {
    const page = await safeFetch(rawUrl);

    if (!isHtmlContentType(page.contentType)) {
      return {
        ok: false,
        error: {
          status: 415,
          code: "NOT_HTML",
          message: "The URL did not return an HTML page we can analyze.",
        },
      };
    }

    const finalUrl = new URL(page.finalUrl);
    const origin = finalUrl.origin;

    const [robotsExists, sitemapExists] = await Promise.all([
      resourceExists(`${origin}/robots.txt`),
      resourceExists(`${origin}/sitemap.xml`),
    ]);

    const data = analyzePage({
      url: page.url,
      finalUrl: page.finalUrl,
      html: page.body,
      isHttps: finalUrl.protocol === "https:",
      robotsExists,
      sitemapExists,
    });

    return {
      ok: true,
      data: {
        ...data,
        analyzedAt: new Date().toISOString(),
      },
    };
  } catch (error) {
    return { ok: false, error: mapError(error) };
  }
}
