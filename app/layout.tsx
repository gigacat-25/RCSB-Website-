import { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import Providers from "./providers";

export const metadata: Metadata = {
  title: {
    template: "%s | Rotaract Swarna Bengaluru",
    default: "Rotaract Club of Swarna Bengaluru — Together, Change is Possible!",
  },
  description:
    "A community of young professionals committed to service above self. Grow your leadership and create impact with Rotaract Swarna Bengaluru.",
  keywords: ["Rotaract", "Bengaluru", "RCSB", "Service", "Youth", "Community", "Rotary"],
  authors: [{ name: "RCSB" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://rcsb.in",
    siteName: "Rotaract Club of Swarna Bengaluru",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-screen flex flex-col font-sans bg-brand-light">
          <Providers>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
