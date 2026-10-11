/**
 * Static product illustration — not a live analysis result.
 */
export function ProductPreview() {
  return (
    <aside
      className="panel overflow-hidden"
      aria-label="Static product preview illustration"
    >
      <div className="flex items-center justify-between border-b border-[var(--brand-border)] px-4 py-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--brand-ink-tertiary)]">
            Sample report
          </p>
          <p className="mt-0.5 font-[family-name:var(--font-mono)] text-[12px] text-[var(--brand-ink-secondary)]">
            example.com
          </p>
        </div>
        <span className="rounded-[var(--radius-sm)] bg-[var(--brand-accent-subtle)] px-2 py-1 text-[11px] font-semibold text-[var(--brand-accent)]">
          Illustration
        </span>
      </div>

      <div className="grid gap-0 sm:grid-cols-[140px_1fr]">
        <div className="flex flex-col items-center justify-center border-b border-[var(--brand-border)] px-4 py-6 sm:border-b-0 sm:border-r">
          <p className="text-[2.75rem] font-semibold tracking-[-0.04em] tabular-nums text-[var(--brand-ink)]">
            82
          </p>
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--brand-ink-tertiary)]">
            Good
          </p>
          <div
            className="mt-3 h-1.5 w-full max-w-[100px] overflow-hidden rounded-full bg-[var(--brand-surface-muted)]"
            aria-hidden
          >
            <div className="h-full w-[82%] rounded-full bg-[var(--status-pass)]" />
          </div>
        </div>

        <ul className="divide-y divide-[var(--brand-border)] px-1">
          <li className="flex items-start justify-between gap-3 px-3 py-3">
            <div>
              <p className="text-sm font-semibold text-[var(--brand-ink)]">Title</p>
              <p className="mt-0.5 text-xs text-[var(--brand-ink-secondary)]">
                Present with a healthy length
              </p>
            </div>
            <span className="status-pill-pass">Pass</span>
          </li>
          <li className="flex items-start justify-between gap-3 px-3 py-3">
            <div>
              <p className="text-sm font-semibold text-[var(--brand-ink)]">Images</p>
              <p className="mt-0.5 text-xs text-[var(--brand-ink-secondary)]">
                3 of 12 images missing alt text
              </p>
            </div>
            <span className="status-pill-warning">Warning</span>
          </li>
          <li className="flex items-start justify-between gap-3 px-3 py-3">
            <div>
              <p className="text-sm font-semibold text-[var(--brand-ink)]">Canonical</p>
              <p className="mt-0.5 text-xs text-[var(--brand-ink-secondary)]">
                Add metadata.alternates.canonical
              </p>
            </div>
            <span className="status-pill-error">Error</span>
          </li>
        </ul>
      </div>

      <div className="border-t border-[var(--brand-border)] bg-[var(--code-bg)] px-4 py-3">
        <p className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--code-muted)]">
          next.js · metadata api
        </p>
        <pre className="mt-1.5 overflow-x-auto font-[family-name:var(--font-mono)] text-[11px] leading-relaxed text-[var(--code-fg)]">
          <code>{`export const metadata = {\n  alternates: { canonical: "https://…" }\n}`}</code>
        </pre>
      </div>
    </aside>
  );
}
