import { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LoadingScreen from "@/components/layout/LoadingScreen";
import { ClerkProvider } from "@clerk/nextjs";
import Providers from "./providers";
import SubscribePopup from "@/components/newsletter/SubscribePopup";
import AutoSubscribeOnLogin from "@/components/newsletter/AutoSubscribeOnLogin";
import CookieConsent from "@/components/layout/CookieConsent";

export const metadata: Metadata = {
  metadataBase: new URL("https://rcsb-website.pages.dev"),
  alternates: {
    canonical: "/",
  },
  title: {
    template: "%s | Rotaract Swarna Bengaluru",
    default: "Rotaract Club of Swarna Bengaluru — Together, Change is Possible!",
  },
  description:
    "A community of young professionals committed to service above self. Grow your leadership and create impact with Rotaract Swarna Bengaluru.",
  keywords: ["Rotaract", "Bengaluru", "RCSB", "Service", "Youth", "Community", "Rotary"],
  authors: [{ name: "RCSB" }],
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://rcsb-website.pages.dev",
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
      <html lang="en" suppressHydrationWarning>
        <body className="min-h-screen flex flex-col font-sans bg-brand-light">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "NGO",
                "name": "Rotaract Club of Swarna Bengaluru",
                "url": "https://rcsb-website.pages.dev",
                "logo": "https://rcsb-website.pages.dev/logo.png",
                "sameAs": [
                  "https://www.facebook.com/rotaractswarnabengaluru/",
                  "https://www.instagram.com/rotaract_swarnabengaluru",
                  "https://www.linkedin.com/company/rotaract-club-of-swarna-bengaluru/",
                  "https://www.youtube.com/channel/UCE4XQBKSjPs8rj5xyH6FOxA",
                  "https://x.com/RCSwarnaB"
                ]
              })
            }}
          />
          <LoadingScreen />
          <Providers>
            <AutoSubscribeOnLogin />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <SubscribePopup />
            <CookieConsent />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
