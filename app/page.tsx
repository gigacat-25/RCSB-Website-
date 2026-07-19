export const runtime = 'edge';

import { Metadata } from "next";
import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import EventGallery from "@/components/home/EventGallery";
import RecentProjects from "@/components/home/RecentProjects";
import FeaturedContent from "@/components/home/FeaturedContent";
import LeadershipPreview from "@/components/home/LeadershipPreview";
import PartnersCarousel from "@/components/home/PartnersCarousel";
import ContactCTA from "@/components/home/ContactCTA";

export const metadata: Metadata = {
  title: "Rotaract Club of Swarna Bengaluru | RI District 3192",
  description: "Official website of Rotaract Club of Swarna Bengaluru, RI District 3192. Developing youth leadership through community service, fellowship, and networking in Bengaluru.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <About />
      <EventGallery />
      <RecentProjects />
      <FeaturedContent />
      <LeadershipPreview />
      <PartnersCarousel />
      <ContactCTA />
    </div>
  );
}
