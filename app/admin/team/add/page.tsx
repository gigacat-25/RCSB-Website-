"use client";
export const runtime = 'edge';

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon, PhotoIcon, XMarkIcon, UserIcon } from "@heroicons/react/24/outline";
import ImageCropper from "@/components/admin/ImageCropper";

export default function AddTeamMemberPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [pendingProfileImage, setPendingProfileImage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    role: "Core Member",
    period: "2024-25",
    bio: "",
    image_url: "",
    order_index: "0",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const clearImage = () => {
    setFormData((prev) => ({ ...prev, image_url: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          order_index: parseInt(formData.order_index) || 0
        }),
      });

      if (!res.ok) throw new Error("Failed to add member");

      router.push("/admin/team");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="py-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/team" className="inline-flex items-center gap-2 text-brand-gray hover:text-brand-blue mb-4 transition-colors font-semibold text-sm">
          <ArrowLeftIcon className="w-4 h-4" /> Back to Team
        </Link>
        <h2 className="text-3xl font-heading font-bold text-brand-blue">Add Team Member</h2>
        <p className="text-brand-gray mt-1">Add a new board member or leader to the club roster.</p>
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
            setLoading(true);
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
              setLoading(false);
            }
          }}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Info */}
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
                  placeholder="e.g. John Doe"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-brand-blue uppercase tracking-wider block">Role *</label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-50 border-2 border-gray-100 focus:border-brand-azure focus:ring-0 rounded-xl px-4 py-3 outline-none transition-all"
                    placeholder="e.g. President"
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
                    placeholder="e.g. 2024-25"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-brand-blue uppercase tracking-wider block">Bio (Optional)</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={3}
                  className="w-full bg-gray-50 border-2 border-gray-100 focus:border-brand-azure focus:ring-0 rounded-xl px-4 py-3 outline-none transition-all"
                  placeholder="A short biography..."
                ></textarea>
              </div>

            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-brand-blue text-white font-bold rounded-full hover:bg-blue-900 transition-colors disabled:opacity-50"
              >
                {loading ? "Processing..." : "Add Member"}
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Photo */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <label className="text-sm font-bold text-brand-blue uppercase tracking-wider block mb-4">Profile Photo *</label>
              <div className="aspect-square w-40 bg-gray-50 border-2 border-dashed border-gray-200 rounded-full overflow-hidden mb-4 relative group mx-auto">
                {formData.image_url ? (
                  <img src={formData.image_url} alt="Profile Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <UserIcon className="w-10 h-10 mb-1 opacity-50" />
                    <span className="text-[10px] font-bold uppercase text-center px-1">Upload Photo</span>
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
              <p className="text-[10px] text-gray-400 font-bold uppercase mb-2 text-center">Click or Drag to Upload</p>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-[10px] text-gray-400 font-bold uppercase mb-2 text-center">Or Paste URL</p>
                <input
                  type="url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-xs outline-none focus:border-brand-azure transition-all"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <div className="space-y-2">
                <label className="text-sm font-bold text-brand-blue uppercase tracking-wider block">Order Index</label>
                <p className="text-xs text-gray-400 font-medium mb-3">Controls the display order. Lower numbers appear first, then sorted by name.</p>
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
