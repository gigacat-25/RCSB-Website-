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
  const [activeTab, setActiveTab] = useState<"all" | "membership" | "general">("all");

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

  const parseMembershipDetails = (msg: any) => {
    const text = msg.message || "";
    const isMembership =
      msg.reason?.toLowerCase().includes("membership") ||
      msg.subject?.toLowerCase().includes("membership") ||
      text.includes("MEMBERSHIP APPLICATION");

    if (!isMembership) return null;

    const ageMatch = text.match(/Age:\s*([^\n]*)/i);
    const occupationMatch = text.match(/Occupation:\s*([^\n]*)/i);
    const institutionMatch = text.match(/Institution\/Company:\s*([^\n]*)/i);
    const phoneMatch = text.match(/Phone\/WhatsApp:\s*([^\n]*)/i);
    const emailMatch = text.match(/Email:\s*([^\n]*)/i);
    const reasonMatch = text.match(/Why I want to join RCSB:\s*\n?([\s\S]*)/i);

    return {
      isMembership: true,
      age: ageMatch ? ageMatch[1].trim() : null,
      occupation: occupationMatch ? occupationMatch[1].trim() : null,
      institution: institutionMatch ? institutionMatch[1].trim() : null,
      phone: phoneMatch ? phoneMatch[1].trim() : (msg.phone || null),
      email: emailMatch ? emailMatch[1].trim() : (msg.email || null),
      reasonToJoin: reasonMatch ? reasonMatch[1].trim() : text,
    };
  };

  const membershipMessages = messages.filter((m) => {
    const text = m.message || "";
    return (
      m.reason?.toLowerCase().includes("membership") ||
      m.subject?.toLowerCase().includes("membership") ||
      text.includes("MEMBERSHIP APPLICATION")
    );
  });

  const generalMessages = messages.filter((m) => {
    const text = m.message || "";
    return !(
      m.reason?.toLowerCase().includes("membership") ||
      m.subject?.toLowerCase().includes("membership") ||
      text.includes("MEMBERSHIP APPLICATION")
    );
  });

  const filteredMessages =
    activeTab === "membership"
      ? membershipMessages
      : activeTab === "general"
      ? generalMessages
      : messages;

  return (
    <div className="py-4 md:py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-brand-blue">Inquiries & Applications</h2>
          <p className="text-xs md:text-sm text-brand-gray mt-1">Review contact inquiries and membership applications.</p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl shrink-0 overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === "all"
                ? "bg-white text-brand-blue shadow-sm"
                : "text-slate-500 hover:text-brand-blue"
            }`}
          >
            All ({messages.length})
          </button>
          <button
            onClick={() => setActiveTab("membership")}
            className={`px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "membership"
                ? "bg-amber-500 text-slate-950 shadow-sm"
                : "text-amber-700 hover:bg-amber-50"
            }`}
          >
            <span>🏆 Membership</span>
            <span className="px-1.5 py-0.5 bg-slate-950/10 rounded-full text-[10px]">
              {membershipMessages.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("general")}
            className={`px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === "general"
                ? "bg-white text-brand-blue shadow-sm"
                : "text-slate-500 hover:text-brand-blue"
            }`}
          >
            General ({generalMessages.length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 font-bold text-brand-blue">Loading inquiries...</div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border-l-4 border-red-500 font-semibold">{error}</div>
      ) : (
        <div className="space-y-4 md:space-y-6">
          {filteredMessages.length === 0 ? (
            <div className="bg-white p-8 md:p-12 text-center rounded-3xl border border-gray-100 text-gray-400 font-bold text-sm">
              {activeTab === "membership"
                ? "No membership applications received yet."
                : "No inquiries found."}
            </div>
          ) : (
            filteredMessages.map((msg: any) => {
              const memDetails = parseMembershipDetails(msg);
              const isMembership = !!memDetails;
              const cleanPhone = (memDetails?.phone || msg.phone || "").replace(/[^\d+]/g, "");

              return (
                <div
                  key={msg.id}
                  className={`bg-white p-4 md:p-8 rounded-2xl md:rounded-3xl border transition-all ${
                    isMembership
                      ? "border-amber-400/60 shadow-lg shadow-amber-500/5 ring-2 ring-amber-400/20"
                      : msg.status === 'unread'
                      ? 'border-brand-gold shadow-md'
                      : 'border-gray-100 opacity-90'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4 md:mb-6">
                    <div className="flex items-start gap-3 md:gap-4">
                      <div className={`p-2.5 md:p-3 rounded-2xl shrink-0 ${
                        isMembership
                          ? 'bg-amber-500 text-slate-950'
                          : msg.status === 'unread'
                          ? 'bg-brand-gold/10 text-brand-gold'
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        {isMembership ? (
                          <span className="text-base md:text-lg">🏆</span>
                        ) : (
                          <EnvelopeIcon className="w-5 h-5" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-brand-blue text-base md:text-xl truncate">{msg.name}</h3>
                          {isMembership && (
                            <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-[10px] font-black uppercase tracking-wider">
                              Membership Application
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs md:text-sm font-semibold text-brand-gray mt-1">
                          <span className="truncate">✉️ {msg.email}</span>
                          {(msg.phone || memDetails?.phone) && (
                            <span>📞 {msg.phone || memDetails?.phone}</span>
                          )}
                          {!isMembership && msg.reason && (
                            <span className="px-2 py-0.5 bg-brand-gold/10 text-brand-gold rounded-full text-[11px]">
                              {msg.reason}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-3 flex-wrap justify-start sm:justify-end w-full sm:w-auto">
                      <div className="flex items-center gap-1 text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mr-auto sm:mr-0">
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
                            setReplyStatus("generating");
                            try {
                              const res = await fetch("/api/admin/messages/reply", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  originalMessage: msg.message,
                                  senderName: msg.name,
                                  brief: isMembership
                                    ? "Thank them warmly for applying to join RCSB Rotaract Club, invite them to our upcoming meeting/orientation, and share next steps."
                                    : "Acknowledge their message and thank them warmly for reaching out."
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
                        className="px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs font-bold transition-all bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100"
                      >
                        {replyStatus === "generating" && replyingTo === msg.id ? "Drafting..." : "Reply via AI"}
                      </button>
                      <button
                        onClick={() => toggleStatus(msg.id, msg.status)}
                        className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs font-bold transition-all ${
                          msg.status === 'unread'
                            ? 'bg-brand-blue text-white hover:bg-black'
                            : 'bg-green-50 text-green-600 border border-green-100'
                        }`}
                      >
                        {msg.status === 'unread' ? "Mark Read" : "Read"}
                      </button>
                    </div>
                  </div>

                  {/* Body Content / Structured Membership View */}
                  {isMembership ? (
                    <div className="space-y-3 md:space-y-4 pt-2 border-t border-gray-100">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-amber-500/10 border border-amber-500/20 p-3 md:p-4 rounded-2xl">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-1 bg-amber-500 text-slate-950 font-black text-[10px] md:text-xs uppercase tracking-wider rounded-full shadow-sm">
                            🏆 Applicant
                          </span>
                          {memDetails.age && (
                            <span className="px-2.5 py-1 bg-brand-blue/10 text-brand-blue font-bold text-xs rounded-full">
                              Age: {memDetails.age}
                            </span>
                          )}
                          {memDetails.occupation && (
                            <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-full border border-indigo-100">
                              {memDetails.occupation}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          {cleanPhone && (
                            <a
                              href={`https://wa.me/${cleanPhone.replace(/[^\d]/g, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 md:px-4 md:py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm"
                            >
                              📱 Chat WhatsApp
                            </a>
                          )}
                          <a
                            href={`mailto:${msg.email}`}
                            className="px-3 py-1.5 md:px-4 md:py-2 bg-brand-blue hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition-all shadow-sm"
                          >
                            ✉️ Email Applicant
                          </a>
                        </div>
                      </div>

                      {/* Key Applicant Info Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-3 bg-slate-50 p-3 md:p-4 rounded-2xl border border-slate-100 text-xs">
                        <div>
                          <span className="font-bold text-slate-400 uppercase tracking-widest block text-[10px] mb-0.5">Applicant Name</span>
                          <span className="font-black text-brand-blue text-xs md:text-sm">{msg.name}</span>
                        </div>
                        <div>
                          <span className="font-bold text-slate-400 uppercase tracking-widest block text-[10px] mb-0.5">Institution / Company</span>
                          <span className="font-bold text-slate-700 text-xs">{memDetails.institution || "N/A"}</span>
                        </div>
                        <div>
                          <span className="font-bold text-slate-400 uppercase tracking-widest block text-[10px] mb-0.5">Contact Details</span>
                          <span className="font-bold text-slate-700 text-xs">{msg.phone || memDetails.phone || msg.email}</span>
                        </div>
                      </div>

                      {/* Statement of Interest */}
                      <div className="bg-amber-500/5 p-3 md:p-4 rounded-2xl border-l-4 border-amber-500 text-slate-700 text-xs md:text-sm leading-relaxed">
                        <span className="text-[10px] font-black uppercase tracking-widest text-amber-700 block mb-1">
                          Why they want to join RCSB:
                        </span>
                        {memDetails.reasonToJoin}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-3 md:p-4 rounded-xl text-brand-gray leading-relaxed text-xs md:text-sm">
                      {msg.message}
                    </div>
                  )}

                  {replyingTo === msg.id && (
                    <div className="mt-4 md:mt-6 border-t border-gray-100 pt-4 md:pt-6">
                      <h4 className="text-xs md:text-sm font-bold text-brand-blue mb-3 uppercase tracking-widest">AI Reply Generator</h4>
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-3">
                          <textarea
                            value={replyBrief}
                            onChange={(e) => setReplyBrief(e.target.value)}
                            placeholder="Need specific details? Type a short instruction..."
                            rows={2}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs md:text-sm focus:outline-none focus:border-brand-gold"
                          />
                          <button
                            onClick={() => handleGenerateReply(msg)}
                            disabled={replyStatus === "generating" || !replyBrief.trim()}
                            className="bg-brand-gold text-white font-bold px-6 py-2.5 rounded-xl text-xs md:text-sm transition-all hover:bg-yellow-500 disabled:opacity-50 min-w-[120px]"
                          >
                            {replyStatus === "generating" ? "Drafting..." : (replyBody ? "Regenerate" : "Generate")}
                          </button>
                        </div>

                        {replyStatus === "generating" && !replyBody && (
                          <div className="p-4 text-center text-brand-blue/50 text-xs font-bold animate-pulse">
                            ✨ AI is drafting a response...
                          </div>
                        )}

                        {replyBody && (
                          <div className="space-y-3 bg-brand-gold/5 p-4 rounded-xl border border-brand-gold/20">
                            <input 
                              type="text" 
                              value={replySubject}
                              onChange={(e) => setReplySubject(e.target.value)}
                              className="w-full bg-white border border-brand-gold/30 rounded-lg px-3 py-2 text-xs md:text-sm font-semibold focus:outline-none text-brand-blue"
                              placeholder="Subject"
                            />
                            <textarea
                              value={replyBody}
                              onChange={(e) => setReplyBody(e.target.value)}
                              rows={6}
                              className="w-full bg-white border border-brand-gold/30 rounded-lg px-3 py-2 text-xs md:text-sm focus:outline-none text-brand-gray"
                            />
                            <div className="flex gap-2 flex-wrap">
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
                                className="bg-brand-blue text-white font-bold px-5 py-2 rounded-xl text-xs transition-all hover:bg-black disabled:opacity-50"
                              >
                                {replyStatus === "generating" ? "Sending..." : "Send Reply"}
                              </button>
                              <button
                                onClick={() => setShowPreview(true)}
                                className="bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold px-4 py-2 rounded-xl text-xs transition-all hover:bg-indigo-100 flex items-center gap-1.5"
                              >
                                Preview
                              </button>
                              <button
                                onClick={() => {
                                  setReplySubject("");
                                  setReplyBody("");
                                }}
                                disabled={replyStatus === "generating"}
                                className="bg-white border border-slate-200 text-slate-500 font-bold px-4 py-2 rounded-xl text-xs transition-all hover:bg-slate-50"
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
              );
            })
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
                <div className="bg-[#12182b] p-6 md:p-8 border-b border-white/5">
                  <div className="mb-4 bg-white inline-block p-2 rounded-lg leading-none">
                    <img src="https://rotaractswarnabengaluru.in/logo.png" alt="RCSB Logo" className="h-8 md:h-10 w-auto" />
                  </div>
                  <p className="m-0 text-[#C9982A] text-[10px] uppercase font-bold tracking-[0.2em]">Rotaract Club of Swarna Bengaluru</p>
                  <h1 className="mt-2 text-white text-xl md:text-2xl font-black tracking-tight leading-tight">{replySubject || "No Subject"}</h1>
                </div>

                {/* Body */}
                <div className="p-6 md:p-8 text-[#c8d0e0] text-xs md:text-sm leading-[1.7]">
                  <div className="email-content-preview prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: replyBody ? replyBody.replace(/\n/g, "<br/>") : "<p className='opacity-40 italic'>You haven't added any content yet.</p>" }} />
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setShowPreview(false)}
                className="px-5 py-2 border border-slate-300 text-slate-600 font-bold rounded-xl text-xs transition-all hover:bg-white"
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
