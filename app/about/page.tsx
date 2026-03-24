import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const runtime = 'edge';

export const metadata: Metadata = {
    title: 'About Us',
    description: 'Service • Fellowship • Impact — building stronger communities in Bengaluru and beyond.',
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-brand-light">
            {/* Header */}
            <section className="relative flex flex-col justify-center min-h-[400px] md:min-h-[480px] pt-28 md:pt-36 pb-16 overflow-hidden bg-[#0a1835] border-b border-brand-gold/10">
                {/* Premium Line Grid */}
                <div className="absolute inset-0 pointer-events-none">
                    <div
                        className="absolute w-full h-full"
                        style={{
                            backgroundImage: `
                        linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)
                      `,
                            backgroundSize: '48px 48px',
                            maskImage: 'radial-gradient(ellipse at center, black 10%, transparent 80%)',
                            WebkitMaskImage: 'radial-gradient(ellipse at center, black 10%, transparent 80%)'
                        }}
                    />
                </div>

                {/* Ambient Color Glows */}
                <div className="absolute -top-20 right-1/4 w-[600px] h-[600px] bg-brand-gold/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute -bottom-40 left-1/4 w-[600px] h-[600px] bg-brand-azure/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="container-custom relative z-10 text-white">
                    <div className="max-w-3xl animate-fade-up">
                        <span className="text-[10px] font-black text-brand-gold uppercase tracking-[0.4em] mb-4 md:mb-6 block">Who We Are</span>
                        <h1 className="text-5xl md:text-8xl font-heading font-black text-white mb-6 md:mb-8 leading-[1.1]">
                            About <span className="text-brand-gold italic">Us.</span>
                        </h1>
                        <p className="text-white/90 text-lg md:text-xl font-light leading-relaxed max-w-2xl">
                            Service &bull; Fellowship &bull; Leadership &mdash; building stronger communities in Bengaluru and beyond.
                        </p>
                    </div>
                </div>
            </section>

            <div className="container-custom max-w-5xl py-16 md:py-24">

                {/* Section 1: About Rotaract */}
                <section className="mb-20 animate-fade-up" style={{ animationDelay: '100ms' }}>
                    <h2 className="text-3xl font-heading font-bold text-brand-blue mb-6 border-b-2 border-brand-azure/20 pb-4">About Rotaract</h2>
                    <div className="flex flex-col md:flex-row gap-8 items-center bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <div className="flex-1">
                            <p className="text-lg text-brand-gray/80 mb-6 leading-relaxed">
                                Rotaract brings together young people (18+) to take action through service, develop leadership skills, and build friendships across the world.
                            </p>
                            <p className="text-lg text-brand-gray/80 mb-6 leading-relaxed">
                                In 2019, Rotary's Council on Legislation elevated Rotaract to a distinct type of Rotary membership &mdash; strengthening its voice and impact globally.
                            </p>
                            <ul className="space-y-4 text-lg text-brand-gray/80 pl-2">
                                <li className="flex items-start gap-4">
                                    <span className="w-2 h-2 rounded-full bg-brand-azure mt-2"></span>
                                    <span>Leadership through hands-on projects and club roles</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <span className="w-2 h-2 rounded-full bg-brand-azure mt-2"></span>
                                    <span>Global network within the Rotary family of programs</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <span className="w-2 h-2 rounded-full bg-brand-azure mt-2"></span>
                                    <span>Service that creates lasting change locally and globally</span>
                                </li>
                            </ul>
                        </div>
                        <div className="flex-shrink-0 w-full md:w-5/12 lg:w-1/3 flex justify-center relative">
                            <div className="absolute inset-0 bg-brand-azure/5 rounded-full blur-3xl -z-10" />
                            <Image
                                src="/images/rotaract-3192-logo.png"
                                alt="Rotaract District 3192 Logo"
                                width={500}
                                height={200}
                                className="w-full max-w-[320px] object-contain drop-shadow-md hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                    </div>
                </section>

                {/* Section 2: About RCSB */}
                <section className="mb-20 animate-fade-up" style={{ animationDelay: '200ms' }}>
                    <h2 className="text-3xl font-heading font-bold text-brand-blue mb-6 border-b-2 border-brand-azure/20 pb-4">About Rotaract Club of Swarna Bengaluru</h2>
                    <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group flex flex-col md:flex-row-reverse gap-8 items-center">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/10 rounded-full blur-[80px] -z-10 group-hover:bg-brand-azure/10 transition-colors duration-700" />

                        <div className="flex-shrink-0 w-full md:w-5/12 lg:w-1/3 flex justify-center mb-6 md:mb-0 relative z-10">
                            <div className="absolute inset-0 bg-brand-gold/10 rounded-full blur-3xl -z-10" />
                            <Image
                                src="/logo.png"
                                alt="Rotaract Club of Swarna Bengaluru Logo"
                                width={500}
                                height={200}
                                className="w-full max-w-[320px] object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500"
                            />
                        </div>

                        <div className="flex-1 relative z-10">
                            <p className="text-xl text-brand-blue font-medium mb-6 leading-relaxed">
                                We're a youth-led club in South Bengaluru. We learn by doing&mdash;serving our neighbourhoods, building leadership, and making friendships that last.
                            </p>

                            <ul className="space-y-5 text-lg text-brand-gray/80 mb-8 pl-2">
                                <li className="flex items-start gap-4">
                                    <span className="w-2 h-2 rounded-full bg-brand-gold mt-2"></span>
                                    <span><strong>Community service</strong> responding to local needs in education, health, environment, and social well-being.</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <span className="w-2 h-2 rounded-full bg-brand-gold mt-2"></span>
                                    <span><strong>Leadership & professional growth</strong> through project ownership and mentorship of the next generation of changemakers.</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <span className="w-2 h-2 rounded-full bg-brand-gold mt-2"></span>
                                    <span><strong>Inclusive, welcoming culture</strong>&mdash;students and young professionals (18+) are all invited.</span>
                                </li>
                            </ul>

                            <p className="text-lg text-brand-gray/80 leading-relaxed">
                                Rotaract Club of Swarna Bengaluru (Formerly Rotaract Club of Bangalore Seshadripuram), emerged in the cradle of service dreamt by 15 young friends in Bengaluru in 2014. Since inception, the team has grown bigger, serving the society. Based across Bengaluru, we run regular service drives, skill-building workshops, and fellowship events.
                            </p>
                            <p className="text-lg mt-6 text-brand-gray/80 leading-relaxed">
                                If you want to create visible, measurable change&mdash;this is your place. As a part of Rotary International, RCSB strives hard to Connect the World and also shouts out:
                            </p>
                            <blockquote className="mt-8 p-6 md:p-8 bg-brand-light/30 rounded-2xl border-l-4 border-brand-gold relative shadow-sm hover:shadow-md transition-shadow duration-300">
                                <div className="absolute top-2 right-4 text-brand-gold/20 text-6xl font-serif font-black">"</div>
                                <p className="text-2xl md:text-3xl font-heading font-black italic text-brand-blue text-center relative z-10">
                                    "Together, Change is Possible!"
                                </p>
                            </blockquote>
                        </div>
                    </div>
                </section>

                {/* Section 3: Rotary's Seven Areas of Focus */}
                <section className="mb-20 animate-fade-up" style={{ animationDelay: '300ms' }}>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-heading font-bold text-brand-blue mb-4">Rotary's Seven Areas of Focus</h2>
                        <p className="text-lg text-brand-gray/80">What we champion through Rotaract</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { title: "Promoting Peace", desc: "Dialogue, empathy, and conflict resolution for resilient communities." },
                            { title: "Fighting Disease", desc: "Prevention, awareness, and access to healthcare through local initiatives." },
                            { title: "Clean Water & Sanitation", desc: "WASH projects that improve public health outcomes." },
                            { title: "Saving Mothers & Children", desc: "Nutrition, prenatal care, and immunization support for healthier families." },
                            { title: "Supporting Education", desc: "Access to learning, literacy, and skill-building for students and youth." },
                            { title: "Growing Local Economies", desc: "Entrepreneurship, employability, and sustainable development." },
                            { title: "Protecting the Environment", desc: "Tree planting, waste management, and climate action initiatives." }
                        ].map((area, i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold/5 rounded-bl-full -z-10 group-hover:bg-brand-azure/5 transition-colors" />
                                <div className="w-12 h-12 rounded-2xl bg-brand-light flex items-center justify-center text-brand-blue font-heading font-black text-xl mb-4 group-hover:bg-brand-blue group-hover:text-white transition-colors duration-300">
                                    {i + 1}
                                </div>
                                <h3 className="text-lg font-heading font-bold text-brand-blue mb-3">{area.title}</h3>
                                <p className="text-sm text-brand-gray/80 leading-relaxed font-medium">{area.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Section 4: Call to Action */}
                <section className="text-center animate-fade-up" style={{ animationDelay: '400ms' }}>
                    <div className="bg-brand-blue p-10 md:p-16 rounded-[3rem] relative overflow-hidden shadow-2xl">
                        <div className="absolute inset-0 opacity-10 bg-[url('https://rotaractjpnagar.org/shapes/blob.svg')] bg-no-repeat bg-center bg-cover" />
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 translate-x-1/4" />

                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-heading font-black text-white mb-6">Ready to Make an Impact?</h2>
                            <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                                Join us in creating positive change in our community. Whether you want to volunteer, collaborate, or simply learn more&mdash;we'd love to connect!
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
                                <Link href="/contact" className="px-8 py-4 bg-brand-gold hover:bg-yellow-500 text-brand-blue font-black rounded-full transition-all shadow-[0_10px_30px_rgba(247,168,27,0.3)] hover:shadow-[0_15px_35px_rgba(247,168,27,0.5)] hover:-translate-y-1">
                                    Get in Touch
                                </Link>
                                <Link href="/projects" className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-full transition-all backdrop-blur-md hover:-translate-y-1">
                                    View Our Projects
                                </Link>
                                <a href="https://showcase.rotaract3192.org/club/cme32bmr7003wvf4blxk2618p" target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-full transition-all backdrop-blur-md hover:-translate-y-1">
                                    Rotaract 3192 Project Dashboard
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 text-center text-sm font-medium text-brand-gray/60 max-w-2xl mx-auto leading-relaxed">
                        Rotaract Club of Swarna Bengaluru empowers young professionals to create positive change through community service, leadership development, and building lasting friendships in Bengaluru.
                    </div>
                </section>

            </div>
        </div>
    );
}
