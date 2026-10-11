import type { AnalysisResult } from "@/lib/seo/types";

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function formatDateStamp(date: Date): string {
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}`;
}

function safeHostname(url: string): string {
  try {
    const host = new URL(url).hostname.toLowerCase();
    const cleaned = host.replace(/[^a-z0-9.-]+/g, "-").replace(/^-+|-+$/g, "");
    return cleaned || "website";
  } catch {
    return "website";
  }
}

export function buildExportFilename(
  result: Pick<AnalysisResult, "url" | "finalUrl" | "analyzedAt">,
  format: "md" | "json",
  now: Date = new Date(),
): string {
  const sourceUrl = result.finalUrl || result.url || "https://example.com";
  const host = safeHostname(sourceUrl);

  let stamp = formatDateStamp(now);
  if (result.analyzedAt) {
    const parsed = new Date(result.analyzedAt);
    if (!Number.isNaN(parsed.getTime())) {
      stamp = formatDateStamp(parsed);
    }
  }

  return `seo-report-${host}-${stamp}.${format}`;
}

export function toJsonReport(result: AnalysisResult): string {
  const payload = {
    url: result.url,
    finalUrl: result.finalUrl,
    analyzedAt: result.analyzedAt ?? null,
    score: result.score,
    grade: result.grade,
    summary: result.summary,
    framework: result.framework ?? null,
    checks: result.checks.map((check) => ({
      id: check.id,
      category: check.category,
      title: check.title,
      status: check.status,
      score: check.score,
      maxScore: check.maxScore,
      message: check.message,
      recommendation: check.recommendation,
      fixExamples: check.fixExamples ?? [],
    })),
  };

  return `${JSON.stringify(payload, null, 2)}\n`;
}

function statusIcon(status: AnalysisResult["checks"][number]["status"]): string {
  if (status === "pass") return "PASS";
  if (status === "warning") return "WARN";
  return "ERROR";
}

export function toMarkdownReport(result: AnalysisResult): string {
  const lines: string[] = [];
  const analyzedAt = result.analyzedAt ?? "Not available";
  const frameworkLabel = result.framework
    ? `${result.framework.label} (confidence: ${result.framework.confidence})`
    : "Unknown";

  lines.push("# SEO technical report");
  lines.push("");
  lines.push(`- **URL:** ${result.url}`);
  lines.push(`- **Final URL:** ${result.finalUrl}`);
  lines.push(`- **Analyzed at:** ${analyzedAt}`);
  lines.push(`- **Score:** ${result.score}/100`);
  lines.push(`- **Grade:** ${result.grade}`);
  lines.push(`- **Framework detection:** ${frameworkLabel}`);
  lines.push(
    `- **Summary:** ${result.summary.passed} passed · ${result.summary.warnings} warnings · ${result.summary.errors} errors`,
  );
  lines.push("");

  if (result.framework?.evidence?.length) {
    lines.push("## Framework evidence");
    lines.push("");
    for (const item of result.framework.evidence) {
      lines.push(`- ${item}`);
    }
    lines.push("");
  }

  lines.push("## Checks");
  lines.push("");

  for (const check of result.checks) {
    lines.push(`### ${check.title} (${statusIcon(check.status)})`);
    lines.push("");
    lines.push(`- **Score:** ${check.score}/${check.maxScore}`);
    lines.push(`- **Status:** ${check.status}`);
    lines.push(`- **Message:** ${check.message}`);
    lines.push(`- **Recommendation:** ${check.recommendation}`);
    lines.push("");

    if (check.fixExamples?.length) {
      lines.push("#### Code examples");
      lines.push("");
      for (const example of check.fixExamples) {
        lines.push(`**${example.label}**`);
        if (example.note) {
          lines.push("");
          lines.push(`_${example.note}_`);
        }
        lines.push("");
        lines.push(`\`\`\`${example.language}`);
        lines.push(example.code);
        lines.push("```");
        lines.push("");
      }
    }
  }

  lines.push("---");
  lines.push("");
  lines.push(
    "_Generated locally by SEO Checker. Code examples are guidance for developers and are not automatically verified fixes._",
  );
  lines.push("");

  return lines.join("\n");
}
