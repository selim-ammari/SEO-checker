import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { PRODUCT_NAME } from "@/lib/brand";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--brand-border)]/80 bg-[rgb(244_245_247_/_0.85)] backdrop-blur-md">
      <div className="shell flex h-14 items-center justify-between gap-4">
        <Link
          href="/"
          className="group flex items-center gap-2.5 rounded-[var(--radius-sm)] focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"
        >
          <BrandMark className="h-7 w-7 transition group-hover:opacity-90" />
          <span className="text-[15px] font-semibold tracking-[-0.02em] text-[var(--brand-ink)]">
            {PRODUCT_NAME}
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Primary">
          <a href="#features" className="btn-ghost hidden px-3 text-[13px] sm:inline-flex">
            Features
          </a>
          <a href="#analyze" className="btn-primary px-3.5 text-[13px]">
            Analyze
          </a>
        </nav>
      </div>
    </header>
  );
}
