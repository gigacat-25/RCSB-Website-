import { Metadata } from "next";
import Hero from "@/components/home/Hero";
import WhoWeAre from "@/components/home/WhoWeAre";
import FeaturedEvents from "@/components/home/FeaturedEvents";
import PhotoStrip from "@/components/home/PhotoStrip";
import ContactCTA from "@/components/home/ContactCTA";
import { client } from "@/sanity/lib/client";
import { upcomingEventsQuery, siteSettingsQuery } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "Rotaract Club of Swarna Bengaluru — Together, Change is Possible!",
  description:
    "The Rotaract Club of Swarna Bengaluru (RCSB) is a community of young professionals committed to service. Founded in 2014, part of Rotary International.",
};

export const revalidate = 3600; // ISR: revalidate every hour

export default async function HomePage() {
  const [events, settings] = await Promise.all([
    client.fetch(upcomingEventsQuery).catch(() => []),
    client.fetch(siteSettingsQuery).catch(() => null),
  ]);

  return (
    <>
      <Hero
        headline={settings?.heroHeadline || "Together, Change is Possible!"}
        subtext={settings?.heroSubtext || "The Rotaract Club of Swarna Bengaluru — a community of young leaders serving Bengaluru since 2014."}
      />
      <WhoWeAre aboutText={settings?.aboutText} />
      <FeaturedEvents events={events} />
      <PhotoStrip />
      <ContactCTA />
    </>
  );
}
