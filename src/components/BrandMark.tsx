type BrandMarkProps = {
  className?: string;
  title?: string;
};

/**
 * Geometric mark: open diagnostic frame + precision bar.
 * Reads as analysis / structure / measurement at small sizes.
 */
export function BrandMark({ className = "h-7 w-7", title }: BrandMarkProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <path
        d="M7 5.5h11.5a1.5 1.5 0 0 1 0 3H10v15h8.5a1.5 1.5 0 0 1 0 3H7A1.5 1.5 0 0 1 5.5 25V7A1.5 1.5 0 0 1 7 5.5Z"
        className="fill-[var(--brand-ink)]"
      />
      <rect
        x="16"
        y="13.5"
        width="11"
        height="5"
        rx="1.5"
        className="fill-[var(--brand-accent)]"
      />
      <path
        d="M18.5 11h5.5M18.5 21h5.5"
        stroke="var(--brand-accent)"
        strokeWidth="1.75"
        strokeLinecap="round"
        opacity="0.45"
      />
    </svg>
  );
}
