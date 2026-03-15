"use client";
import { useState } from "react";
import { motion } from "framer-motion";

interface RSVPFormProps {
  eventSlug: string;
  eventTitle: string;
}

export default function RSVPForm({ eventSlug, eventTitle }: RSVPFormProps) {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, event_slug: eventSlug }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setForm({ name: "", email: "", phone: "" });
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <div className="text-3xl mb-2">🎉</div>
        <h3 className="font-heading font-semibold text-green-800 text-lg">You&apos;re registered!</h3>
        <p className="text-green-600 text-sm mt-1">See you at {eventTitle}.</p>
      </motion.div>
    );
  }

  return (
    <div className="bg-brand-grey rounded-xl p-6">
      <h3 className="font-heading font-semibold text-brand-blue text-lg mb-4">RSVP for this event</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Your name" type="text"
          className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30" />
        <input required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="Email address" type="email"
          className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30" />
        <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="Phone (optional)" type="tel"
          className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30" />
        <button type="submit" disabled={status === "loading"}
          className="w-full py-3 bg-brand-blue text-white font-semibold rounded-lg hover:bg-brand-blue/90 transition-colors disabled:opacity-60 text-sm">
          {status === "loading" ? "Registering..." : "Register Now"}
        </button>
        {status === "error" && <p className="text-red-500 text-xs text-center">Something went wrong. Please try again.</p>}
      </form>
    </div>
  );
}
