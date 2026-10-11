import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Technical report",
  description: "Your SEO health score, issues, and developer-oriented fixes.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ResultsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
