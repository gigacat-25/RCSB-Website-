"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { isSuperAdmin } from "@/lib/admin";
import { ShieldCheckIcon, TrashIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function AccessControlPage() {
    const { user, isLoaded } = useUser();
    const [admins, setAdmins] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({ email: "", name: "", role: "editor" });
    const [adding, setAdding] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

    const email = user?.primaryEmailAddress?.emailAddress;
    const superAdmin = isSuperAdmin(email);

    const fetchAdmins = async () => {
        try {
            const res = await fetch("/api/admin/access");
            if (!res.ok) throw new Error("Failed to fetch access list");
            const data = await res.json();
            setAdmins(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isLoaded && superAdmin) {
            fetchAdmins();
        }
    }, [isLoaded, superAdmin]);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setAdding(true);
        setError(null);
        try {
            const res = await fetch("/api/admin/access", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to grant access");

            setFormData({ email: "", name: "", role: "editor" });
            await fetchAdmins();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setAdding(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const res = await fetch(`/api/admin/access/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to revoke access");
            setAdmins(admins.filter((a) => a.id !== id));
            setConfirmDeleteId(null);
        } catch (err: any) {
            setError(err.message);
        }
    };

    if (!isLoaded) return <div className="py-20 text-center text-gray-500 font-bold animate-pulse">Loading Identity...</div>;
    if (!superAdmin) return (
        <div className="py-20 text-center">
            <h2 className="text-3xl font-black text-red-500 mb-4">Access Denied</h2>
            <p className="text-gray-500">Only the Master Admin can manage system access controls.</p>
        </div>
    );

    return (
        <div className="py-6 max-w-5xl mx-auto">
            <div className="mb-8">
                <h2 className="text-3xl font-heading font-bold text-brand-blue flex items-center gap-3">
                    <ShieldCheckIcon className="w-8 h-8 text-brand-gold" />
                    Access Control
                </h2>
                <p className="text-brand-gray mt-1">Manage who can edit website content and view the admin dashboard.</p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-8 font-semibold border-l-4 border-red-500">
                    {error}
                </div>
            )}

            {/* Add Form */}
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 mb-10">
                <h3 className="font-bold text-brand-blue mb-6">Grant Access</h3>
                <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="w-full space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">User's Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-gray-50 border-2 border-gray-100 focus:border-brand-azure rounded-xl px-4 py-3 outline-none"
                            placeholder="e.g. John Doe"
                        />
                    </div>
                    <div className="w-full space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">Account Email Address</label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-gray-50 border-2 border-gray-100 focus:border-brand-azure rounded-xl px-4 py-3 outline-none"
                            placeholder="abc@example.com"
                        />
                    </div>
                    <div className="w-full md:w-auto pb-1">
                        <button
                            type="submit"
                            disabled={adding}
                            className="w-full md:w-auto px-8 py-3 bg-brand-gold hover:bg-yellow-500 text-brand-blue font-bold tracking-wide rounded-xl transition-all whitespace-nowrap disabled:opacity-50"
                        >
                            {adding ? "Saving..." : "Grant Access"}
                        </button>
                    </div>
                </form>
                <p className="text-xs text-gray-400 mt-4 leading-relaxed max-w-2xl">
                    When you grant an email "Editor" access, they will automatically be allowed into the Admin Dashboard when they sign in. They will <span className="font-bold text-red-500">not</span> be allowed into this Access page.
                </p>
            </div>

            {/* Roster */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                    <h3 className="font-bold text-brand-blue">Active Administrators</h3>
                    <span className="text-xs font-black text-brand-gold bg-white px-3 py-1 rounded-full shadow-sm">{admins.length} Users</span>
                </div>

                {loading ? (
                    <div className="p-12 text-center text-gray-400 font-bold animate-pulse">Loading registry...</div>
                ) : admins.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">No additional users authorized.</div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {admins.map((admin) => (
                            <div key={admin.id} className="flex items-center justify-between p-6 hover:bg-gray-50/50 transition-colors">
                                <div>
                                    <h4 className="font-bold text-brand-blue text-lg flex items-center gap-2">
                                        {admin.name}
                                        <span className="text-[10px] uppercase tracking-widest font-black bg-brand-azure/10 text-brand-azure px-2 py-0.5 rounded-md">Editor</span>
                                    </h4>
                                    <p className="text-sm font-medium text-brand-gray mt-1">{admin.email}</p>
                                </div>
                                <div>
                                    {confirmDeleteId === admin.id ? (
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-red-500 mr-2">Revoke Access?</span>
                                            <button onClick={() => handleDelete(admin.id)} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
                                                <CheckIcon className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => setConfirmDeleteId(null)} className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
                                                <XMarkIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setConfirmDeleteId(admin.id)}
                                            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <TrashIcon className="w-4 h-4" /> Revoke
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
