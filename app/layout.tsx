import { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    template: "%s | RCSB",
    default: "Rotaract Club of Swarna Bengaluru",
  },
  description:
    "Rotaract Club of Swarna Bengaluru — Together, Change is Possible! A community of young professionals committed to service above self in Bengaluru.",
  keywords: ["Rotaract", "Bengaluru", "RCSB", "Service", "Youth", "Community"],
  authors: [{ name: "RCSB" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://rcsb.in",
    siteName: "Rotaract Club of Swarna Bengaluru",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

import Providers from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
