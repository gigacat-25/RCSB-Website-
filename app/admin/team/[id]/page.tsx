"use client";
export const runtime = 'edge';


import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon, PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function EditTeamMemberPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    period: "",
    bio: "",
    image_url: "",
    order_index: "0",
  });

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const res = await fetch(`/api/admin/team/${id}`);
        if (!res.ok) throw new Error("Failed to fetch team member");
        const data = await res.json();
        setFormData({
          name: data.name || "",
          role: data.role || "",
          period: data.period || "",
          bio: data.bio || "",
          image_url: data.image_url || "",
          order_index: data.order_index?.toString() || "0",
        });
        if (data.image_url) setImagePreview(data.image_url);
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
    if (name === "image_url") {
      setImagePreview(value || null);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (JPG, PNG, WebP, etc.)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB");
      return;
    }

    setUploading(true);
    setUploadProgress("Uploading photo...");
    setError(null);

    // Local preview immediately
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);

    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Upload failed");
      }

      const data = await res.json();
      setFormData((prev) => ({ ...prev, image_url: data.url }));
      setImagePreview(data.url);
      setUploadProgress("Photo uploaded successfully!");
      setTimeout(() => setUploadProgress(null), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

  const clearImage = () => {
    setFormData((prev) => ({ ...prev, image_url: "" }));
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/team/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
           ...formData,
           order_index: parseInt(formData.order_index) || 0
        }),
      });

      if (!res.ok) throw new Error("Failed to update member");
      
      router.push("/admin/team");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center font-bold text-brand-blue animate-pulse">
        Fetching team member details...
      </div>
    );
  }

  return (
    <div className="py-6 max-w-2xl">
      <div className="mb-8">
        <Link href="/admin/team" className="inline-flex items-center gap-2 text-brand-gray hover:text-brand-blue mb-4 transition-colors font-semibold text-sm">
          <ArrowLeftIcon className="w-4 h-4" /> Back to Team
        </Link>
        <h2 className="text-3xl font-heading font-bold text-brand-blue">Edit Team Member</h2>
        <p className="text-brand-gray mt-1">Update details for {formData.name || "this member"}.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-8 font-semibold border-l-4 border-red-500">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
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

        {/* Photo Upload Section */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-brand-blue uppercase tracking-wider block">Profile Photo</label>
          
          <div className="flex gap-4 items-start">
            {/* Preview / Avatar */}
            <div className="relative flex-shrink-0">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-20 h-20 rounded-full object-cover border-2 border-brand-azure shadow"
                  />
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <PhotoIcon className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>

            {/* Upload Area */}
            <div className="flex-1 space-y-2">
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`cursor-pointer border-2 border-dashed rounded-xl px-4 py-4 text-center transition-all ${
                  dragOver
                    ? "border-brand-azure bg-blue-50"
                    : "border-gray-200 bg-gray-50 hover:border-brand-azure hover:bg-blue-50"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {uploading ? (
                  <p className="text-sm text-brand-azure font-semibold animate-pulse">{uploadProgress}</p>
                ) : uploadProgress ? (
                  <p className="text-sm text-green-600 font-semibold">{uploadProgress}</p>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-brand-blue">Click or drag photo here</p>
                    <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP — max 5MB</p>
                  </>
                )}
              </div>

              {/* Manual URL fallback */}
              <input 
                type="url" 
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                className="w-full bg-gray-50 border-2 border-gray-100 focus:border-brand-azure focus:ring-0 rounded-xl px-4 py-2.5 outline-none transition-all text-sm text-gray-500"
                placeholder="Or paste image URL..."
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-brand-blue uppercase tracking-wider block">Order Index</label>
          <input 
            type="number" 
            name="order_index"
            value={formData.order_index}
            onChange={handleChange}
            className="w-full bg-gray-50 border-2 border-gray-100 focus:border-brand-azure focus:ring-0 rounded-xl px-4 py-3 outline-none transition-all"
          />
        </div>

        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <button 
            type="submit" 
            disabled={saving || uploading}
            className="px-8 py-3 bg-brand-blue text-white font-bold rounded-full hover:bg-blue-900 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
