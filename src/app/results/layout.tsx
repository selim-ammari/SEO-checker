import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analysis results",
  description: "Your SEO Health Score and detailed check results.",
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
