"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon, PhotoIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function ManagePartners() {
    const [partners, setPartners] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [newPartner, setNewPartner] = useState({ name: "", image_url: "", order_index: 0 });
    const [uploadingImage, setUploadingImage] = useState(false);

    useEffect(() => {
        fetchPartners();
    }, []);

    const fetchPartners = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/partners?t=${new Date().getTime()}`, { cache: "no-store" });
            const data = await res.json();
            if (Array.isArray(data)) {
                setPartners(data);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to fetch partners");
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploadingImage(true);
        setSaving(true);
        setError(null);

        try {
            let addedCount = 0;
            for (let i = 0; i < files.length; i++) {
                const file = files[i];

                // 1. Upload image
                const uploadData = new FormData();
                uploadData.append("file", file);
                const uploadRes = await fetch("/api/admin/upload", {
                    method: "POST",
                    body: uploadData,
                });

                if (!uploadRes.ok) throw new Error(`Upload failed for ${file.name}`);
                const data = await uploadRes.json();

                // 2. Automatically save partner to DB
                // Use the filename (without extension) as the partner name securely
                const filenameName = file.name.split('.').slice(0, -1).join('.') || "Partner Logo";
                const payload = {
                    name: filenameName,
                    image_url: data.url,
                    order_index: partners.length + 1 + addedCount
                };

                const saveRes = await fetch("/api/admin/partners", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                if (!saveRes.ok) throw new Error(`Failed to add partner ${file.name}`);
                addedCount++;
            }

            await fetchPartners();
        } catch (err: any) {
            alert(err.message);
        } finally {
            setUploadingImage(false);
            setSaving(false);
            // Reset input so they can upload same file again if needed
            e.target.value = "";
        }
    };

    const handleDeletePartner = async (id: number) => {
        if (!confirm("Are you sure you want to remove this partner logo?")) return;

        setSaving(true);
        try {
            const res = await fetch(`/api/admin/partners/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to delete partner");
            await fetchPartners();
        } catch (err: any) {
            alert(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading && partners.length === 0) return <div className="p-10 text-center font-bold text-brand-gray animate-pulse">Loading partners...</div>;

    return (
        <div className="py-6 max-w-5xl">
            <div className="mb-8">
                <Link href="/admin" className="inline-flex items-center gap-2 text-brand-gray hover:text-brand-blue mb-4 transition-colors font-semibold text-sm">
                    <ArrowLeftIcon className="w-4 h-4" /> Back to Dashboard
                </Link>
                <h2 className="text-3xl font-heading font-bold text-brand-blue">Manage Partners</h2>
                <p className="text-brand-gray mt-1">Add, remove, and manage the organizations the club has worked with.</p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-8 font-semibold border-l-4 border-red-500">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Add New Partner Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-6">
                        <h3 className="font-bold text-brand-blue mb-6">Add New Partner</h3>
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-brand-blue uppercase tracking-wider block">Upload Partner Logos *</label>

                                <div className="aspect-video bg-gray-50 border-2 border-dashed border-brand-azure/50 rounded-xl flex flex-col items-center justify-center relative overflow-hidden group hover:border-brand-azure hover:bg-brand-azure/5 transition-all cursor-pointer">
                                    <div className="text-center p-4">
                                        <PhotoIcon className="w-10 h-10 text-brand-azure mx-auto mb-3" />
                                        <span className="text-sm font-bold text-brand-blue block mb-1">Click or drag images</span>
                                        <span className="text-[10px] font-bold text-brand-gray">Select multiple files at once</span>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageUpload}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        disabled={uploadingImage}
                                    />
                                    {uploadingImage && (
                                        <div className="absolute inset-0 bg-white/90 flex flex-col gap-2 items-center justify-center z-20 font-bold text-brand-azure text-sm backdrop-blur-sm">
                                            <div className="w-6 h-6 border-4 border-brand-azure border-t-transparent rounded-full animate-spin"></div>
                                            Uploading & Saving...
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Existing Partners Grid */}
                <div className="lg:col-span-2">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-brand-blue mb-6">Current Partners ({partners.length})</h3>

                        {partners.length === 0 ? (
                            <div className="text-center py-10 bg-gray-50 rounded-2xl border border-gray-100">
                                <span className="text-brand-gray/60 font-semibold text-sm">No partners added yet. Add one from the sidebar!</span>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {partners.map((partner) => (
                                    <div key={partner.id} className="group relative bg-white border border-gray-100 rounded-xl p-4 flex flex-col items-center justify-center hover:shadow-lg hover:border-brand-azure/30 transition-all">
                                        <button
                                            onClick={() => handleDeletePartner(partner.id)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-md hover:bg-red-600 transition-all z-10"
                                            title="Remove partner"
                                        >
                                            <TrashIcon className="w-3.5 h-3.5" />
                                        </button>
                                        <div className="w-full aspect-square flex items-center justify-center mb-3 relative">
                                            <img src={partner.image_url} alt={partner.name} className="max-w-[90%] max-h-[90%] object-contain" />
                                        </div>
                                        <p className="text-[10px] font-bold text-center text-brand-blue w-full truncate px-1" title={partner.name}>
                                            {partner.name}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
