"use client";
export const runtime = 'edge';


import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { isAdmin } from "@/lib/admin";
import { EnvelopeIcon, ClockIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

export default function AdminMessagesPage() {
  const router = useRouter();
  const { isLoaded, user } = useUser();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Role Protection
  useEffect(() => {
    if (isLoaded && user) {
      const email = user.primaryEmailAddress?.emailAddress;
      if (!isAdmin(email, user?.publicMetadata?.role)) {
        router.push("/admin");
      }
    }
  }, [isLoaded, user, router]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch("/api/admin/messages");
        if (!res.ok) throw new Error("Failed to fetch messages");
        const data = await res.json();
        setMessages(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyBrief, setReplyBrief] = useState("");
  const [replySubject, setReplySubject] = useState("");
  const [replyBody, setReplyBody] = useState("");
  const [replyStatus, setReplyStatus] = useState<"idle" | "generating">("idle");
  const [showPreview, setShowPreview] = useState(false);

  const toggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'unread' ? 'read' : 'unread';
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      setMessages(messages.map((m: any) => m.id === id ? { ...m, status: newStatus } : m));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleGenerateReply = async (msg: any) => {
    if (!replyBrief.trim()) {
        alert("Please provide a brief of what you want to say.");
        return;
    }
    setReplyStatus("generating");
    try {
        const res = await fetch("/api/admin/messages/reply", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                originalMessage: msg.message,
                senderName: msg.name,
                brief: replyBrief
            })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to generate reply");
        
        setReplySubject(data.subject);
        setReplyBody(data.body);
    } catch (err: any) {
        alert(`Error: ${err.message}`);
    } finally {
        setReplyStatus("idle");
    }
  };

  return (
    <div className="py-6">
      <div className="mb-8">
        <h2 className="text-3xl font-heading font-bold text-brand-blue">Contact Inquiries</h2>
        <p className="text-brand-gray mt-1">Review and manage messages sent via the public contact form.</p>
      </div>

      {loading ? (
        <div className="text-center py-20 font-bold text-brand-blue">Loading messages...</div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border-l-4 border-red-500 font-semibold">{error}</div>
      ) : (
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-3xl border border-gray-100 text-gray-400 font-bold">
              No inquiries received yet.
            </div>
          ) : (
            messages.map((msg: any) => (
              <div
                key={msg.id}
                className={`bg-white p-6 rounded-3xl border transition-all ${msg.status === 'unread' ? 'border-brand-gold shadow-md' : 'border-gray-100 opacity-75'
                  }`}
              >
                  <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${msg.status === 'unread' ? 'bg-brand-gold/10 text-brand-gold' : 'bg-gray-100 text-gray-400'}`}>
                      <EnvelopeIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-brand-blue text-lg">{msg.name}</h3>
                      <div className="flex flex-col sm:flex-row gap-x-4 gap-y-1 text-sm font-semibold text-brand-gray mt-1">
                          <span className="flex items-center gap-1">✉️ {msg.email}</span>
                          {msg.phone && <span className="flex items-center gap-1">📞 {msg.phone}</span>}
                          {msg.reason && (
                              <span className="flex items-center gap-1">
                                  🏷️ <span className="px-2 py-0.5 bg-brand-gold/10 text-brand-gold rounded-full text-xs">{msg.reason}</span>
                              </span>
                          )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-wrap justify-end mt-2 sm:mt-0">
                    <div className="flex items-center gap-1 text-xs font-bold text-gray-400 uppercase tracking-widest">
                      <ClockIcon className="w-3.5 h-3.5" />
                      {new Date(msg.created_at).toLocaleDateString()}
                    </div>
                    <button
                        onClick={async () => {
                            if (replyingTo === msg.id) {
                                setReplyingTo(null);
                            } else {
                                setReplyingTo(msg.id);
                                setReplyBrief("");
                                setReplySubject("");
                                setReplyBody("");
                                // Automatically generate a polite default draft
                                setReplyStatus("generating");
                                try {
                                    const res = await fetch("/api/admin/messages/reply", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({
                                            originalMessage: msg.message,
                                            senderName: msg.name,
                                            brief: "Acknowledge their message, thank them warmly for reaching out, and let them know we have received it and will be in touch soon if needed."
                                        })
                                    });
                                    const data = await res.json();
                                    if (res.ok) {
                                        setReplySubject(data.subject);
                                        setReplyBody(data.body);
                                    }
                                } catch (err) {
                                    console.error("Auto-generate failed", err);
                                } finally {
                                    setReplyStatus("idle");
                                }
                            }
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100"
                    >
                        {replyStatus === "generating" && replyingTo === msg.id ? "Drafting..." : "Reply via AI"}
                    </button>
                    <button
                      onClick={() => toggleStatus(msg.id, msg.status)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${msg.status === 'unread'
                          ? 'bg-brand-blue text-white hover:bg-black'
                          : 'bg-green-50 text-green-600 border border-green-100'
                        }`}
                    >
                      {msg.status === 'unread' ? (
                        <>Mark as Read</>
                      ) : (
                        <> <CheckCircleIcon className="w-4 h-4" /> Message Read</>
                      )}
                    </button>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl text-brand-gray leading-relaxed text-sm">
                  {msg.message}
                </div>

                {replyingTo === msg.id && (
                    <div className="mt-6 border-t border-gray-100 pt-6">
                        <h4 className="text-sm font-bold text-brand-blue mb-3 uppercase tracking-widest">AI Reply Generator</h4>
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <textarea
                                    value={replyBrief}
                                    onChange={(e) => setReplyBrief(e.target.value)}
                                    placeholder="Need to add specific details? Type a short instruction here (e.g. 'Tell them the event starts at 5 PM')."
                                    rows={2}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold"
                                />
                                <button
                                    onClick={() => handleGenerateReply(msg)}
                                    disabled={replyStatus === "generating" || !replyBrief.trim()}
                                    className="bg-brand-gold text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all hover:bg-yellow-500 disabled:opacity-50 min-w-[140px]"
                                >
                                    {replyStatus === "generating" ? "Drafting..." : (replyBody ? "Regenerate" : "Generate")}
                                </button>
                            </div>

                            {replyStatus === "generating" && !replyBody && (
                                <div className="p-8 text-center text-brand-blue/50 text-sm font-bold animate-pulse">
                                    ✨ AI is drafting a response...
                                </div>
                            )}

                            {replyBody && (
                                <div className="space-y-3 bg-brand-gold/5 p-4 rounded-xl border border-brand-gold/20">
                                    <input 
                                        type="text" 
                                        value={replySubject}
                                        onChange={(e) => setReplySubject(e.target.value)}
                                        className="w-full bg-white border border-brand-gold/30 rounded-lg px-3 py-2 text-sm font-semibold focus:outline-none text-brand-blue"
                                        placeholder="Subject"
                                    />
                                    <textarea
                                        value={replyBody}
                                        onChange={(e) => setReplyBody(e.target.value)}
                                        rows={8}
                                        className="w-full bg-white border border-brand-gold/30 rounded-lg px-3 py-2 text-sm focus:outline-none text-brand-gray"
                                    />
                                    <div className="flex gap-3 flex-wrap">
                                        <button
                                            onClick={async () => {
                                                setReplyStatus("generating");
                                                try {
                                                    const res = await fetch("/api/newsletter/send", {
                                                        method: "POST",
                                                        headers: { "Content-Type": "application/json" },
                                                        body: JSON.stringify({
                                                            subject: replySubject,
                                                            body: replyBody.replace(/\n/g, "<br/>"),
                                                            targetEmails: [msg.email]
                                                        })
                                                    });
                                                    const data = await res.json();
                                                    if (!res.ok) throw new Error(data.error || "Failed to send");
                                                    alert("Reply sent successfully via RCSB email!");
                                                    setReplyingTo(null);
                                                    setReplyBody("");
                                                } catch (err: any) {
                                                    alert(`Send failed: ${err.message}`);
                                                } finally {
                                                    setReplyStatus("idle");
                                                }
                                            }}
                                            disabled={replyStatus === "generating"}
                                            className="bg-brand-blue text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all hover:bg-black inline-block disabled:opacity-50 flex items-center justify-center min-w-[120px]"
                                        >
                                            {replyStatus === "generating" ? "Sending..." : "Send Reply"}
                                        </button>
                                        <button
                                            onClick={() => setShowPreview(true)}
                                            className="bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold px-6 py-2.5 rounded-xl text-sm transition-all hover:bg-indigo-100 flex items-center gap-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                            Preview
                                        </button>
                                        <button
                                            onClick={() => {
                                                setReplySubject("");
                                                setReplyBody("");
                                            }}
                                            disabled={replyStatus === "generating"}
                                            className="bg-white border border-slate-200 text-slate-500 font-bold px-6 py-2.5 rounded-xl text-sm transition-all hover:bg-slate-50 disabled:opacity-50"
                                        >
                                            Discard
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Email Preview Modal */}
      {showPreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <div className="w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                  <div className="flex-1 overflow-y-auto bg-[#e5e7eb] p-4 md:p-8">
                      <div className="max-w-[600px] mx-auto bg-[#0a0f1e] rounded-2xl overflow-hidden shadow-2xl border border-white/10 font-sans">
                          {/* Header */}
                          <div className="bg-[#12182b] p-8 border-b border-white/5">
                              <div className="mb-5 bg-white inline-block p-2 rounded-lg leading-none">
                                  <img src="https://rcsb-website.pages.dev/logo.png" alt="RCSB Logo" className="h-10 w-auto" />
                              </div>
                              <p className="m-0 text-[#C9982A] text-[10px] uppercase font-bold tracking-[0.2em]">Rotaract Club of Swarna Bengaluru</p>
                              <h1 className="mt-2 text-white text-2xl font-black tracking-tight leading-tight">{replySubject || "No Subject"}</h1>
                          </div>

                          {/* Body */}
                          <div className="p-8 text-[#c8d0e0] text-sm leading-[1.7]">
                              <div className="email-content-preview prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: replyBody ? replyBody.replace(/\n/g, "<br/>") : "<p className='opacity-40 italic'>You haven't added any content yet.</p>" }} />
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
                          </div>
                      </div>
                  </div>

                  <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                      <button
                          onClick={() => setShowPreview(false)}
                          className="px-6 py-2.5 border border-slate-300 text-slate-600 font-bold rounded-xl text-sm transition-all hover:bg-white"
                      >
                          Edit Email
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}
