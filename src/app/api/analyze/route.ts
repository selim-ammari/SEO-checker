import { NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { MAX_URL_LENGTH } from "@/lib/security/url-validation";
import { runAnalysis } from "@/lib/seo/run-analysis";

export const runtime = "nodejs";

const bodySchema = z.object({
  url: z
    .string({ error: "URL is required" })
    .trim()
    .min(1, "URL is required")
    .max(MAX_URL_LENGTH, `URL must be at most ${MAX_URL_LENGTH} characters`),
});

function getClientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: Request) {
  const rate = checkRateLimit(getClientKey(request));
  if (!rate.allowed) {
    return NextResponse.json(
      {
        error: {
          code: "RATE_LIMITED",
          message: "Too many requests. Please wait a moment and try again.",
        },
      },
      {
        status: 429,
        headers: { "Retry-After": String(rate.retryAfterSec) },
      },
    );
  }

  let json: unknown;

  try {
    json = await request.json();
  } catch {
    return NextResponse.json(
      {
        error: {
          code: "INVALID_JSON",
          message: "Request body must be valid JSON.",
        },
      },
      { status: 400 },
    );
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          code: "INVALID_URL",
          message: parsed.error.issues[0]?.message ?? "Invalid URL",
        },
      },
      { status: 400 },
    );
  }

  const result = await runAnalysis(parsed.data.url);

  if (!result.ok) {
    return NextResponse.json(
      {
        error: {
          code: result.error.code,
          message: result.error.message,
        },
      },
      { status: result.error.status },
    );
  }

  return NextResponse.json(result.data);
}
