import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import RecentProjects from "@/components/home/RecentProjects";
import FeaturedContent from "@/components/home/FeaturedContent";
import LeadershipPreview from "@/components/home/LeadershipPreview";
import ContactCTA from "@/components/home/ContactCTA";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <About />
      <RecentProjects />
      <FeaturedContent />
      <LeadershipPreview />
      <ContactCTA />
    </div>
  );
}
