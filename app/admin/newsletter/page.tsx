"use client";
export const runtime = 'edge';

import { useState, useEffect, Suspense } from "react";
import { useUser } from "@clerk/nextjs";
import { isAdmin } from "@/lib/admin";
import { useSearchParams } from "next/navigation";

function NewsletterForm() {
    const { user } = useUser();
    const searchParams = useSearchParams();
    const email = user?.primaryEmailAddress?.emailAddress;
    const userIsAdmin = isAdmin(email, user?.publicMetadata?.role);

    const [subject, setSubject] = useState(searchParams.get("subject") || "");
    const [body, setBody] = useState(searchParams.get("body") || "");
    const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
    const [result, setResult] = useState<{ sent: number; total: number; errors?: string[] } | null>(null);
    const [subCount, setSubCount] = useState<number | null>(null);

    useEffect(() => {
        fetch("/api/newsletter/subscribers-count")
            .then((r) => r.json())
            .then((d) => setSubCount(d.count ?? null))
            .catch(() => { });
    }, []);

    if (!userIsAdmin) {
        return (
            <div className="p-8 text-center text-red-400">
                You don't have permission to access this page.
            </div>
        );
    }

    async function handleSend(e: React.FormEvent) {
        e.preventDefault();
        if (!subject.trim() || !body.trim()) return;
        setStatus("loading");
        setResult(null);
        try {
            const res = await fetch("/api/newsletter/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subject, body }),
            });
            const data = await res.json();
            if (res.ok) {
                setStatus("done");
                setResult(data);
            } else {
                setStatus("error");
            }
        } catch {
            setStatus("error");
        }
    }

    async function handleSync() {
        const confirmSync = confirm("This will automatically subscribe all registered website users who aren't already on the list. Continue?");
        if (!confirmSync) return;

        setStatus("loading");
        try {
            const res = await fetch("/api/newsletter/sync-users", { method: "POST" });
            const data = await res.json();
            if (res.ok) {
                alert(`Success! Synced ${data.synced} users.`);
                window.location.reload();
            } else {
                alert("Sync failed: " + data.error);
            }
        } catch {
            alert("Error connecting to server.");
        } finally {
            setStatus("idle");
        }
    }

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-100">
                <div className="text-center md:text-left">
                    <h1 className="text-4xl font-heading font-black text-brand-blue">Newsletter <span className="text-brand-gold">Broadcast</span></h1>
                    <p className="text-brand-gray mt-2 text-base font-medium">Compose and send a branded email to your entire subscriber base.</p>
                    {subCount !== null && (
                        <div className="mt-6 inline-flex items-center gap-3 bg-brand-gold/10 border-2 border-brand-gold/30 rounded-2xl px-6 py-3 shadow-sm">
                            <span className="text-brand-gold font-black text-2xl">{subCount}</span>
                            <span className="text-brand-blue font-bold uppercase tracking-widest text-xs">Active Subscriber{subCount !== 1 ? "s" : ""}</span>
                        </div>
                    )}
                </div>
                <button
                    onClick={handleSync}
                    disabled={status === "loading"}
                    className="group flex items-center gap-3 px-6 py-4 bg-slate-900 hover:bg-brand-blue text-white rounded-2xl transition-all shadow-lg hover:-translate-y-1 disabled:opacity-50"
                >
                    <div className="text-left leading-tight">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60 group-hover:opacity-100">Sync Members</p>
                        <p className="text-xs font-bold whitespace-nowrap">Subscribe All Web Users</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor font-bold"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    </div>
                </button>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-slate-100 p-8 md:p-12">
                <form onSubmit={handleSend} className="space-y-8">
                    <div>
                        <label className="block text-xs font-black text-brand-blue uppercase tracking-[0.2em] mb-3 ml-1">Email Subject Line</label>
                        <input
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                            placeholder="e.g. You're Invited: RYLA 2026 – Register Now!"
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-gold/50 focus:bg-white transition-all font-bold"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-black text-brand-blue uppercase tracking-[0.2em] mb-3 ml-1">
                            Email Message Body <span className="text-brand-gray font-medium lowercase">(HTML tags supported)</span>
                        </label>
                        <textarea
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            required
                            rows={12}
                            placeholder="Write your email content here. You can use HTML like <b>bold</b>, <i>italic</i>, or <a href='...'>links</a>."
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-gold/50 focus:bg-white transition-all font-mono text-sm leading-relaxed"
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={status === "loading"}
                            className="w-full bg-brand-blue hover:bg-brand-azure text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-blue-900/20 disabled:opacity-60 flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-sm"
                        >
                            {status === "loading" ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Processing Agent...
                                </>
                            ) : (
                                <>
                                    <span>📤 Broadcast to {subCount ?? "All"} Subscribers</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {status === "done" && result && (
                    <div className="mt-10 bg-green-50 border-2 border-green-100 rounded-[2rem] p-8">
                        <div className="flex items-center gap-4 text-green-700 mb-4">
                            <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-xl">✓</div>
                            <p className="font-black uppercase tracking-widest text-sm">
                                Successfully sent to {result.sent} / {result.total} subscribers
                            </p>
                        </div>
                        {result.errors && result.errors.length > 0 && (
                            <div className="mt-4 p-4 bg-white/50 rounded-xl border border-green-200">
                                <p className="text-yellow-700 text-xs font-black uppercase tracking-widest mb-2">Failed Deliveries:</p>
                                <ul className="space-y-1">
                                    {result.errors.map((e, i) => (
                                        <li key={i} className="text-xs text-slate-500 font-medium list-disc ml-4">{e}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {status === "error" && (
                    <div className="mt-10 bg-red-50 border-2 border-red-100 rounded-[2rem] p-6 text-red-600 flex items-center gap-4">
                        <div className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-xl font-mono">!</div>
                        <div>
                            <p className="font-black uppercase tracking-widest text-sm">Broadcast Failed</p>
                            <p className="text-xs font-medium opacity-80">Check your Resend API Key in .env.local or Resend dashboard.</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-12 flex justify-between items-center px-4">
                <button
                    onClick={() => { setSubject(""); setBody(""); }}
                    className="text-brand-gray hover:text-brand-cranberry text-[10px] uppercase font-black tracking-[0.3em] transition-all hover:translate-x-1"
                >
                    🗑 Reset Editor
                </button>
                <p className="text-brand-gray/40 text-[10px] uppercase font-black tracking-[0.2em]">RCSB Newsletter Engine v1.0</p>
            </div>
        </div>
    );
}

export default function AdminNewsletterPage() {
    return (
        <Suspense fallback={<div className="p-10 text-white">Loading...</div>}>
            <NewsletterForm />
        </Suspense>
    );
}
