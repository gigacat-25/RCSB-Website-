"use client";

import { useState } from "react";
import { EnvelopeIcon } from "@heroicons/react/24/outline";

export default function NewsletterBar() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!email) return;
        setStatus("loading");
        try {
            const res = await fetch("/api/newsletter/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            if (res.ok) {
                setStatus("done");
                setEmail("");
                localStorage.setItem("rcsbSubscribed", "true");
            } else {
                setStatus("error");
            }
        } catch {
            setStatus("error");
        }
    }

    return (
        <div className="bg-brand-blue/20 border-y border-white/5 py-12 mb-16 relative group overflow-hidden">
            {/* Decorative glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-brand-gold/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="container-custom relative z-10">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
                    <div className="max-w-xl text-center lg:text-left">
                        <h3 className="text-2xl md:text-3xl font-heading font-black text-white mb-3">
                            Subscribe to <span className="text-brand-gold italic">Updates</span>
                        </h3>
                        <p className="text-white/60 text-sm md:text-base font-light">
                            Get the latest news about our community projects and upcoming events.
                            No spam, just impact.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="w-full max-w-md">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-white/30">
                                    <EnvelopeIcon className="w-5 h-5" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email address"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-brand-gold/50 transition-all text-sm"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={status === "loading"}
                                className={`px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl
                  ${status === "done"
                                        ? "bg-green-500 text-white"
                                        : "bg-brand-gold text-brand-blue hover:bg-white hover:shadow-brand-gold/20"
                                    } disabled:opacity-50`}
                            >
                                {status === "loading" ? "..." : status === "done" ? "✓ Done" : "Subscribe"}
                            </button>
                        </div>
                        {status === "error" && (
                            <p className="text-brand-cranberry text-[10px] uppercase font-black tracking-widest mt-3 text-center lg:text-left">
                                Something went wrong. Please try again.
                            </p>
                        )}
                        {status === "done" && (
                            <p className="text-green-400 text-[10px] uppercase font-black tracking-widest mt-3 text-center lg:text-left">
                                Success! You're on the list.
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
