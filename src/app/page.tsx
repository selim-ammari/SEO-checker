import { AnalyzeForm } from "@/components/AnalyzeForm";

const CHECKS = [
  { title: "HTTPS", detail: "Secure connection check" },
  { title: "Title", detail: "Presence and length" },
  { title: "Meta description", detail: "Presence and length" },
  { title: "H1", detail: "Single clear main heading" },
  { title: "Headings", detail: "Logical H1–H3 structure" },
  { title: "Images", detail: "Alt text coverage" },
  { title: "Canonical", detail: "Canonical link tag" },
  { title: "Open Graph", detail: "Social preview tags" },
  { title: "robots.txt", detail: "Crawler guidance file" },
  { title: "sitemap.xml", detail: "XML sitemap presence" },
] as const;

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <section className="mx-auto max-w-3xl text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-teal-800">
          SEO Checker
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          Free SEO Website Checker
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          Find technical SEO issues and get actionable fixes for your code —
          especially useful for Next.js App Router projects.
        </p>

        <div className="mt-8 text-left">
          <AnalyzeForm />
        </div>
      </section>

      <section className="mt-20">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-slate-900">
          What we check
        </h2>
        <p className="mt-2 max-w-2xl text-slate-600">
          Ten on-page signals that shape a clear SEO Health Score out of 100.
        </p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {CHECKS.map((check) => (
            <li key={check.title} className="border-t border-teal-700/30 pt-3">
              <p className="font-semibold text-slate-900">{check.title}</p>
              <p className="mt-1 text-sm text-slate-500">{check.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-20">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-slate-900">
          How it works
        </h2>
        <ol className="mt-6 grid gap-6 sm:grid-cols-3">
          <li>
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-800">
              Step 1
            </p>
            <p className="mt-2 font-semibold text-slate-900">Paste your URL</p>
            <p className="mt-1 text-sm text-slate-600">
              Enter any public page you want to evaluate.
            </p>
          </li>
          <li>
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-800">
              Step 2
            </p>
            <p className="mt-2 font-semibold text-slate-900">We fetch the HTML</p>
            <p className="mt-1 text-sm text-slate-600">
              Only the page HTML is analyzed — no JS execution, no heavy crawl.
            </p>
          </li>
          <li>
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-800">
              Step 3
            </p>
            <p className="mt-2 font-semibold text-slate-900">Get your score</p>
            <p className="mt-1 text-sm text-slate-600">
              See a score out of 100 with clear issues and recommendations.
            </p>
          </li>
        </ol>
      </section>
    </div>
  );
}
