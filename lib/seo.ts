import type { DefaultSeoProps } from "next-seo";

const defaultSEO: DefaultSeoProps = {
  titleTemplate: "%s | RCSB",
  defaultTitle: "Rotaract Club of Swarna Bengaluru",
  description:
    "Rotaract Club of Swarna Bengaluru — Together, Change is Possible! A community of young professionals committed to service above self.",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://rcsb.in",
    siteName: "Rotaract Club of Swarna Bengaluru",
    images: [
      {
        url: "https://rcsb.in/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "RCSB — Rotaract Club of Swarna Bengaluru",
      },
    ],
  },
  twitter: {
    cardType: "summary_large_image",
  },
};

export default defaultSEO;
