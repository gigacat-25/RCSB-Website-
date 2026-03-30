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
    const [searchTerm, setSearchTerm] = useState("");
    const [showPreview, setShowPreview] = useState(false);
    const [contextMedia, setContextMedia] = useState<{ imageUrl?: string; eventDate?: string; rsvpLink?: string }>({});
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

            setContextMedia({ imageUrl, eventDate, rsvpLink });

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

            const absImageUrl = imageUrl ? (imageUrl.startsWith("http") ? imageUrl : `https://rcsb-website.pages.dev${imageUrl}`) : "";
            const imageTag = absImageUrl ? `<img src="${absImageUrl}" alt="${title}" style="width:100%; border-radius:12px; margin-bottom:24px; border: 1px solid rgba(255,215,0,0.1);" />` : "";

            let imageContext = "";
            if (imageTag) {
                imageContext = `\nCRITICAL: You MUST include this EXACT cover image tag at the very top of your body: ${imageTag}`;
            }

            let rsvpContext = "";
            if (rsvpLink) {
                rsvpContext = `\nThere is an RSVP link for this event: ${rsvpLink}. Create a large, prominent RSVP button that points to this exact link with the text "RSVP Now" or "Get Your Tickets".`;
            }

            const prompt = `You are a professional communications officer for the Rotaract Club of Swarna Bengaluru (RCSB). 
Please write a highly engaging, branded HTML email newsletter announcing the following ${type}.

Title: ${title}
Details: ${details}
Official Website: https://rcsb-website.pages.dev
Official Email: rota.rcbs@gmail.com
Link to view on site: https://rcsb-website.pages.dev/${section}/${slug}

CONTEXTUAL DATA:
${dateContext}${imageContext}${rsvpContext}

Guidelines:
1. Always start the email body with a professional header: "Rotaract Club of Swarna Bengaluru".
2. Use a sophisticated, warm, and community-focused tone.
3. **Buttons**: Any primary link (like a feedback form or "Read More") MUST be a styled button. Use this EXACT HTML: 
   <div style="margin: 32px 0; text-align: center;">
     <a href="URL_HERE" style="background-color: #C9982A; color: #0a0f1e; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 900; font-size: 15px; display: inline-block; letter-spacing: 1px; text-transform: uppercase;">BUTTON_TEXT_HERE</a>
   </div>
4. **Media Usage**: Do NOT use placeholder images. Only use the image tag provided in the context above. If no image tag is provided, do not include an image.
5. Ensure the Call-To-Action (CTA) text is interesting and compelling.
6. **Note**: Do not repeat the physical address or social media links in the body; they are already handled by our permanent email footer.
7. Output ONLY a valid JSON object with keys "subject" and "body". Use semantic HTML tags in the body.`;

            setIsGenerating(true);
            fetch("/api/newsletter/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            })
                .then(async res => {
                    const data = await res.json();
                    if (!res.ok) throw new Error(data.details || data.error || "Generation failed");
                    return data;
                })
                .then(data => {
                    if (data.subject) setSubject(data.subject);
                    if (data.body) setBody(data.body);
                })
                .catch(err => {
                    console.error("Auto draft failed:", err);
                    alert(`AI Generation failed: ${err.message}`);
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

    const filteredSubscribers = subscribers.filter(s =>
        s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredUnsubscribed = unsubscribed.filter(s =>
        s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

    async function handleUnsubscribe(emailParam: string, tokenParam: string) {
        if (!confirm(`Are you sure you want to force unsubscribe ${emailParam}?`)) return;

        try {
            const res = await fetch(`/api/newsletter/unsubscribe?token=${tokenParam}`);
            if (res.ok) {
                alert(`${emailParam} has been unsubscribed.`);
                window.location.reload();
            } else {
                const data = await res.json();
                alert(`Failed to unsubscribe: ${data.error || "Unknown error"}`);
            }
        } catch (err) {
            alert("Error connecting to server.");
        }
    }

    async function handlePurge() {
        const confirm1 = confirm("⚠️ CRITICAL WARNING: This will permanently delete ALL active and unsubscribed emails from the newsletter database. This cannot be undone. Are you absolutely sure?");
        if (!confirm1) return;

        const confirm2 = confirm("FINAL CONFIRMATION: Are you 100% certain you want to WIPE the entire subscriber list?");
        if (!confirm2) return;

        setStatus("loading");
        try {
            const res = await fetch("/api/newsletter/purge", { method: "DELETE" });
            if (res.ok) {
                alert("Database purged successfully. All emails have been deleted.");
                window.location.reload();
            } else {
                alert("Purge failed. Check server logs.");
            }
        } catch (err) {
            alert("Connection error during purge.");
        } finally {
            setStatus("idle");
        }
    }

    async function handleGenerateAI() {
        let finalPrompt = "";
        const isRefining = subject.trim() || body.trim();

        const { imageUrl, rsvpLink } = contextMedia;
        const absImageUrl = imageUrl ? (imageUrl.startsWith("http") ? imageUrl : `https://rcsb-website.pages.dev${imageUrl}`) : "";
        const imageTag = absImageUrl ? `<img src="${absImageUrl}" style="width:100%; border-radius:12px; margin-bottom:24px;" />` : "";
        const imageInstruction = imageTag ? `\nCRITICAL: You MUST include this EXACT cover image tag at the VERY TOP of the email body: ${imageTag}` : "";
        const rsvpInstruction = rsvpLink ? `\nThere is an RSVP/Link: ${rsvpLink}. Make a proper gold button for it.` : "";

        if (isRefining && aiPrompt.trim()) {
            // Refinement Mode
            finalPrompt = `You are a professional communications officer for the Rotaract Club of Swarna Bengaluru.
I have an existing newsletter draft that needs modification.

CURRENT SUBJECT: ${subject}
CURRENT BODY: ${body}

MY REQUEST: ${aiPrompt}
${imageInstruction}${rsvpInstruction}

STRICT GUIDELINES:
1. Apply the requested changes while maintaining the branding.
2. If a cover image tag is provided above, ensure it is at the very top.
3. Use proper buttons for links. Use semantic HTML.
4. Output ONLY a valid JSON object with "subject" and "body".`;
        } else {
            // Normal Draft Mode
            finalPrompt = aiPrompt.trim()
                ? aiPrompt + imageInstruction + rsvpInstruction
                : `You are the communications officer for the Rotaract Club of Swarna Bengaluru. 
Please rewrite the following details into a highly engaging newsletter.

Subject: ${subject}
Details: ${body}
${imageInstruction}${rsvpInstruction}

Guidelines:
1. Include the cover image at the top if provided.
2. Use professional buttons for CTAs.
3. Do not repeat footer details.
4. Output ONLY a JSON object with "subject" and "body".`;
        }

        if (!finalPrompt.trim()) return;

        setIsGenerating(true);
        try {
            const res = await fetch("/api/newsletter/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: finalPrompt }),
            });
            const data = await res.json();
            if (res.ok) {
                setSubject(data.subject || "");
                setBody(data.body || "");
                setAiPrompt("");
            } else {
                alert("AI Refinement failed: " + (data.error || "Unknown error"));
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
                    <div className="flex flex-wrap items-center gap-4 mt-6">
                        {subCount !== null && (
                            <div className="inline-flex items-center gap-3 bg-brand-gold/10 border-2 border-brand-gold/30 rounded-2xl px-6 py-3 shadow-sm">
                                <span className="text-brand-gold font-black text-2xl">{subCount}</span>
                                <span className="text-brand-blue font-bold uppercase tracking-widest text-xs">Active Subscriber{subCount !== 1 ? "s" : ""}</span>
                            </div>
                        )}
                        <button
                            onClick={handlePurge}
                            className="px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 border-2 border-red-200 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
                        >
                            🗑 Purge List
                        </button>
                    </div>
                </div>
                <button
                    onClick={handleSync}
                    disabled={status === "loading"}
                    className="group relative flex items-center gap-4 px-8 py-5 bg-slate-900 hover:bg-brand-blue text-white rounded-2xl transition-all shadow-xl hover:-translate-y-1 hover:shadow-blue-500/25 disabled:opacity-50 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-white/5 to-blue-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <div className="text-left">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 group-hover:text-white/80 transition-colors">Sync Members</p>
                        <p className="text-sm font-black whitespace-nowrap mt-0.5">Subscribe Web Users</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-white/10 group-hover:bg-white/20 flex items-center justify-center transition-all group-hover:rotate-12">
                        <svg className="w-5 h-5 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
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
                        {isGenerating ? "✨ Processing..." : (subject.trim() || body.trim()) ? "✨ Refine with AI" : "✨ Generate Draft"}
                    </button>
                </div>

                <div className="flex justify-end mb-6">
                    <button
                        type="button"
                        onClick={() => setShowPreview(true)}
                        disabled={!subject.trim() && !body.trim()}
                        className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all flex items-center gap-2 border border-slate-200"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        Preview Draft
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
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <h2 className="text-2xl font-heading font-black text-brand-blue">Manage Subscribers</h2>

                    <div className="relative flex-1 max-w-sm">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor font-bold"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search subscribers by email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-gold/50 focus:bg-white transition-all font-medium"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Active List */}
                    <div className="p-6 bg-slate-50 border-2 border-slate-100 rounded-2xl flex flex-col lg:col-span-1">
                        <label className="block text-xs font-black text-green-600 uppercase tracking-[0.2em] mb-3 ml-1">Active Subscribers ({filteredSubscribers.length})</label>
                        <div className="flex-1 bg-white border-2 border-slate-200 rounded-xl overflow-y-auto max-h-48 p-2">
                            {filteredSubscribers.length === 0 ? (
                                <div className="h-full flex items-center justify-center p-4 text-xs font-medium text-slate-400 text-center">
                                    {searchTerm ? "No subscribers match your search." : "No active subscribers."}
                                </div>
                            ) : (
                                <ul className="divide-y divide-slate-100">
                                    {filteredSubscribers.map((u, i) => (
                                        <li key={i} className="p-3 text-sm flex flex-col gap-2">
                                            <span className="font-medium text-slate-700 break-all">{u.email}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleUnsubscribe(u.email, u.token)}
                                                className="w-full px-4 py-2 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white font-black rounded-xl text-[10px] uppercase tracking-widest transition-all border border-red-100 hover:border-red-500 hover:shadow-lg hover:shadow-red-500/20"
                                            >
                                                Unsubscribe Member
                                            </button>
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
                        <label className="block text-xs font-black text-brand-cranberry uppercase tracking-[0.2em] mb-3 ml-1">Unsubscribed Users ({filteredUnsubscribed.length})</label>
                        <div className="flex-1 bg-white border-2 border-slate-200 rounded-xl overflow-y-auto max-h-48 p-2">
                            {filteredUnsubscribed.length === 0 ? (
                                <div className="h-full flex items-center justify-center p-4 text-xs font-medium text-slate-400 text-center">
                                    {searchTerm ? "No users match your search." : "No unsubscribed users."}
                                </div>
                            ) : (
                                <ul className="divide-y divide-slate-100">
                                    {filteredUnsubscribed.map((u, i) => (
                                        <li key={i} className="flex flex-col gap-2 items-start justify-between p-3 text-sm">
                                            <span className="font-medium text-slate-700 break-all">{u.email}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleResync(u.email)}
                                                className="w-full px-4 py-2 bg-blue-50 hover:bg-brand-blue text-brand-blue hover:text-white font-black rounded-xl text-[10px] uppercase tracking-widest transition-all border border-blue-100 hover:border-brand-blue hover:shadow-lg hover:shadow-blue-500/20"
                                            >
                                                ✨ Force Resync
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

            {/* Email Preview Modal */}
            {showPreview && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
                    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setShowPreview(false)} />
                    <div className="relative w-full max-w-2xl max-h-full bg-white rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div>
                                <h3 className="text-lg font-black text-brand-blue uppercase tracking-wider">Email Preview</h3>
                                <p className="text-xs text-brand-gray font-medium">Checking: {subject || "No Subject"}</p>
                            </div>
                            <button
                                onClick={() => setShowPreview(false)}
                                className="w-12 h-12 rounded-2xl bg-white shadow-lg border border-slate-100 flex items-center justify-center text-slate-600 hover:text-red-500 hover:bg-red-50 transition-all active:scale-95 group"
                            >
                                <svg className="w-6 h-6 transform transition-transform group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-200/30">
                            {/* The Email Content Shell */}
                            <div className="max-w-[600px] mx-auto bg-[#0a0f1e] rounded-2xl overflow-hidden shadow-xl border border-white/5">
                                {/* Header */}
                                <div className="bg-gradient-to-br from-[#0a0f1e] to-[#1a2744] p-8 border-b-2 border-[#C9982A]">
                                    <div className="mb-5 bg-white inline-block p-2 rounded-lg leading-none">
                                        <img src="https://rcsb-website.pages.dev/logo.png" alt="RCSB Logo" className="h-10 w-auto" />
                                    </div>
                                    <p className="m-0 text-[#C9982A] text-[10px] uppercase font-bold tracking-[0.2em]">Rotaract Club of Swarna Bengaluru</p>
                                    <h1 className="mt-2 text-white text-2xl font-black tracking-tight leading-tight">{subject || "No Subject"}</h1>
                                </div>

                                {/* Body */}
                                <div className="p-8 text-[#c8d0e0] text-sm leading-[1.7]">
                                    <div className="email-content-preview prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: body || "<p className='opacity-40 italic'>You haven't added any content yet.</p>" }} />

                                    <div className="mt-8 pt-4">
                                        <div className="inline-block bg-[#C9982A] text-[#0a0f1e] font-bold px-7 py-3 rounded-lg text-sm">
                                            Visit the Website →
                                        </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="bg-[#090e1a] p-10 border-t border-white/5 text-center">
                                    <div className="flex justify-center gap-4 mb-7 opacity-70">
                                        {[
                                            { icon: "instagram-new", label: "IG" },
                                            { icon: "facebook-new", label: "FB" },
                                            { icon: "linkedin", label: "LI" },
                                            { icon: "twitterx", label: "X" },
                                            { icon: "youtube-play", label: "YT" }
                                        ].map(app => (
                                            <div key={app.label} className="w-6 h-6 flex items-center justify-center">
                                                <img src={`https://img.icons8.com/ios-filled/50/C9982A/${app.icon}.png`} alt={app.label} className="w-5 h-5" />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mb-6 text-[#c8d0e0] text-[11px] leading-relaxed opacity-80">
                                        <p className="m-0 font-bold text-white">Rotaract Club of Swarna Bengaluru</p>
                                        <p className="mt-1">Rotary House of Friendship, 11 Lavelle Road, Bengaluru</p>
                                        <p className="mt-0.5 text-[#C9982A]">rota.rcbs@gmail.com | Visit Website</p>
                                    </div>

                                    <p className="m-0 text-[#556677] text-[9px] font-bold uppercase tracking-widest">
                                        © 2026 Rotaract Club of Swarna Bengaluru
                                    </p>
                                    <p className="mt-4 text-[#556677] text-[10px]">
                                        You're receiving this because you're a member of the RCSB community.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                            <button
                                onClick={() => setShowPreview(false)}
                                className="px-8 py-3 bg-brand-blue text-white font-black rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20"
                            >
                                Close Preview
                            </button>
                        </div>
                    </div>
                </div>
            )}
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
