import {
  UrlValidationError,
  validateUrlForFetch,
} from "@/lib/security/url-validation";

export const FETCH_TIMEOUT_MS = 10_000;
export const MAX_RESPONSE_BYTES = 1_500_000; // ~1.5 MB
export const MAX_REDIRECTS = 5;
export const USER_AGENT =
  "SEOChecker/1.0 (+https://seo-checker.local; free SEO health check)";

export class SafeFetchError extends Error {
  readonly code: string;
  readonly statusCode?: number;

  constructor(message: string, code: string, statusCode?: number) {
    super(message);
    this.name = "SafeFetchError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

export type SafeFetchResult = {
  url: string;
  finalUrl: string;
  status: number;
  contentType: string | null;
  body: string;
};

function getRedirectLocation(currentUrl: string, locationHeader: string | null): string {
  if (!locationHeader) {
    throw new SafeFetchError("Redirect response missing Location header", "REDIRECT_INVALID");
  }
  try {
    return new URL(locationHeader, currentUrl).toString();
  } catch {
    throw new SafeFetchError("Redirect Location is invalid", "REDIRECT_INVALID");
  }
}

async function readBodyWithLimit(response: Response, maxBytes: number): Promise<string> {
  const contentLength = response.headers.get("content-length");
  if (contentLength) {
    const length = Number(contentLength);
    if (!Number.isNaN(length) && length > maxBytes) {
      throw new SafeFetchError(
        "The response is too large to analyze",
        "RESPONSE_TOO_LARGE",
      );
    }
  }

  if (!response.body) {
    return "";
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;

    total += value.byteLength;
    if (total > maxBytes) {
      try {
        await reader.cancel();
      } catch {
        // ignore cancel errors
      }
      throw new SafeFetchError(
        "The response is too large to analyze",
        "RESPONSE_TOO_LARGE",
      );
    }
    chunks.push(value);
  }

  const merged = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return new TextDecoder("utf-8", { fatal: false }).decode(merged);
}

export async function safeFetch(
  rawUrl: string,
  options?: {
    timeoutMs?: number;
    maxBytes?: number;
    accept?: string;
  },
): Promise<SafeFetchResult> {
  const timeoutMs = options?.timeoutMs ?? FETCH_TIMEOUT_MS;
  const maxBytes = options?.maxBytes ?? MAX_RESPONSE_BYTES;
  const accept = options?.accept ?? "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8";

  let currentUrl = (await validateUrlForFetch(rawUrl)).toString();
  const initialUrl = currentUrl;

  for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      // Re-validate every hop (including after redirects) to prevent SSRF.
      await validateUrlForFetch(currentUrl);

      const response = await fetch(currentUrl, {
        method: "GET",
        redirect: "manual",
        signal: controller.signal,
        headers: {
          "User-Agent": USER_AGENT,
          Accept: accept,
          "Accept-Language": "en-US,en;q=0.9",
        },
      });

      if (response.status >= 300 && response.status < 400) {
        if (redirectCount === MAX_REDIRECTS) {
          throw new SafeFetchError("Too many redirects", "TOO_MANY_REDIRECTS", response.status);
        }
        currentUrl = getRedirectLocation(currentUrl, response.headers.get("location"));
        continue;
      }

      if (!response.ok) {
        throw new SafeFetchError(
          `The website returned an HTTP ${response.status} error`,
          "HTTP_ERROR",
          response.status,
        );
      }

      const body = await readBodyWithLimit(response, maxBytes);
      const contentType = response.headers.get("content-type");

      return {
        url: initialUrl,
        finalUrl: currentUrl,
        status: response.status,
        contentType,
        body,
      };
    } catch (error) {
      if (error instanceof UrlValidationError || error instanceof SafeFetchError) {
        throw error;
      }

      if (error instanceof Error && error.name === "AbortError") {
        throw new SafeFetchError(
          "The request timed out. Please try again.",
          "TIMEOUT",
        );
      }

      throw new SafeFetchError(
        "Could not reach this website. Please check the URL and try again.",
        "NETWORK_ERROR",
      );
    } finally {
      clearTimeout(timeout);
    }
  }

  throw new SafeFetchError("Too many redirects", "TOO_MANY_REDIRECTS");
}

export async function resourceExists(rawUrl: string): Promise<boolean> {
  try {
    const result = await safeFetch(rawUrl, {
      maxBytes: 256_000,
      accept: "*/*",
      timeoutMs: 8_000,
    });
    return result.status >= 200 && result.status < 300 && result.body.length > 0;
  } catch (error) {
    if (error instanceof SafeFetchError && error.code === "HTTP_ERROR") {
      return false;
    }
    // Network/DNS failures for optional resources → treat as missing
    return false;
  }
}
