import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Source_Serif_4 } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

const bodyFont = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const displayFont = Source_Serif_4({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Free SEO Website Checker | SEO Checker",
    template: "%s | SEO Checker",
  },
  description:
    "Analyze your website's SEO health in seconds. Get a free SEO Health Score out of 100 with clear issues and recommendations.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "Free SEO Website Checker",
    description:
      "Analyze your website's SEO health in seconds. Free score, issues, and recommendations.",
    siteName: "SEO Checker",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free SEO Website Checker",
    description:
      "Analyze your website's SEO health in seconds. Free score, issues, and recommendations.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "SEO Checker",
      url: siteUrl,
    },
    {
      "@type": "WebApplication",
      name: "SEO Checker",
      url: siteUrl,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      description:
        "Free tool to analyze a website's SEO health and get actionable recommendations.",
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bodyFont.variable} ${displayFont.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
