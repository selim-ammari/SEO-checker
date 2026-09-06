import type { Grade } from "@/lib/seo/types";

function gradeColor(grade: Grade): string {
  switch (grade) {
    case "Excellent":
      return "#0f766e";
    case "Good":
      return "#047857";
    case "Needs improvement":
      return "#b45309";
    case "Poor":
      return "#b91c1c";
  }
}

export function ScoreRing({
  score,
  grade,
}: {
  score: number;
  grade: Grade;
}) {
  const size = 160;
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(100, Math.max(0, score)) / 100;
  const offset = circumference * (1 - progress);
  const color = gradeColor(grade);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
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
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-[family-name:var(--font-display)] text-4xl font-semibold text-slate-900">
          {score}
        </span>
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
          / 100
        </span>
      </div>
    </div>
  );
}
