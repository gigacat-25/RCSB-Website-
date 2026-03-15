"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <div className="text-4xl mb-3">✅</div>
        <h3 className="font-heading font-bold text-green-800 text-xl">Message sent!</h3>
        <p className="text-green-600 mt-1">We&apos;ll get back to you soon.</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
        <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Rtr. Name" type="text"
          className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 bg-white" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
        <input required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="you@example.com" type="email"
          className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 bg-white" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
        <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="Tell us how we can help..." rows={5}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 bg-white resize-none" />
      </div>
      <button type="submit" disabled={status === "loading"}
        className="py-3 bg-brand-blue text-white font-semibold rounded-lg hover:bg-brand-blue/90 transition-colors disabled:opacity-60">
        {status === "loading" ? "Sending..." : "Send Message"}
      </button>
      {status === "error" && <p className="text-red-500 text-sm text-center">Something went wrong. Please try again.</p>}
    </form>
  );
}
