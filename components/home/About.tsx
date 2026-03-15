export default function About() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="relative">
            {/* Image Placeholder with Rotary Style Frame */}
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
               <img 
                 src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop" 
                 alt="Rotaract Team" 
                 className="w-full h-full object-cover"
               />
            </div>
            {/* Decorative background elements */}
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-brand-gold rounded-2xl -z-10 opacity-20" />
            <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-brand-azure rounded-full -z-10 opacity-10 blur-2xl" />
            
            <div className="absolute -bottom-10 left-10 bg-brand-blue p-6 rounded-xl shadow-xl text-white max-w-xs hidden md:block">
              <p className="font-heading font-bold text-2xl mb-1">50+</p>
              <p className="text-xs uppercase tracking-wider font-semibold text-blue-100">Active Members Creating Change</p>
            </div>
          </div>

          <div>
            <span className="text-brand-azure font-bold uppercase tracking-widest text-sm mb-4 block">About Our Club</span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-8 leading-tight">
              Service, Fellowship, and <br />
              <span className="text-brand-blue">Global Leadership.</span>
            </h2>
            <div className="space-y-6 text-brand-gray leading-relaxed">
              <p>
                The Rotaract Club of Swarna Bengaluru is part of a global movement of young professionals and students who are committed to service and leadership. We believe in the power of youth to drive positive change in our community.
              </p>
              <p>
                Our mission is to provide an opportunity for young men and women to enhance the knowledge and skills that will assist them in personal development, to address the physical and social needs of their communities, and to promote better relations between all people worldwide through a framework of friendship and service.
              </p>
            </div>
            
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-brand-blue shrink-0">
                  <span className="font-bold text-lg">01</span>
                </div>
                <div>
                  <h4 className="font-bold mb-1">Leadership</h4>
                  <p className="text-sm text-gray-500">Developing next-generation leaders through mentorship and projects.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-brand-gold shrink-0">
                  <span className="font-bold text-lg">02</span>
                </div>
                <div>
                  <h4 className="font-bold mb-1">Impact</h4>
                  <p className="text-sm text-gray-500">Executing meaningful service projects that matter to Bengaluru.</p>
                </div>
              </div>
            </div>

            <div className="mt-12">
               <Link href="/about" className="text-brand-blue font-bold flex items-center gap-2 hover:gap-4 transition-all">
                  Learn more about our history <span>&rarr;</span>
               </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
