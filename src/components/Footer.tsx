import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { PRODUCT_NAME } from "@/lib/brand";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--brand-border)]">
      <div className="shell flex flex-col gap-4 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <BrandMark className="h-5 w-5" />
          <p className="text-sm text-[var(--brand-ink-secondary)]">
            © {new Date().getFullYear()} {PRODUCT_NAME}. Technical SEO checks for
            developers.
          </p>
        </div>
        <Link href="/#analyze" className="btn-ghost px-0 text-sm sm:px-3">
          Analyze a website
        </Link>
      </div>
    </footer>
  );
}
