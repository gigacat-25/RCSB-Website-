"use client";

import { useState, useEffect } from "react";
import { CogIcon, PhotoIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

export default function SettingsPage() {
    const [imageUrl, setImageUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        fetch("/api/settings/about-photo")
            .then(r => r.json())
            .then(d => setImageUrl(d.url))
            .catch(e => console.error("Failed to load generic image", e));
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        setSuccess(false);
        try {
            const res = await fetch("/api/admin/settings/about-photo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: imageUrl })
            });
            if (!res.ok) throw new Error("Failed to save settings");
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div className="bg-brand-blue p-8 rounded-3xl relative overflow-hidden shadow-xl text-white">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/10 rounded-full blur-[80px] -z-10 translate-x-1/2 -translate-y-1/2" />
                <h1 className="text-3xl font-heading font-black mb-2 flex items-center gap-3">
                    <CogIcon className="w-8 h-8 text-brand-gold" />
                    Site Settings
                </h1>
                <p className="text-blue-100 font-light opacity-90 max-w-xl">
                    Manage general website configurations, specific content snippets, and global assets here.
                </p>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 space-y-6">
                <h2 className="text-xl font-heading font-bold text-brand-blue border-b border-slate-100 pb-4">
                    Homepage "About Us" Group Photo
                </h2>

                {error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="p-4 bg-green-50 text-green-600 rounded-xl text-sm font-bold border border-green-100 flex items-center gap-2">
                        <CheckCircleIcon className="w-5 h-5" /> Saved successfully!
                    </div>
                )}

                <div className="flex flex-col md:flex-row items-start gap-8">
                    <div className="w-full md:w-1/2 space-y-4">
                        <label className="text-sm font-bold text-brand-blue uppercase tracking-wider block">Current Image</label>
                        <div className="w-full h-48 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl overflow-hidden flex items-center justify-center relative group">
                            {imageUrl ? (
                                <>
                                    <img src={imageUrl} alt="Home Banner" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button
                                            type="button"
                                            onClick={() => setImageUrl("")}
                                            className="text-white text-xs font-bold bg-red-500 px-3 py-1 rounded-full shadow-lg"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center p-4">
                                    <PhotoIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                    <div className="text-gray-400 text-xs font-bold uppercase mb-1">No Image</div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="w-full md:w-1/2 space-y-4">
                        <label className="text-sm font-bold text-brand-blue uppercase tracking-wider block">Upload Replacement</label>
                        <div className="relative">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;

                                    setLoading(true);
                                    setError(null);
                                    setSuccess(false);

                                    const uploadData = new FormData();
                                    uploadData.append("file", file);

                                    try {
                                        const res = await fetch("/api/admin/upload", {
                                            method: "POST",
                                            body: uploadData,
                                        });

                                        if (!res.ok) throw new Error("Upload failed");
                                        const data = await res.json();
                                        setImageUrl(data.url);
                                    } catch (err: any) {
                                        setError("Failed to upload image: " + err.message);
                                    } finally {
                                        setLoading(false);
                                    }
                                }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <button
                                type="button"
                                className="w-full py-4 border-2 border-gray-200 border-dashed text-brand-blue font-bold rounded-2xl hover:bg-slate-50 hover:border-brand-azure transition-all text-sm flex items-center justify-center gap-2"
                            >
                                <PhotoIcon className="w-5 h-5" />
                                {loading ? "Uploading to Cloud..." : imageUrl ? "Click to Upload New Image" : "Click to Upload Image"}
                            </button>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-2">Recommended resolution: 1200x800 px. Max size 5MB.</p>
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={saving || !imageUrl}
                        className="px-8 py-3 bg-brand-blue text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-brand-azure transition-all disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Save Image"}
                    </button>
                </div>
            </div>
        </div>
    );
}
