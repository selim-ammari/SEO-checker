import Link from "next/link";

export function Navbar() {
  return (
    <header className="border-b border-slate-200/80 bg-white/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-slate-900"
        >
          SEO Checker
        </Link>
        <span className="text-sm text-slate-500">Free SEO health check</span>
      </div>
    </header>
  );
}
