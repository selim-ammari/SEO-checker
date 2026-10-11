import type {
  CodeExample,
  FrameworkDetection,
  SeoCheckResult,
} from "@/lib/seo/types";

type RecommendationPack = {
  recommendation: string;
  fixExamples?: CodeExample[];
};

function nextNote(framework: FrameworkDetection): string | undefined {
  if (framework.framework === "nextjs") {
    return "Example for Next.js App Router — verify it matches your route structure.";
  }
  return "Next.js App Router example — use only if this project uses Next.js.";
}

function titlePack(status: SeoCheckResult["status"], framework: FrameworkDetection): RecommendationPack {
  if (status === "pass") {
    return {
      recommendation:
        "Keep titles unique per route. In Next.js, set them via the Metadata API or generateMetadata for dynamic pages.",
    };
  }

  return {
    recommendation:
      "Add a unique page title (~30–60 characters). Static routes can use the Metadata API; dynamic routes should use generateMetadata so the title reflects the content.",
    fixExamples: [
      {
        language: "typescript",
        label: "Static metadata (App Router)",
        code: `import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acme Analytics Platform for Modern Teams",
};`,
        note: nextNote(framework),
      },
      {
        language: "typescript",
        label: "Dynamic metadata",
        code: `import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug); // your data loader

  return {
    title: page.title,
  };
}`,
        note: nextNote(framework),
      },
    ],
  };
}

function metaDescriptionPack(
  status: SeoCheckResult["status"],
  framework: FrameworkDetection,
): RecommendationPack {
  if (status === "pass") {
    return {
      recommendation:
        "Keep descriptions unique and accurate. Prefer Metadata.description or generateMetadata over hard-coding unrelated copy.",
    };
  }

  return {
    recommendation:
      "Add a meta description (~70–160 characters) that summarizes the page. Metadata alone will not fix thin or missing page content.",
    fixExamples: [
      {
        language: "typescript",
        label: "Static description (App Router)",
        code: `import type { Metadata } from "next";

export const metadata: Metadata = {
  description:
    "Acme helps product teams understand user behavior with privacy-first analytics and clear dashboards.",
};`,
        note: nextNote(framework),
      },
    ],
  };
}

function h1Pack(status: SeoCheckResult["status"]): RecommendationPack {
  if (status === "pass") {
    return {
      recommendation:
        "Keep a single clear H1 that matches the page intent. Prefer real heading markup over visually styled divs.",
    };
  }

  return {
    recommendation:
      "Ensure the page renders exactly one meaningful H1 in the HTML response. Client-only headings may be invisible to crawlers that do not execute JavaScript.",
    fixExamples: [
      {
        language: "tsx",
        label: "Server Component heading",
        code: `export default function Page() {
  return (
    <main>
      <h1>Product analytics that respect privacy</h1>
      {/* page content */}
    </main>
  );
}`,
        note: "Render the H1 on the server when possible so it appears in the initial HTML.",
      },
    ],
  };
}

function headingsPack(status: SeoCheckResult["status"]): RecommendationPack {
  if (status === "pass") {
    return {
      recommendation:
        "Maintain a sequential heading hierarchy (H1 → H2 → H3) as content grows.",
    };
  }

  return {
    recommendation:
      "Fix heading order in the page markup (avoid skipping from H1 to H3). Structure content in the component tree; metadata cannot fix heading hierarchy.",
    fixExamples: [
      {
        language: "tsx",
        label: "Coherent heading structure",
        code: `export default function Page() {
  return (
    <article>
      <h1>Shipping checklist</h1>
      <h2>Before launch</h2>
      <h3>SEO basics</h3>
      <h2>After launch</h2>
    </article>
  );
}`,
      },
    ],
  };
}

function imagesPack(status: SeoCheckResult["status"]): RecommendationPack {
  if (status === "pass") {
    return {
      recommendation:
        "Continue providing concise, accurate alt text for meaningful images. Decorative images can use alt=\"\".",
    };
  }

  return {
    recommendation:
      "Add meaningful alt text that describes the image purpose. Do not invent alt text that misrepresents the image. Decorative images should use an empty alt attribute.",
    fixExamples: [
      {
        language: "tsx",
        label: "next/image with descriptive alt",
        code: `import Image from "next/image";

export function Hero() {
  return (
    <Image
      src="/hero.png"
      alt="Dashboard showing weekly conversion trends"
      width={1200}
      height={630}
    />
  );
}`,
        note: "Write alt text from the actual image content — do not guess.",
      },
      {
        language: "tsx",
        label: "Decorative image",
        code: `<Image src="/divider.svg" alt="" width={200} height={8} />`,
        note: "Empty alt is correct when the image adds no information.",
      },
    ],
  };
}

function canonicalPack(
  status: SeoCheckResult["status"],
  framework: FrameworkDetection,
): RecommendationPack {
  if (status === "pass") {
    return {
      recommendation:
        "Keep the canonical URL pointed at the preferred absolute HTTPS version of this page.",
    };
  }

  return {
    recommendation:
      "Declare a canonical URL for the preferred version of this page. In Next.js, set metadata.alternates.canonical (static) or return it from generateMetadata (dynamic).",
    fixExamples: [
      {
        language: "typescript",
        label: "Canonical via Metadata API",
        code: `import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://example.com/pricing",
  },
};`,
        note: nextNote(framework),
      },
    ],
  };
}

function openGraphPack(
  status: SeoCheckResult["status"],
  framework: FrameworkDetection,
): RecommendationPack {
  if (status === "pass") {
    return {
      recommendation:
        "Keep Open Graph tags accurate when titles, descriptions, or share images change.",
    };
  }

  return {
    recommendation:
      "Provide og:title, og:description, and og:image. In Next.js, configure metadata.openGraph. Ensure the image URL is publicly reachable.",
    fixExamples: [
      {
        language: "typescript",
        label: "Open Graph metadata",
        code: `import type { Metadata } from "next";

export const metadata: Metadata = {
  openGraph: {
    title: "Acme Analytics",
    description: "Privacy-first product analytics for modern teams.",
    url: "https://example.com",
    siteName: "Acme",
    images: [{ url: "https://example.com/og.png", width: 1200, height: 630 }],
    type: "website",
  },
};`,
        note: nextNote(framework),
      },
    ],
  };
}

function robotsPack(
  status: SeoCheckResult["status"],
  framework: FrameworkDetection,
): RecommendationPack {
  if (status === "pass") {
    return {
      recommendation:
        "Review crawl rules periodically and keep the sitemap reference up to date.",
    };
  }

  return {
    recommendation:
      "Publish a robots.txt at the site root. In Next.js App Router, use app/robots.ts so the framework serves /robots.txt.",
    fixExamples: [
      {
        language: "typescript",
        label: "app/robots.ts",
        code: `import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/"],
    },
    sitemap: "https://example.com/sitemap.xml",
  };
}`,
        note: nextNote(framework),
      },
    ],
  };
}

function sitemapPack(
  status: SeoCheckResult["status"],
  framework: FrameworkDetection,
): RecommendationPack {
  if (status === "pass") {
    return {
      recommendation:
        "Keep the XML sitemap updated as you publish or remove indexable routes.",
    };
  }

  return {
    recommendation:
      "Publish an XML sitemap and reference it from robots.txt. In Next.js App Router, use app/sitemap.ts.",
    fixExamples: [
      {
        language: "typescript",
        label: "app/sitemap.ts",
        code: `import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://example.com",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}`,
        note: nextNote(framework),
      },
    ],
  };
}

function httpsPack(status: SeoCheckResult["status"]): RecommendationPack {
  if (status === "pass") {
    return {
      recommendation: "Keep HTTPS enabled and redirect HTTP traffic to HTTPS.",
    };
  }

  return {
    recommendation:
      "Serve the site over HTTPS and redirect HTTP to HTTPS at the host/CDN layer (for example Vercel or your reverse proxy). This is not fixed by page metadata.",
  };
}

function packForCheck(
  check: SeoCheckResult,
  framework: FrameworkDetection,
): RecommendationPack | null {
  switch (check.id) {
    case "title":
      return titlePack(check.status, framework);
    case "meta-description":
      return metaDescriptionPack(check.status, framework);
    case "h1":
      return h1Pack(check.status);
    case "headings":
      return headingsPack(check.status);
    case "images":
      return imagesPack(check.status);
    case "canonical":
      return canonicalPack(check.status, framework);
    case "open-graph":
      return openGraphPack(check.status, framework);
    case "robots":
      return robotsPack(check.status, framework);
    case "sitemap":
      return sitemapPack(check.status, framework);
    case "https":
      return httpsPack(check.status);
    default:
      return null;
  }
}

/**
 * Enrich check recommendations with developer-oriented guidance.
 * Code examples are attached for non-passing checks (and omitted for pass
 * to avoid UI noise). Framework-neutral advice always remains in recommendation.
 */
export function enrichChecksWithRecommendations(
  checks: SeoCheckResult[],
  framework: FrameworkDetection,
): SeoCheckResult[] {
  return checks.map((check) => {
    const pack = packForCheck(check, framework);
    if (!pack) return check;

    const includeExamples = check.status !== "pass" && Boolean(pack.fixExamples?.length);

    return {
      ...check,
      recommendation: pack.recommendation,
      ...(includeExamples ? { fixExamples: pack.fixExamples } : {}),
    };
  });
}
