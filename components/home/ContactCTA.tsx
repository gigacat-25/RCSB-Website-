import Link from "next/link";
import AnimatedSection from "@/components/ui/AnimatedSection";

export default function ContactCTA() {
  return (
    <AnimatedSection className="py-20 bg-brand-blue">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-block bg-brand-gold/20 text-brand-gold text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          Get Involved
        </div>
        <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-4">
          Ready to Make a Difference?
        </h2>
        <p className="text-blue-200 text-base md:text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
          Join the Rotaract Club of Swarna Bengaluru and connect with a community of passionate young leaders. Together, change is possible.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 bg-brand-gold text-white font-semibold rounded-xl hover:bg-brand-gold/90 transition-all text-sm"
          >
            Contact Us
          </Link>
          <Link
            href="/events"
            className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:border-white hover:bg-white/10 transition-all text-sm"
          >
            Attend an Event
          </Link>
        </div>
      </div>
    </AnimatedSection>
  );
}
