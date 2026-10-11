import { AnalyzeForm } from "@/components/AnalyzeForm";
import { ProductPreview } from "@/components/ProductPreview";

const FEATURES = [
  {
    title: "Technical SEO health checks",
    body: "Ten focused on-page signals — HTTPS, titles, headings, images, canonical, Open Graph, robots, and sitemap — scored into a clear grade.",
  },
  {
    title: "Next.js-ready recommendations",
    body: "When issues appear, get practical App Router guidance using the Metadata API, generateMetadata, robots.ts, and sitemap.ts.",
  },
  {
    title: "Copyable code examples",
    body: "Expand developer-oriented snippets, copy them into your project, and treat them as guidance — not auto-verified fixes.",
  },
  {
    title: "Markdown & JSON exports",
    body: "Download a shareable report from the browser for issue trackers, client reviews, or your own checklist.",
  },
] as const;

const CHECKS = [
  "HTTPS",
  "Title",
  "Meta description",
  "H1",
  "Headings",
  "Images",
  "Canonical",
  "Open Graph",
  "robots.txt",
  "sitemap.xml",
] as const;

function FeatureIcon({ index }: { index: number }) {
  const paths = [
    "M4 8h16M4 12h10M4 16h14",
    "M8 4v16M4 12h16",
    "M7 7h10v10H7zM10 10h4v4h-4z",
    "M6 5h8l4 4v10H6V5zm8 0v4h4",
  ];
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d={paths[index] ?? paths[0]}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HomePage() {
  return (
    <div>
      <section id="analyze" className="shell pb-16 pt-12 sm:pb-20 sm:pt-16">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
          <div>
            <p className="eyebrow">SEO audits for modern web projects</p>
            <h1 className="display mt-4 max-w-[14ch]">Ship faster. Rank better.</h1>
            <p className="body-muted mt-5 max-w-xl text-lg">
              Find SEO issues on your website and get actionable fixes, with practical
              examples for Next.js.
            </p>

            <div className="panel mt-8 p-3 sm:p-4">
              <AnalyzeForm />
            </div>

            <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-[13px] text-[var(--brand-ink-tertiary)]">
              <li>Single-page HTML scan</li>
              <li className="hidden sm:list-item" aria-hidden>
                ·
              </li>
              <li>Framework detection</li>
              <li className="hidden sm:list-item" aria-hidden>
                ·
              </li>
              <li>Exportable reports</li>
            </ul>
          </div>

          <div className="lg:pt-10">
            <ProductPreview />
          </div>
        </div>
      </section>

      <section
        id="features"
        className="border-y border-[var(--brand-border)] bg-[var(--brand-surface)]"
      >
        <div className="shell py-16 sm:py-20">
          <div className="max-w-2xl">
            <p className="eyebrow">Built for developers</p>
            <h2 className="section-title mt-3">
              A diagnostic tool, not another SEO content generator.
            </h2>
            <p className="body-muted mt-3">
              DevSEO focuses on technical signals you can fix in code — especially if you
              ship with Next.js App Router.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {FEATURES.map((feature, index) => (
              <article
                key={feature.title}
                className="border-t border-[var(--brand-border)] pt-5"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--brand-accent-subtle)] text-[var(--brand-accent)]">
                  <FeatureIcon index={index} />
                </div>
                <h3 className="mt-4 text-base font-semibold tracking-[-0.01em] text-[var(--brand-ink)]">
                  {feature.title}
                </h3>
                <p className="body-muted mt-2 text-sm">{feature.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="shell py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="eyebrow">Coverage</p>
            <h2 className="section-title mt-3">Ten checks. One score.</h2>
            <p className="body-muted mt-3 max-w-md">
              Each check contributes up to 10 points. Issues surface with statuses,
              explanations, and optional code guidance.
            </p>
          </div>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-5">
            {CHECKS.map((check) => (
              <li
                key={check}
                className="border-t border-[var(--brand-border)] pt-2 font-[family-name:var(--font-mono)] text-[12px] font-medium text-[var(--brand-ink)]"
              >
                {check}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-[var(--brand-border)] bg-[var(--brand-surface)]">
        <div className="shell py-16 sm:py-20">
          <p className="eyebrow">How it works</p>
          <h2 className="section-title mt-3">Three steps. No account required.</h2>
          <ol className="mt-10 grid gap-8 sm:grid-cols-3">
            <li>
              <p className="font-[family-name:var(--font-mono)] text-[12px] font-semibold text-[var(--brand-accent)]">
                01
              </p>
              <h3 className="mt-2 text-base font-semibold text-[var(--brand-ink)]">
                Paste a public URL
              </h3>
              <p className="body-muted mt-2 text-sm">
                Enter any publicly reachable page you want to evaluate.
              </p>
            </li>
            <li>
              <p className="font-[family-name:var(--font-mono)] text-[12px] font-semibold text-[var(--brand-accent)]">
                02
              </p>
              <h3 className="mt-2 text-base font-semibold text-[var(--brand-ink)]">
                We fetch the HTML
              </h3>
              <p className="body-muted mt-2 text-sm">
                The URL is sent to our analysis API. We parse HTML only — no JavaScript
                execution from the target site, no multi-page crawl.
              </p>
            </li>
            <li>
              <p className="font-[family-name:var(--font-mono)] text-[12px] font-semibold text-[var(--brand-accent)]">
                03
              </p>
              <h3 className="mt-2 text-base font-semibold text-[var(--brand-ink)]">
                Review fixes & export
              </h3>
              <p className="body-muted mt-2 text-sm">
                Get a score, actionable recommendations, optional Next.js snippets, and
                download Markdown or JSON locally in your browser.
              </p>
            </li>
          </ol>
        </div>
      </section>
    </div>
  );
}
