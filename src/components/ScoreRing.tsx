import type { Grade } from "@/lib/seo/types";

function gradeStroke(grade: Grade): string {
  switch (grade) {
    case "Excellent":
      return "var(--status-pass)";
    case "Good":
      return "#15803d";
    case "Needs improvement":
      return "var(--status-warn)";
    case "Poor":
      return "var(--status-error)";
  }
}

export function ScoreRing({
  score,
  grade,
  size = 148,
}: {
  score: number;
  grade: Grade;
  size?: number;
}) {
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(100, Math.max(0, score)) / 100;
  const offset = circumference * (1 - progress);
  const color = gradeStroke(grade);

  return (
    <div
      className="relative inline-flex items-center justify-center"
      role="img"
      aria-label={`Score ${score} out of 100, grade ${grade}`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--brand-border)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="motion-safe:transition-[stroke-dashoffset] motion-safe:duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[2.5rem] font-semibold tracking-[-0.04em] text-[var(--brand-ink)] tabular-nums">
          {score}
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--brand-ink-tertiary)]">
          / 100
        </span>
      </div>
    </div>
  );
}
