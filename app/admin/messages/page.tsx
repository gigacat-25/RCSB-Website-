"use client";

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
      if (!isAdmin(email)) {
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
                className={`bg-white p-6 rounded-3xl border transition-all ${
                  msg.status === 'unread' ? 'border-brand-gold shadow-md' : 'border-gray-100 opacity-75'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${msg.status === 'unread' ? 'bg-brand-gold/10 text-brand-gold' : 'bg-gray-100 text-gray-400'}`}>
                      <EnvelopeIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-brand-blue text-lg">{msg.name}</h3>
                      <p className="text-sm font-semibold text-brand-gray">{msg.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-xs font-bold text-gray-400 uppercase tracking-widest">
                      <ClockIcon className="w-3.5 h-3.5" />
                      {new Date(msg.created_at).toLocaleDateString()}
                    </div>
                    <button 
                      onClick={() => toggleStatus(msg.id, msg.status)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                        msg.status === 'unread' 
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
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
