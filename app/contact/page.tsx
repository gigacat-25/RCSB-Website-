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
    <div className="bg-brand-light min-h-screen">
      {/* Header */}
      <section className="bg-brand-blue py-20 text-white">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Get in Touch</h1>
          <p className="text-blue-100 max-w-2xl text-lg">
            Have questions or want to collaborate? We'd love to hear from you. Reach out to our team today.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-heading font-bold text-brand-blue mb-8">Contact Information</h2>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-brand-blue shrink-0">
                    <EnvelopeIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Email Us</h4>
                    <p className="text-gray-600">contact@rcsb.in</p>
                    <p className="text-xs text-brand-azure mt-1 font-semibold">Expect a response within 24 hours.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-brand-gold shrink-0">
                    <MapPinIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Our Location</h4>
                    <p className="text-gray-600">Bengaluru, Karnataka, India</p>
                    <p className="text-xs text-brand-azure mt-1 font-semibold">Serving the Swarna Bengaluru community.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-azure-100 flex items-center justify-center text-brand-azure shrink-0">
                    <GlobeAltIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Social Media</h4>
                    <div className="flex gap-4 mt-2">
                      <span className="text-sm font-bold text-brand-blue hover:text-brand-azure cursor-pointer">Instagram</span>
                      <span className="text-sm font-bold text-brand-blue hover:text-brand-azure cursor-pointer">LinkedIn</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-16 p-8 bg-brand-blue rounded-3xl text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                <h3 className="text-2xl font-heading font-bold mb-4">Want to Join?</h3>
                <p className="text-blue-100 mb-6">If you're between 18-30 and looking to create impact, join our club!</p>
                <button className="px-8 py-3 bg-brand-gold text-brand-blue font-bold rounded-full hover:bg-white transition-all shadow-md">
                  Membership Inquiry
                </button>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100">
              {success ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircleIcon className="w-12 h-12" />
                  </div>
                  <h3 className="text-2xl font-bold text-brand-blue mb-4">Message Sent!</h3>
                  <p className="text-brand-gray font-medium mb-8">Thank you for reaching out. Our team will get back to you shortly.</p>
                  <button 
                    onClick={() => setSuccess(false)}
                    className="px-8 py-3 bg-brand-blue text-white font-bold rounded-full hover:bg-brand-azure transition-all"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-heading font-bold text-brand-blue mb-8">Send us a message</h3>
                  {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-semibold border-l-4 border-red-500">
                      {error}
                    </div>
                  )}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">First Name</label>
                        <input 
                          type="text" 
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-blue" 
                          placeholder="John" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Last Name</label>
                        <input 
                          type="text" 
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-blue" 
                          placeholder="Doe" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Email Address</label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-blue" 
                        placeholder="john@example.com" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Message</label>
                      <textarea 
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5} 
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-blue" 
                        placeholder="How can we help?"
                      ></textarea>
                    </div>
                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-brand-blue text-white font-bold rounded-xl hover:bg-brand-azure transition-all shadow-md disabled:opacity-50"
                    >
                      {loading ? "Sending..." : "Submit Message"}
                    </button>
                  </form>
                </>
              )}
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

