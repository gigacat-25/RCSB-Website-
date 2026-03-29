export const runtime = 'edge';
"use client";

import { useState } from "react";
import { EnvelopeIcon, MapPinIcon, GlobeAltIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    reason: "General Inquiry",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
          phone: formData.phone,
          reason: formData.reason,
          message: formData.message
        }),
      });

      if (!res.ok) throw new Error("Failed to send message. Please try again.");

      setSuccess(true);
      setFormData({ firstName: "", lastName: "", email: "", phone: "", reason: "General Inquiry", message: "" });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
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
          <div className="max-w-4xl animate-fade-up">
            <span className="text-[10px] font-black text-brand-gold uppercase tracking-[0.4em] mb-4 md:mb-6 block">Contact Us</span>
            <h1 className="text-5xl md:text-8xl font-heading font-black text-white mb-6 md:mb-8 leading-[1.1]">
              Start a <br />
              <span className="text-brand-gold italic">Conversation.</span>
            </h1>
            <p className="text-white/90 text-lg md:text-xl font-light leading-relaxed max-w-2xl">
              Whether you're looking to join our ranks, partner on a project, or simply learn more about our impact, we're here to listen and collaborate.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

            {/* Contact Info */}
            <div className="space-y-12 animate-fade-up">
              <div>
                <h2 className="text-2xl md:text-3xl font-heading font-black text-brand-blue italic mb-8 md:mb-10 underline decoration-brand-gold decoration-4 underline-offset-8">
                  Get Information
                </h2>
                <div className="grid gap-4 md:gap-6">
                  <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-xl shadow-slate-200/50 flex items-center gap-4 md:gap-8">
                    <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-2xl md:rounded-3xl bg-slate-100 flex items-center justify-center text-brand-blue">
                      <EnvelopeIcon className="w-6 h-6 md:w-8 md:h-8 stroke-2" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1 md:mb-2">Email Us</h4>
                      <p className="text-brand-blue font-black text-lg md:text-2xl tracking-tight mb-1 md:mb-2 break-all">rota.rcbs@gmail.com</p>
                      <p className="text-[9px] md:text-[11px] font-black text-[#00A1E0] uppercase tracking-widest hidden sm:block">Typical response: 24h</p>
                    </div>
                  </div>

                  <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-xl shadow-slate-200/50 flex items-center gap-4 md:gap-8">
                    <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-2xl md:rounded-3xl bg-[#F5C767] flex items-center justify-center text-brand-blue">
                      <MapPinIcon className="w-6 h-6 md:w-8 md:h-8 stroke-2" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1 md:mb-2">Find Us</h4>
                      <p className="text-brand-blue font-black text-lg md:text-2xl tracking-tight mb-1 md:mb-2">Rotary House of Friendship, 11 Lavelle Road, Bengaluru</p>
                      <p className="text-[9px] md:text-[11px] font-black text-[#00A1E0] uppercase tracking-widest hidden sm:block">Headquarters</p>
                    </div>
                  </div>

                  <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-xl shadow-slate-200/50 flex items-center gap-4 md:gap-8">
                    <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-2xl md:rounded-3xl bg-[#EDFAFD] flex items-center justify-center text-[#00A1E0]">
                      <GlobeAltIcon className="w-6 h-6 md:w-8 md:h-8 stroke-2" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1 md:mb-2">Connect</h4>
                      <div className="flex items-center gap-2 md:gap-3 mt-1">
                        <a href="https://www.instagram.com/rotaract_swarnabengaluru" target="_blank" rel="noopener noreferrer" className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-slate-50 flex items-center justify-center text-brand-blue hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#e6683c] hover:to-[#bc1888] hover:text-white transition-all duration-300 shadow-sm border border-slate-100 group">
                          <FaInstagram className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
                        </a>
                        <a href="https://www.facebook.com/rotaractswarnabengaluru/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-slate-50 flex items-center justify-center text-brand-blue hover:bg-[#1877F2] hover:border-[#1877F2] hover:text-white transition-all duration-300 shadow-sm border border-slate-100 group">
                          <FaFacebookF className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
                        </a>
                        <a href="https://www.linkedin.com/company/rotaract-club-of-swarna-bengaluru/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-slate-50 flex items-center justify-center text-brand-blue hover:bg-[#0077b5] hover:border-[#0077b5] hover:text-white transition-all duration-300 shadow-sm border border-slate-100 group">
                          <FaLinkedinIn className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
                        </a>
                        <a href="https://www.youtube.com/channel/UCE4XQBKSjPs8rj5xyH6FOxA" target="_blank" rel="noopener noreferrer" className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-slate-50 flex items-center justify-center text-brand-blue hover:bg-[#FF0000] hover:border-[#FF0000] hover:text-white transition-all duration-300 shadow-sm border border-slate-100 group">
                          <FaYoutube className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
                        </a>
                        <a href="https://x.com/RCSwarnaB" target="_blank" rel="noopener noreferrer" className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-slate-50 flex items-center justify-center text-brand-blue hover:bg-black hover:border-black hover:text-white transition-all duration-300 shadow-sm border border-slate-100 group">
                          <FaXTwitter className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="premium-card group p-8 md:p-12 bg-[#0a1835] relative overflow-hidden rounded-[2rem] md:rounded-[3rem]">
                <div className="absolute inset-0 pointer-events-none">
                  <div
                    className="absolute w-full h-full"
                    style={{
                      backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)`,
                      backgroundSize: '24px 24px',
                      maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 80%)',
                      WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 80%)'
                    }}
                  />
                  <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/10 rounded-full blur-[60px]" />
                </div>
                <div className="relative z-10 text-center md:text-left">
                  <span className="text-[10px] font-black text-brand-gold uppercase tracking-[0.4em] mb-4 block">Membership</span>
                  <h3 className="text-2xl md:text-3xl font-heading font-black text-white mb-4 md:mb-6 leading-tight">Ready to create <br className="hidden md:block" /><span className="text-brand-gold italic">Impact?</span></h3>
                  <p className="text-blue-50/70 text-sm font-light leading-relaxed mb-8 md:mb-10 mx-auto md:mx-0 max-w-sm">
                    Join a community of 18-30 year olds dedicated to service above self. Let's make a difference together.
                  </p>
                  <button className="w-full md:w-auto px-6 py-4 md:px-10 md:py-5 bg-brand-gold text-brand-blue font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-white transition-all shadow-xl">
                    Inquire About Membership
                  </button>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="animate-fade-up" style={{ animationDelay: "200ms" }}>
              <div className="glass p-6 md:p-16 rounded-[2rem] md:rounded-[3rem] shadow-premium relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />

                {success ? (
                  <div className="text-center py-12 md:py-16 relative z-10">
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-inner">
                      <CheckCircleIcon className="w-10 h-10 md:w-12 md:h-12" />
                    </div>
                    <h3 className="text-3xl md:text-4xl font-heading font-black text-brand-blue mb-4">Message Received.</h3>
                    <p className="text-brand-gray/60 font-light text-sm md:text-lg mb-8 md:mb-10 max-w-sm mx-auto">Thank you for reaching out. A club representative will contact you shortly.</p>
                    <button
                      onClick={() => setSuccess(false)}
                      className="w-full md:w-auto px-8 py-4 md:px-10 md:py-5 bg-brand-blue text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-brand-azure transition-all shadow-xl"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="text-2xl md:text-3xl font-heading font-black text-brand-blue italic mb-8 md:mb-10 underline decoration-brand-gold decoration-4 underline-offset-8 relative z-10">
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-brand-blue/40 ml-2">Phone Number</label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-6 py-4 bg-white/50 border border-slate-100 rounded-2xl focus:outline-none focus:bg-white focus:shadow-inner transition-all text-brand-blue font-bold tracking-tight"
                            placeholder="+91 98765 43210"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-brand-blue/40 ml-2">Reason</label>
                          <div className="relative">
                            <select
                              name="reason"
                              value={formData.reason}
                              onChange={handleChange}
                              required
                              className="w-full px-6 py-4 bg-white/50 border border-slate-100 rounded-2xl focus:outline-none focus:bg-white focus:shadow-inner transition-all text-brand-blue font-bold tracking-tight appearance-none cursor-pointer"
                            >
                              <option value="General Inquiry">General Inquiry</option>
                              <option value="Membership">Membership</option>
                              <option value="Partnership">Partnership</option>
                              <option value="Host a Project">Host a Project</option>
                              <option value="Other">Other</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-6 flex items-center text-brand-blue/40">
                              <svg className="fill-current w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                            </div>
                          </div>
                        </div>
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

