"use client";

import { useState } from "react";
import { EnvelopeIcon, MapPinIcon, GlobeAltIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          message: formData.message
        }),
      });

      if (!res.ok) throw new Error("Failed to send message. Please try again.");

      setSuccess(true);
      setFormData({ firstName: "", lastName: "", email: "", message: "" });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <section className="relative py-32 overflow-hidden bg-brand-blue border-b border-brand-gold/20">
        <div className="absolute inset-0 bg-mesh-gradient opacity-40 mix-blend-overlay" />
        <div className="container-custom relative z-10 text-white">
          <div className="max-w-4xl animate-fade-up pt-16 md:pt-24">
            <span className="text-[10px] font-black text-brand-gold uppercase tracking-[0.4em] mb-6 block">Contact Us</span>
            <h1 className="text-6xl md:text-8xl font-heading font-black text-white mb-8 leading-[1.1]">
              Start a <br />
              <span className="text-brand-gold italic">Conversation.</span>
            </h1>
            <p className="text-white/90 text-xl font-light leading-relaxed max-w-2xl">
              Whether you're looking to join our ranks, partner on a project, or simply learn more about our impact, we're here to listen and collaborate.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">

            {/* Contact Info */}
            <div className="space-y-12 animate-fade-up">
              <div>
                <h2 className="text-3xl font-heading font-black text-brand-blue italic mb-10 underline decoration-brand-gold decoration-4 underline-offset-8">
                  Get Information
                </h2>
                <div className="grid gap-6">
                  <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 flex items-center gap-8">
                    <div className="w-20 h-20 flex-shrink-0 rounded-3xl bg-slate-100 flex items-center justify-center text-brand-blue">
                      <EnvelopeIcon className="w-8 h-8 stroke-2" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">Email Us</h4>
                      <p className="text-brand-blue font-black text-2xl tracking-tight mb-2">contact@rcsb.in</p>
                      <p className="text-[11px] font-black text-[#00A1E0] uppercase tracking-widest">Typical response: 24h</p>
                    </div>
                  </div>

                  <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 flex items-center gap-8">
                    <div className="w-20 h-20 flex-shrink-0 rounded-3xl bg-[#F5C767] flex items-center justify-center text-brand-blue">
                      <MapPinIcon className="w-8 h-8 stroke-2" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">Find Us</h4>
                      <p className="text-brand-blue font-black text-2xl tracking-tight mb-2">Bengaluru, KA, India</p>
                      <p className="text-[11px] font-black text-[#00A1E0] uppercase tracking-widest">Swarna Bengaluru Community</p>
                    </div>
                  </div>

                  <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 flex items-center gap-8">
                    <div className="w-20 h-20 flex-shrink-0 rounded-3xl bg-[#EDFAFD] flex items-center justify-center text-[#00A1E0]">
                      <GlobeAltIcon className="w-8 h-8 stroke-2" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">Connect</h4>
                      <div className="flex gap-6 mt-1">
                        <a href="https://instagram.com/rotaract_swarna_bengaluru" target="_blank" className="font-black text-brand-blue uppercase tracking-widest text-[11px] hover:text-[#00A1E0] transition-colors">Instagram</a>
                        <a href="#" className="font-black text-brand-blue uppercase tracking-widest text-[11px] hover:text-[#00A1E0] transition-colors">LinkedIn</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="premium-card group p-12 bg-brand-blue relative overflow-hidden">
                <div className="absolute inset-0 bg-mesh-gradient opacity-20" />
                <div className="relative z-10">
                  <span className="text-[10px] font-black text-brand-gold uppercase tracking-[0.4em] mb-4 block">Membership</span>
                  <h3 className="text-3xl font-heading font-black text-white mb-6 leading-tight">Ready to create <br /><span className="text-brand-gold italic">Impact?</span></h3>
                  <p className="text-blue-50/70 text-sm font-light leading-relaxed mb-10">
                    Join a community of 18-30 year olds dedicated to service above self. Let's make a difference together.
                  </p>
                  <button className="px-10 py-5 bg-brand-gold text-brand-blue font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-white transition-all shadow-xl">
                    Inquire About Membership
                  </button>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="animate-fade-up" style={{ animationDelay: "200ms" }}>
              <div className="glass p-10 md:p-16 rounded-[3rem] shadow-premium relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />

                {success ? (
                  <div className="text-center py-16 relative z-10">
                    <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                      <CheckCircleIcon className="w-12 h-12" />
                    </div>
                    <h3 className="text-4xl font-heading font-black text-brand-blue mb-4">Message Received.</h3>
                    <p className="text-brand-gray/60 font-light text-lg mb-10 max-w-sm mx-auto">Thank you for reaching out. A club representative will contact you shortly.</p>
                    <button
                      onClick={() => setSuccess(false)}
                      className="px-10 py-5 bg-brand-blue text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-brand-azure transition-all shadow-xl"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="text-3xl font-heading font-black text-brand-blue italic mb-10 underline decoration-brand-gold decoration-4 underline-offset-8 relative z-10">
                      Send a Message
                    </h3>
                    {error && (
                      <div className="bg-red-50 text-red-600 p-6 rounded-[1.5rem] mb-10 font-black text-[10px] uppercase tracking-widest border border-red-100 relative z-10 animate-shake">
                        {error}
                      </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-brand-blue/40 ml-2">First Name</label>
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            className="w-full px-6 py-4 bg-white/50 border border-slate-100 rounded-2xl focus:outline-none focus:bg-white focus:shadow-inner transition-all text-brand-blue font-bold tracking-tight"
                            placeholder="John"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-brand-blue/40 ml-2">Last Name</label>
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            className="w-full px-6 py-4 bg-white/50 border border-slate-100 rounded-2xl focus:outline-none focus:bg-white focus:shadow-inner transition-all text-brand-blue font-bold tracking-tight"
                            placeholder="Doe"
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-brand-blue/40 ml-2">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-6 py-4 bg-white/50 border border-slate-100 rounded-2xl focus:outline-none focus:bg-white focus:shadow-inner transition-all text-brand-blue font-bold tracking-tight"
                          placeholder="john@example.com"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-brand-blue/40 ml-2">Your Message</label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={6}
                          className="w-full px-6 py-4 bg-white/50 border border-slate-100 rounded-2xl focus:outline-none focus:bg-white focus:shadow-inner transition-all text-brand-blue font-bold tracking-tight resize-none"
                          placeholder="How can we help?"
                        ></textarea>
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-6 bg-brand-blue text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-brand-azure transition-all shadow-xl disabled:opacity-50 hover:-translate-y-1 active:translate-y-0"
                      >
                        {loading ? "Transmitting..." : "Submit Message"}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

