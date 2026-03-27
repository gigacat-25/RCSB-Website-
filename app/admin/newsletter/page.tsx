"use client";
export const runtime = 'edge';

import { useState, useEffect, Suspense, useRef } from "react";
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
    const [subscribers, setSubscribers] = useState<any[]>([]);
    const [unsubscribed, setUnsubscribed] = useState<any[]>([]);
    const [bulkEmails, setBulkEmails] = useState("");
    const [isBulkAdding, setIsBulkAdding] = useState(false);

    const [aiPrompt, setAiPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const hasAutoDrafted = useRef(false);

    useEffect(() => {
        const autoDraft = searchParams.get("autoDraft");
        if (autoDraft === "true" && !hasAutoDrafted.current) {
            hasAutoDrafted.current = true;

            const title = searchParams.get("projectTitle") || "";
            const details = searchParams.get("projectDetails") || "";
            const type = searchParams.get("projectType") || "project";
            const slug = searchParams.get("projectSlug") || "";
            const imageUrl = searchParams.get("imageUrl") || "";
            const eventDate = searchParams.get("eventDate") || "";
            const rsvpLink = searchParams.get("rsvpLink") || "";

            const section = type === "event" ? "events" : (type === "blog" ? "blogs" : "projects");

            let dateContext = "";
            if (eventDate) {
                const eDate = new Date(eventDate);
                const today = new Date();
                const diffTime = eDate.getTime() - today.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays > 0) {
                    dateContext = `\nThe event is scheduled for ${eDate.toLocaleDateString()}. It is exactly ${diffDays} days away. Make sure to mention this countdown/urgency in the email.`;
                } else if (diffDays === 0) {
                    dateContext = `\nThe event is scheduled for today! Emphasize that it's happening today in the email.`;
                } else {
                    dateContext = `\nThe event was on ${eDate.toLocaleDateString()}. Write the email in past tense as a recap or highlight of the successful event.`;
                }
            }

            let imageContext = "";
            if (imageUrl) {
                imageContext = `\nPlease embed this cover image at the very beginning of the email body exactly like this: <img src="${imageUrl}" alt="Cover Image" style="width:100%; border-radius:12px; margin-bottom:20px;" />`;
            }

            let rsvpContext = "";
            if (rsvpLink) {
                rsvpContext = `\nThere is an RSVP link for this event: ${rsvpLink}. Create a large, prominent RSVP button that points to this exact link with the text "RSVP Now" or "Get Your Tickets".`;
            }

            const prompt = `Please write a highly engaging, professional HTML email newsletter announcing the following ${type}.
Title: ${title}
Details: ${details}
Link to view: https://rcsb-website.pages.dev/${section}/${slug}
${dateContext}${imageContext}${rsvpContext}

Make sure the link text is an interesting, compelling Call-To-Action (e.g. "Discover the Full Story" or "Secure Your Spot Today!") instead of a plain "Click here".
Do not output anything but the JSON format with "subject" and "body" (using semantic HTML tags).`;

            setIsGenerating(true);
            fetch("/api/newsletter/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            })
                .then(res => res.json())
                .then(data => {
                    if (data.subject) setSubject(data.subject);
                    if (data.body) setBody(data.body);
                })
                .catch(err => {
                    console.error("Auto draft failed:", err);
                    alert("Failed to auto-generate draft.");
                })
                .finally(() => setIsGenerating(false));
        }
    }, [searchParams]);

    useEffect(() => {
        fetch("/api/newsletter/subscribers-count")
            .then((r) => r.json())
            .then((d) => setSubCount(d.count ?? null))
            .catch(() => { });

        fetch("/api/newsletter/subscribers")
            .then((r) => r.json())
            .then((d) => setSubscribers(Array.isArray(d) ? d : []))
            .catch(() => { });

        fetch("/api/newsletter/unsubscribed")
            .then((r) => r.json())
            .then((d) => setUnsubscribed(Array.isArray(d) ? d : []))
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
                setResult({ sent: 0, total: 0, errors: [data.error || "Unknown server error"] });
            }
        } catch (err: any) {
            setStatus("error");
            setResult({ sent: 0, total: 0, errors: [err.message || "Failed to connect to server"] });
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

    async function handleBulkAdd(e: React.FormEvent) {
        e.preventDefault();
        const emails = bulkEmails.split(/[\n,]+/).map(e => e.trim()).filter(e => e.includes("@"));
        if (emails.length === 0) return alert("No valid emails found.");

        setIsBulkAdding(true);
        let successCount = 0;
        for (const email of emails) {
            try {
                await fetch("/api/newsletter/subscribe", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, forceResubscribe: false }),
                });
                successCount++;
            } catch (err) { console.error(err); }
        }
        setIsBulkAdding(false);
        setBulkEmails("");
        alert(`Successfully processed ${successCount} emails.`);
        window.location.reload();
    }

    async function handleResync(emailParam: string) {
        if (!confirm(`Force resync ${emailParam}? They will receive emails again.`)) return;

        try {
            const res = await fetch("/api/newsletter/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: emailParam, forceResubscribe: true }),
            });
            if (res.ok) {
                alert(`${emailParam} has been successfully resynced!`);
                window.location.reload();
            } else {
                alert("Failed to resync.");
            }
        } catch (err) {
            alert("Error resyncing.");
        }
    }

    async function handleGenerateAI() {
        const promptToUse = aiPrompt.trim()
            ? aiPrompt
            : `Please rewrite the following project/event details into a highly engaging, professional HTML email newsletter. Use semantic HTML tags. Do not output anything but the final JSON.\nSubject: ${subject}\nDetails: ${body}`;

        if (!promptToUse.trim()) return;

        setIsGenerating(true);
        try {
            const res = await fetch("/api/newsletter/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: promptToUse }),
            });
            const data = await res.json();
            if (res.ok) {
                setSubject(data.subject || "");
                setBody(data.body || "");
            } else {
                alert("AI Generation failed: " + (data.error || "Unknown error"));
            }
        } catch (err: any) {
            alert("Error connecting to AI service. " + err.message);
        } finally {
            setIsGenerating(false);
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
                <div className="mb-8 p-6 bg-brand-gold/10 border-2 border-brand-gold/20 rounded-2xl flex flex-col gap-4">
                    <label className="block text-xs font-black text-brand-gold uppercase tracking-[0.2em] ml-1">✨ Draft with AI</label>
                    <textarea
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        rows={3}
                        placeholder="e.g. Write an invitation to our upcoming beach cleanup event on Saturday..."
                        className="w-full bg-white border-2 border-brand-gold/20 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-gold transition-all text-sm"
                    />
                    <button
                        type="button"
                        onClick={handleGenerateAI}
                        disabled={isGenerating || status === "loading" || (!aiPrompt.trim() && !body.trim())}
                        className="self-end px-6 py-3 bg-brand-gold hover:bg-yellow-500 text-white font-bold rounded-xl text-sm transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-brand-gold/20 tracking-wider"
                    >
                        {isGenerating ? "✨ Generating..." : "✨ Generate Draft"}
                    </button>
                </div>

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
                            <p className="text-xs font-medium opacity-80">
                                {result?.errors?.[0] || "Check your API credentials in .env.local or server logs."}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Subscriber Management Section */}
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-slate-100 p-8 md:p-12 mt-8">
                <h2 className="text-2xl font-heading font-black text-brand-blue mb-6">Manage Subscribers</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Active List */}
                    <div className="p-6 bg-slate-50 border-2 border-slate-100 rounded-2xl flex flex-col lg:col-span-1">
                        <label className="block text-xs font-black text-green-600 uppercase tracking-[0.2em] mb-3 ml-1">Active Subscribers ({subscribers.length})</label>
                        <div className="flex-1 bg-white border-2 border-slate-200 rounded-xl overflow-y-auto max-h-48 p-2">
                            {subscribers.length === 0 ? (
                                <div className="h-full flex items-center justify-center p-4 text-xs font-medium text-slate-400 text-center">No active subscribers.</div>
                            ) : (
                                <ul className="divide-y divide-slate-100">
                                    {subscribers.map((u, i) => (
                                        <li key={i} className="p-3 text-sm">
                                            <span className="font-medium text-slate-700 break-all">{u.email}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* Bulk Add */}
                    <div className="p-6 bg-slate-50 border-2 border-slate-100 rounded-2xl">
                        <label className="block text-xs font-black text-brand-blue uppercase tracking-[0.2em] mb-3 ml-1">Bulk Add Emails</label>
                        <form onSubmit={handleBulkAdd}>
                            <textarea
                                value={bulkEmails}
                                onChange={(e) => setBulkEmails(e.target.value)}
                                rows={5}
                                placeholder="john@example.com, jane@example.com&#10;admin@example.com"
                                className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-brand-gold transition-all text-sm mb-4"
                            />
                            <button
                                type="submit"
                                disabled={isBulkAdding || !bulkEmails.trim()}
                                className="w-full py-3 bg-brand-gold hover:bg-yellow-500 text-white font-bold rounded-xl text-sm transition-all disabled:opacity-50"
                            >
                                {isBulkAdding ? "Processing..." : "Bulk Subscribe"}
                            </button>
                            <p className="text-[10px] text-slate-400 mt-3 font-medium text-center">Unsubscribed users are safely skipped.</p>
                        </form>
                    </div>

                    {/* Unsubscribed List */}
                    <div className="p-6 bg-slate-50 border-2 border-slate-100 rounded-2xl flex flex-col">
                        <label className="block text-xs font-black text-brand-cranberry uppercase tracking-[0.2em] mb-3 ml-1">Unsubscribed Users ({unsubscribed.length})</label>
                        <div className="flex-1 bg-white border-2 border-slate-200 rounded-xl overflow-y-auto max-h-48 p-2">
                            {unsubscribed.length === 0 ? (
                                <div className="h-full flex items-center justify-center p-4 text-xs font-medium text-slate-400 text-center">No unsubscribed users.</div>
                            ) : (
                                <ul className="divide-y divide-slate-100">
                                    {unsubscribed.map((u, i) => (
                                        <li key={i} className="flex flex-col gap-2 items-start justify-between p-3 text-sm">
                                            <span className="font-medium text-slate-700 break-all">{u.email}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleResync(u.email)}
                                                className="w-full px-3 py-1.5 bg-slate-100 hover:bg-brand-blue hover:text-white text-brand-blue font-bold rounded-lg text-xs transition-all"
                                            >
                                                Force Resync
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
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
