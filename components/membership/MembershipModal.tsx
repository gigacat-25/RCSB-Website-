"use client";

import { useState } from "react";
import { XMarkIcon, CheckCircleIcon, UserIcon, EnvelopeIcon, PhoneIcon, AcademicCapIcon, ChatBubbleLeftEllipsisIcon, CalendarIcon } from "@heroicons/react/24/outline";

interface MembershipModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MembershipModal({ isOpen, onClose }: MembershipModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        age: "",
        occupation: "Student",
        institution: "",
        reason: "",
    });

    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const formattedMessage = `
--- MEMBERSHIP APPLICATION ---
Age: ${formData.age}
Occupation: ${formData.occupation}
Institution/Company: ${formData.institution || "N/A"}
Phone/WhatsApp: ${formData.phone}
Email: ${formData.email}

Why I want to join RCSB:
${formData.reason || "Interested in community service and networking."}
            `.trim();

            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    subject: `🏆 Membership Inquiry - ${formData.name}`,
                    message: formattedMessage,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to submit membership application.");
            }

            setSuccess(true);
        } catch (err: any) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleReset = () => {
        setSuccess(false);
        setError(null);
        setFormData({
            name: "",
            email: "",
            phone: "",
            age: "",
            occupation: "Student",
            institution: "",
            reason: "",
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
            <div className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden my-8">
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-brand-blue via-blue-900 to-slate-900 p-8 text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-colors"
                        aria-label="Close"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                    <span className="text-[10px] font-black text-brand-gold uppercase tracking-[0.3em] block mb-2">
                        Join Rotaract Swarna Bengaluru
                    </span>
                    <h3 className="text-2xl md:text-3xl font-heading font-black text-white">
                        Membership <span className="text-brand-gold italic">Application</span>
                    </h3>
                    <p className="text-xs text-blue-100/80 mt-2">
                        Connect with young leaders (ages 18–30) and make a difference.
                    </p>
                </div>

                <div className="p-6 md:p-8">
                    {success ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                                <CheckCircleIcon className="w-10 h-10" />
                            </div>
                            <h4 className="text-2xl font-bold text-brand-blue mb-2">Application Received!</h4>
                            <p className="text-sm text-brand-gray/80 max-w-md mx-auto mb-6">
                                Thank you, <span className="font-semibold text-brand-blue">{formData.name}</span>! Our membership team will review your application and contact you on WhatsApp/Email shortly.
                            </p>
                            <button
                                onClick={handleReset}
                                className="px-8 py-3 bg-brand-gold text-brand-blue font-bold rounded-2xl hover:bg-yellow-500 transition-colors shadow-md text-sm"
                            >
                                Done
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="p-4 rounded-xl bg-red-50 text-red-600 text-xs font-semibold">
                                    {error}
                                </div>
                            )}

                            {/* Full Name */}
                            <div>
                                <label className="block text-xs font-bold text-brand-blue uppercase tracking-wider mb-1.5">
                                    Full Name *
                                </label>
                                <div className="relative">
                                    <UserIcon className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Rahul Sharma"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-brand-azure focus:bg-white outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Email & Phone grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Email */}
                                <div>
                                    <label className="block text-xs font-bold text-brand-blue uppercase tracking-wider mb-1.5">
                                        Gmail / Email Address *
                                    </label>
                                    <div className="relative">
                                        <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="email"
                                            required
                                            placeholder="you@gmail.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-brand-azure focus:bg-white outline-none transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-xs font-bold text-brand-blue uppercase tracking-wider mb-1.5">
                                        Phone / WhatsApp *
                                    </label>
                                    <div className="relative">
                                        <PhoneIcon className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="tel"
                                            required
                                            placeholder="+91 98765 43210"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-brand-azure focus:bg-white outline-none transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Age & Occupation grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Age */}
                                <div>
                                    <label className="block text-xs font-bold text-brand-blue uppercase tracking-wider mb-1.5">
                                        Age (18–30) *
                                    </label>
                                    <div className="relative">
                                        <CalendarIcon className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="number"
                                            required
                                            min={18}
                                            max={30}
                                            placeholder="e.g. 21"
                                            value={formData.age}
                                            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-brand-azure focus:bg-white outline-none transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* Occupation */}
                                <div>
                                    <label className="block text-xs font-bold text-brand-blue uppercase tracking-wider mb-1.5">
                                        Occupation *
                                    </label>
                                    <select
                                        value={formData.occupation}
                                        onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-brand-azure focus:bg-white outline-none transition-colors text-brand-blue font-medium"
                                    >
                                        <option value="Student">Student</option>
                                        <option value="Working Professional">Working Professional</option>
                                        <option value="Entrepreneur">Entrepreneur / Self-Employed</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            {/* College / Organization */}
                            <div>
                                <label className="block text-xs font-bold text-brand-blue uppercase tracking-wider mb-1.5">
                                    College / Company Name
                                </label>
                                <div className="relative">
                                    <AcademicCapIcon className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        placeholder="e.g. BMS College of Engineering"
                                        value={formData.institution}
                                        onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-brand-azure focus:bg-white outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Why Join */}
                            <div>
                                <label className="block text-xs font-bold text-brand-blue uppercase tracking-wider mb-1.5">
                                    Why do you want to join RCSB?
                                </label>
                                <div className="relative">
                                    <ChatBubbleLeftEllipsisIcon className="w-5 h-5 text-gray-400 absolute left-3.5 top-3" />
                                    <textarea
                                        rows={3}
                                        placeholder="Tell us briefly about your interests or goals..."
                                        value={formData.reason}
                                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-brand-azure focus:bg-white outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-4 mt-2 bg-gradient-to-r from-brand-gold via-yellow-400 to-amber-500 text-brand-blue font-black uppercase tracking-[0.2em] text-xs rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl disabled:opacity-50"
                            >
                                {submitting ? "Submitting Application..." : "Submit Application →"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
