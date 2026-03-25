"use client";

import { useEffect, useState, useRef } from "react";
import { useUser } from "@clerk/nextjs";

export default function SubscribePopup() {
    const { user } = useUser();
    const [visible, setVisible] = useState(false);
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        // Don't show if already dismissed or already subscribed via session flag
        if (
            localStorage.getItem("rcsbPopupDismissed") === "true" ||
            localStorage.getItem("rcsbSubscribed") === "true"
        ) {
            return;
        }
        timerRef.current = setTimeout(() => setVisible(true), 10000);
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    // Pre-fill with logged-in user's email
    useEffect(() => {
        if (user?.primaryEmailAddress?.emailAddress) {
            setEmail(user.primaryEmailAddress.emailAddress);
        }
    }, [user]);

    function dismiss() {
        setVisible(false);
        localStorage.setItem("rcsbPopupDismissed", "true");
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!email) return;
        setStatus("loading");
        try {
            const res = await fetch("/api/newsletter/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, name: user?.fullName || null }),
            });
            if (res.ok) {
                setStatus("done");
                localStorage.setItem("rcsbSubscribed", "true");
                setTimeout(() => setVisible(false), 2500);
            } else {
                setStatus("error");
            }
        } catch {
            setStatus("error");
        }
    }

    if (!visible) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[9999] max-w-sm w-full animate-slide-up">
            <div className="relative bg-[#0d1528] border border-[#C9982A]/30 rounded-2xl shadow-2xl p-6 backdrop-blur-md">
                {/* Close button */}
                <button
                    onClick={dismiss}
                    className="absolute top-3 right-4 text-gray-400 hover:text-white text-lg leading-none"
                    aria-label="Close"
                >
                    ×
                </button>

                {status === "done" ? (
                    <div className="text-center py-2">
                        <div className="text-2xl mb-2">🎉</div>
                        <p className="text-white font-semibold text-sm">You're subscribed!</p>
                        <p className="text-gray-400 text-xs mt-1">You'll get updates on new events and blogs.</p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-[#C9982A] text-lg">📬</span>
                            <p className="text-white font-bold text-sm">Stay in the loop!</p>
                        </div>
                        <p className="text-gray-400 text-xs mb-4 leading-relaxed">
                            Get notified about new events, blogs, and updates from Rotaract Swarna Bengaluru.
                        </p>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#C9982A]/50"
                            />
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    disabled={status === "loading"}
                                    className="flex-1 bg-[#C9982A] hover:bg-amber-500 text-[#0a0f1e] font-bold text-sm py-2 rounded-lg transition-colors disabled:opacity-60"
                                >
                                    {status === "loading" ? "Subscribing..." : "Subscribe"}
                                </button>
                                <button
                                    type="button"
                                    onClick={dismiss}
                                    className="text-xs text-gray-500 hover:text-gray-300 px-2"
                                >
                                    No thanks
                                </button>
                            </div>
                            {status === "error" && (
                                <p className="text-red-400 text-xs text-center">Something went wrong. Try again.</p>
                            )}
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
