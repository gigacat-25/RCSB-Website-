"use client";
export const runtime = 'edge';

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import ImageCropper from "@/components/admin/ImageCropper";

export default function EditPastPresidentPage() {
    const router = useRouter();
    const { id } = useParams();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pendingProfileImage, setPendingProfileImage] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        period: "2023-24",
        image_url: "",
        order_index: "0",
    });

    useEffect(() => {
        const fetchMember = async () => {
            try {
                const res = await fetch(`/api/admin/past-presidents/${id}`);
                if (!res.ok) throw new Error("Past President not found");
                const data = await res.json();
                setFormData({
                    name: data.name || "",
                    period: data.period || "",
                    image_url: data.image_url || "",
                    order_index: (data.order_index ?? 0).toString(),
                });
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchMember();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const res = await fetch(`/api/admin/past-presidents/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    order_index: parseInt(formData.order_index) || 0
                }),
            });

            if (!res.ok) throw new Error("Failed to update past president");

            router.push("/admin/past-presidents");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
            setSaving(false);
        }
    };

    if (loading) return <div className="py-20 text-center font-bold text-brand-gray animate-pulse">Loading Past President details...</div>;

    return (
        <div className="py-6 max-w-7xl mx-auto">
            <div className="mb-8">
                <Link href="/admin/past-presidents" className="inline-flex items-center gap-2 text-brand-gray hover:text-brand-blue mb-4 transition-colors font-semibold text-sm">
                    <ArrowLeftIcon className="w-4 h-4" /> Back to Past Presidents
                </Link>
                <h2 className="text-3xl font-heading font-bold text-brand-blue">Edit Past President</h2>
                <p className="text-brand-gray mt-1">Update information for {formData.name || "this leader"}.</p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-8 font-semibold border-l-4 border-red-500">
                    {error}
                </div>
            )}

            {pendingProfileImage && (
                <ImageCropper
                    imageSrc={pendingProfileImage}
                    onCancel={() => setPendingProfileImage(null)}
                    onCropCompleteAction={async (croppedBlob) => {
                        setSaving(true);
                        const uploadData = new FormData();
                        uploadData.append("file", croppedBlob, "profile-avatar.jpg");
                        try {
                            const res = await fetch("/api/admin/upload", { method: "POST", body: uploadData });
                            if (res.ok) {
                                const data = await res.json();
                                setFormData((prev) => ({ ...prev, image_url: data.url }));
                            }
                        } finally {
                            setPendingProfileImage(null);
                            setSaving(false);
                        }
                    }}
                />
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-brand-blue uppercase tracking-wider block">Full Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-gray-50 border-2 border-gray-100 focus:border-brand-azure focus:ring-0 rounded-xl px-4 py-3 outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-brand-blue uppercase tracking-wider block">Tenure Period *</label>
                                <input
                                    type="text"
                                    name="period"
                                    value={formData.period}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-gray-50 border-2 border-gray-100 focus:border-brand-azure focus:ring-0 rounded-xl px-4 py-3 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-8 py-3 bg-brand-blue text-white font-bold rounded-full hover:bg-blue-900 transition-colors disabled:opacity-50"
                            >
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <label className="text-sm font-bold text-brand-blue uppercase tracking-wider block mb-4">Profile Photo (Optional)</label>
                            <div className="aspect-square w-40 bg-gray-50 border-2 border-dashed border-gray-200 rounded-full overflow-hidden mb-4 relative mx-auto">
                                {formData.image_url ? (
                                    <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full bg-white text-gray-400">
                                        <img src="/favicon.png" alt="Upload Photo" className="w-10 h-10 mb-1 opacity-20 grayscale" />
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        setPendingProfileImage(URL.createObjectURL(file));
                                        e.target.value = "";
                                    }}
                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                />
                            </div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase mb-2 text-center">Click to Upload</p>

                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <input
                                    type="url"
                                    name="image_url"
                                    value={formData.image_url}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-xs outline-none focus:border-brand-azure transition-all"
                                    placeholder="Or paste URL..."
                                />
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-brand-blue uppercase tracking-wider block">Order Index</label>
                                <p className="text-xs text-gray-400 font-medium mb-3">Controls the display order. Lower numbers appear first.</p>
                                <input
                                    type="number"
                                    name="order_index"
                                    value={formData.order_index}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border-2 border-gray-100 focus:border-brand-azure focus:ring-0 rounded-xl px-4 py-3 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
