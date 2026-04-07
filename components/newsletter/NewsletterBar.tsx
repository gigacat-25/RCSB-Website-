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
        <div className="border-b border-white/5 py-5 mb-4 relative overflow-hidden">
            {/* Subtle glow */}
            <div className="absolute top-1/2 left-1/4 w-64 h-8 bg-brand-gold/5 blur-[60px] rounded-full pointer-events-none" />

            <div className="container-custom relative z-10">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-center sm:text-left shrink-0">
                        <p className="text-sm font-heading font-black text-white">
                            Subscribe to <span className="text-brand-gold italic">Updates</span>
                        </p>
                        <p className="text-white/40 text-xs font-light mt-0.5">
                            Latest news &amp; events. No spam, just impact.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="w-full max-w-sm">
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-white/25">
                                    <EnvelopeIcon className="w-4 h-4" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email address"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-white placeholder-white/25 focus:outline-none focus:border-brand-gold/40 transition-all text-xs"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={status === "loading"}
                                className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all shrink-0
                  ${status === "done"
                                        ? "bg-green-500 text-white"
                                        : "bg-brand-gold text-brand-blue hover:bg-white"
                                    } disabled:opacity-50`}
                            >
                                {status === "loading" ? "…" : status === "done" ? "✓" : "Subscribe"}
                            </button>
                        </div>
                        {status === "error" && (
                            <p className="text-brand-cranberry text-[10px] uppercase font-black tracking-widest mt-1.5">
                                Something went wrong. Try again.
                            </p>
                        )}
                        {status === "done" && (
                            <p className="text-green-400 text-[10px] uppercase font-black tracking-widest mt-1.5">
                                You're on the list!
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
