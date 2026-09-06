import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white/60">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          © {new Date().getFullYear()} SEO Checker — free single-page SEO analysis.
        </p>
        <Link href="/" className="text-teal-700 transition hover:text-teal-900">
          Analyze a website
        </Link>
      </div>
    </footer>
  );
}
