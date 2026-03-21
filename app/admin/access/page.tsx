"use client";
export const runtime = 'edge';

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { isSuperAdmin } from "@/lib/admin";
import { ShieldCheckIcon, CheckIcon, XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function AccessControlPage() {
    const { user, isLoaded } = useUser();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [processingId, setProcessingId] = useState<string | null>(null);
    const [confirmRevokeId, setConfirmRevokeId] = useState<string | null>(null);

    const [searchQuery, setSearchQuery] = useState("");

    const email = user?.primaryEmailAddress?.emailAddress;
    const superAdmin = isSuperAdmin(email);

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/admin/access/users");
            if (!res.ok) throw new Error("Failed to fetch users");
            const data = await res.json();
            setUsers(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isLoaded && superAdmin) {
            fetchUsers();
        }
    }, [isLoaded, superAdmin]);

    const toggleAccess = async (userRecord: any, action: 'grant' | 'revoke') => {
        setProcessingId(userRecord.id);
        setError(null);
        try {
            const res = await fetch("/api/admin/access/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: userRecord.id,
                    email: userRecord.email,
                    name: userRecord.name,
                    action
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || `Failed to ${action} access`);

            await fetchUsers();
            if (action === 'revoke') setConfirmRevokeId(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setProcessingId(null);
        }
    };

    if (!isLoaded) return <div className="py-20 text-center text-gray-500 font-bold animate-pulse">Loading Identity...</div>;
    if (!superAdmin) return (
        <div className="py-20 text-center">
            <h2 className="text-3xl font-black text-red-500 mb-4">Access Denied</h2>
            <p className="text-gray-500">Only the Master Admin can manage system access controls.</p>
        </div>
    );

    const filteredUsers = users.filter((u) =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="py-6 max-w-5xl mx-auto">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-heading font-bold text-brand-blue flex items-center gap-3">
                        <ShieldCheckIcon className="w-8 h-8 text-brand-gold" />
                        Access Control
                    </h2>
                    <p className="text-brand-gray mt-1">Manage who can edit website content and view the admin dashboard.</p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-8 font-semibold border-l-4 border-red-500">
                    {error}
                </div>
            )}

            <div className="bg-blue-50/50 p-6 rounded-2xl mb-8 border border-blue-100 flex gap-4">
                <ShieldCheckIcon className="w-6 h-6 text-brand-blue shrink-0 mt-0.5" />
                <p className="text-sm text-brand-blue font-medium leading-relaxed">
                    Granting "Editor" access allows registered users to access the Admin Dashboard to manage projects, blogs, team members, and messages. They will <b>not</b> be able to grant or revoke access for other users.
                </p>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <h3 className="font-bold text-brand-blue">Registered Users</h3>
                        <span className="text-xs font-black text-brand-gold bg-white px-3 py-1 rounded-full shadow-sm">{filteredUsers.length} Users</span>
                    </div>

                    <div className="relative w-full sm:w-72">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold sm:text-sm transition-shadow"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="p-12 text-center text-gray-400 font-bold animate-pulse">Loading users...</div>
                ) : filteredUsers.length === 0 ? (
                    <div className="p-12 text-center text-gray-400 font-bold">No users match your criteria.</div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filteredUsers.map((u) => {
                            const isEditor = u.role === 'editor' || u.role === 'admin';
                            const isMe = u.email === email;

                            return (
                                <div key={u.id} className={`flex items-center justify-between p-6 transition-colors ${isMe ? 'bg-amber-50/20' : 'hover:bg-gray-50/50'}`}>
                                    <div className="flex items-center gap-4">
                                        {u.imageUrl ? (
                                            <img src={u.imageUrl} alt={u.name} className="w-10 h-10 rounded-full border border-gray-200 shadow-sm" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-brand-gold/20 flex items-center justify-center font-bold text-brand-blue">
                                                {u.name.charAt(0)}
                                            </div>
                                        )}
                                        <div>
                                            <h4 className="font-bold text-brand-blue text-lg flex items-center gap-2">
                                                {u.name}
                                                {isMe && <span className="text-[10px] uppercase tracking-widest font-black bg-brand-gold/10 text-brand-gold px-2 py-0.5 rounded-md">You (Master Admin)</span>}
                                                {!isMe && isEditor && <span className="text-[10px] uppercase tracking-widest font-black bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-md">Editor</span>}
                                            </h4>
                                            <p className="text-sm font-medium text-brand-gray/60 mt-0.5">{u.email}</p>
                                        </div>
                                    </div>

                                    <div>
                                        {isMe ? null : processingId === u.id ? (
                                            <div className="text-xs font-bold text-brand-gold animate-pulse px-4">Processing...</div>
                                        ) : isEditor ? (
                                            confirmRevokeId === u.id ? (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-red-500 mr-2">Revoke Access?</span>
                                                    <button onClick={() => toggleAccess(u, 'revoke')} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition shadow-sm">
                                                        <CheckIcon className="w-5 h-5" />
                                                    </button>
                                                    <button onClick={() => setConfirmRevokeId(null)} className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
                                                        <XMarkIcon className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setConfirmRevokeId(u.id)}
                                                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                                >
                                                    <XMarkIcon className="w-4 h-4 text-red-500/70" /> Revoke
                                                </button>
                                            )
                                        ) : (
                                            <button
                                                onClick={() => toggleAccess(u, 'grant')}
                                                className="px-6 py-2 bg-brand-blue hover:bg-brand-azure text-white font-bold text-sm tracking-wide rounded-full shadow-md hover:shadow-lg transition-all"
                                            >
                                                Grant Editor Access
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
