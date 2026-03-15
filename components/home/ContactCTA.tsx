import Link from "next/link";

export default function ContactCTA() {
  return (
    <section className="py-16 bg-brand-light">
      <div className="container-custom">
        <div className="bg-brand-blue rounded-3xl p-8 md:p-16 relative overflow-hidden shadow-2xl">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-gold opacity-10 rounded-full blur-xl -translate-x-1/2 translate-y-1/2" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 text-center lg:text-left">
            <div className="max-w-2xl">
               <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6 leading-tight">
                 Ready to make a <span className="text-brand-gold">Real Difference?</span>
               </h2>
               <p className="text-blue-100 text-lg">
                 Join the Rotaract Club of Swarna Bengaluru today. Together, we can create lasting impact through service, friendship, and professional growth.
               </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
               <Link 
                 href="/contact" 
                 className="px-10 py-5 bg-brand-gold text-brand-blue font-bold rounded-full hover:bg-white transition-all text-center shadow-lg"
               >
                 Send us a Message
               </Link>
               <Link 
                 href="/join" 
                 className="px-10 py-5 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-brand-blue transition-all text-center"
               >
                 Become a Member
               </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
