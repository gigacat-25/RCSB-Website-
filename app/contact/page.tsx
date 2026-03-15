import { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";
import SectionHeader from "@/components/ui/SectionHeader";
import AnimatedSection from "@/components/ui/AnimatedSection";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the Rotaract Club of Swarna Bengaluru.",
};

const INFO_ITEMS = [
  { icon: "📍", label: "Address", value: "Rotary House of Friendship\n11 Lavelle Road, Bengaluru" },
  { icon: "📧", label: "Email", value: "rota.rcbs@gmail.com", href: "mailto:rota.rcbs@gmail.com" },
  { icon: "🕐", label: "Office Hours", value: "Weekdays 10am – 6pm IST" },
];

export default function ContactPage() {
  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Contact Us"
          subtitle="Have a question or want to collaborate? We'd love to hear from you."
        />

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Form */}
          <AnimatedSection>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
              <h2 className="font-heading font-semibold text-brand-blue text-lg mb-6">Send us a message</h2>
              <ContactForm />
            </div>
          </AnimatedSection>

          {/* Info */}
          <AnimatedSection delay={0.2}>
            <div className="flex flex-col gap-6">
              {INFO_ITEMS.map(({ icon, label, value, href }) => (
                <div key={label} className="flex gap-4 p-5 bg-brand-grey rounded-xl">
                  <span className="text-2xl">{icon}</span>
                  <div>
                    <p className="font-heading font-semibold text-brand-blue text-sm mb-1">{label}</p>
                    {href ? (
                      <a href={href} className="text-gray-600 text-sm hover:text-brand-gold transition-colors">{value}</a>
                    ) : (
                      <p className="text-gray-600 text-sm whitespace-pre-line">{value}</p>
                    )}
                  </div>
                </div>
              ))}

              {/* Map embed placeholder */}
              <div className="w-full h-52 rounded-xl overflow-hidden bg-brand-grey border border-gray-200">
                <iframe
                  src="https://maps.google.com/maps?q=11+Lavelle+Road+Bengaluru&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Rotary House of Friendship, 11 Lavelle Road, Bengaluru"
                />
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
