import type { CheckStatus } from "@/lib/seo/types";

const LABELS: Record<CheckStatus, string> = {
  pass: "Pass",
  warning: "Warning",
  error: "Error",
};

function StatusGlyph({ status }: { status: CheckStatus }) {
  if (status === "pass") {
    return (
      <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
        <circle cx="5" cy="5" r="3.5" fill="currentColor" />
      </svg>
    );
  }
  if (status === "warning") {
    return (
      <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
        <path d="M5 1.2 9.2 8.5H.8L5 1.2Z" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
      <rect x="1.5" y="1.5" width="7" height="7" rx="1" fill="currentColor" />
    </svg>
  );
}

export function StatusBadge({ status }: { status: CheckStatus }) {
  const className =
    status === "pass"
      ? "status-pill-pass"
      : status === "warning"
        ? "status-pill-warning"
        : "status-pill-error";

  return (
    <span className={className}>
      <StatusGlyph status={status} />
      {LABELS[status]}
    </span>
  );
}
