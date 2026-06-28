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
  metadataBase: new URL("https://rotaractswarnabengaluru.in"),
  alternates: {
    canonical: "/",
  },
  title: {
    template: "%s | Rotaract Swarna Bengaluru",
    default: "Rotaract Club of Swarna Bengaluru | RI District 3192",
  },
  description:
    "Official website of Rotaract Club of Swarna Bengaluru, RI District 3192. Developing youth leadership through community service, fellowship, and networking in Bengaluru.",
  keywords: [
    "Rotaract Club of Swarna Bengaluru",
    "Rotaract Bengaluru",
    "Rotaract 3192",
    "Swarna Bengaluru",
    "Community Service Bengaluru",
    "Youth Leadership Karnataka",
    "Rotary District 3192",
    "Fellowship"
  ],
  authors: [{ name: "RCSB" }],
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://rotaractswarnabengaluru.in",
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
                "url": "https://rotaractswarnabengaluru.in",
                "logo": "https://rotaractswarnabengaluru.in/logo.png",
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
          <div className="noise-overlay" />
          <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#0F3B82]/5 rounded-full blur-[120px] animate-pulse-soft" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#F7A81B]/5 rounded-full blur-[120px] animate-pulse-soft" style={{ animationDelay: "2s" }} />
          </div>
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
