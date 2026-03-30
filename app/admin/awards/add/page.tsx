"use client";
export const runtime = "edge";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { isAdmin } from "@/lib/admin";
import { ArrowLeftIcon, TrophyIcon, PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";

const AWARD_CATEGORIES = [
  "District Award", "Club Award", "Individual Award", "Best Project",
  "Leadership Award", "Service Award", "Milestone", "Other",
];

export default function AddAwardPage() {
  const router = useRouter();
  const { isLoaded, user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  const userIsAdmin = isAdmin(email, user?.publicMetadata?.role);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "District Award",
    year: new Date().getFullYear().toString(),
    description: "",
    image_url: "",
    content: "",
    type: "award",
    status: "published",
    event_date: "",
    gallery_urls: "[]",
    featured_links: "[]",
  });

  useEffect(() => {
    if (isLoaded && !userIsAdmin) router.push("/admin");
  }, [isLoaded, userIsAdmin, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "title") next.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
      if (name === "slug") next.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
      return next;
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (res.ok) { const d = await res.json(); setFormData((p) => ({ ...p, image_url: d.url })); }
    } catch { setError("Image upload failed."); }
    finally { setImageUploading(false); }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setGalleryUploading(true);
    const newUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const fd = new FormData();
      fd.append("file", files[i]);
      try {
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        if (res.ok) { const d = await res.json(); newUrls.push(d.url); }
      } catch { /* skip */ }
    }
    if (newUrls.length > 0) {
      const current = JSON.parse(formData.gallery_urls || "[]");
      setFormData((p) => ({ ...p, gallery_urls: JSON.stringify([...current, ...newUrls]) }));
    }
    setGalleryUploading(false);
  };

  const removeGalleryImage = (index: number) => {
    const current = JSON.parse(formData.gallery_urls || "[]");
    current.splice(index, 1);
    setFormData((p) => ({ ...p, gallery_urls: JSON.stringify(current) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.category) { setError("Award Title and Category are required."); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, type: "award" }),
      });
      if (res.ok) {
        router.push("/admin/awards");
      } else {
        const d = await res.json();
        setError(d.error || "Failed to save award.");
      }
    } catch { setError("An unexpected error occurred."); }
    finally { setLoading(false); }
  };

  const galleryImages: string[] = JSON.parse(formData.gallery_urls || "[]");

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-brand-gold/30 border-t-brand-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="py-6 max-w-3xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <Link href="/admin/awards" className="inline-flex items-center gap-2 text-brand-gray hover:text-brand-blue mb-4 transition-colors font-semibold text-sm">
          <ArrowLeftIcon className="w-4 h-4" /> Back to Awards
        </Link>
        <div className="flex items-center gap-3">
          <TrophyIcon className="w-8 h-8 text-brand-gold" />
          <div>
            <h2 className="text-3xl font-heading font-bold text-brand-blue">Add New Award</h2>
            <p className="text-brand-gray mt-0.5">Document a club honor, recognition or milestone</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm font-medium">
          <XMarkIcon className="w-5 h-5 shrink-0" /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Basic Info */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-5">
          <h3 className="text-xs font-black uppercase tracking-widest text-brand-gray/60 border-b border-gray-100 pb-3">Basic Info</h3>

          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-blue uppercase tracking-wider block">Award Title *</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required
              className="w-full bg-gray-50 border-2 border-gray-100 focus:border-brand-azure focus:ring-0 rounded-xl px-4 py-3 outline-none transition-all text-lg font-semibold"
              placeholder="e.g. Best Club Award — Rotary District 3190" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-blue uppercase tracking-wider block">URL Slug *</label>
            <div className="flex items-center bg-gray-50 border-2 border-gray-100 focus-within:border-brand-azure rounded-xl overflow-hidden transition-all">
              <span className="px-4 py-3 text-brand-gray font-mono text-sm border-r border-gray-200">/awards/</span>
              <input type="text" name="slug" value={formData.slug} onChange={handleChange} required
                className="flex-1 bg-transparent px-4 py-3 outline-none font-mono text-sm" placeholder="best-club-award-2024" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-blue uppercase tracking-wider block">Category *</label>
              <select name="category" value={formData.category} onChange={handleChange} required
                className="w-full bg-gray-50 border-2 border-gray-100 focus:border-brand-azure focus:ring-0 rounded-xl px-4 py-3 outline-none transition-all">
                {AWARD_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-blue uppercase tracking-wider block">Year *</label>
              <input type="text" name="year" value={formData.year} onChange={handleChange} required
                className="w-full bg-gray-50 border-2 border-gray-100 focus:border-brand-azure focus:ring-0 rounded-xl px-4 py-3 outline-none transition-all"
                placeholder="e.g. 2026-2027" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-blue uppercase tracking-wider block">Recognition Date</label>
            <input type="date" name="event_date" value={formData.event_date} onChange={handleChange}
              className="w-full bg-gray-50 border-2 border-gray-100 focus:border-brand-azure focus:ring-0 rounded-xl px-4 py-3 outline-none transition-all" />
          </div>
        </div>

        {/* Description */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-5">
          <h3 className="text-xs font-black uppercase tracking-widest text-brand-gray/60 border-b border-gray-100 pb-3">Description</h3>

          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-blue uppercase tracking-wider block">Award Summary *</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required rows={2}
              className="w-full bg-gray-50 border-2 border-gray-100 focus:border-brand-azure focus:ring-0 rounded-xl px-4 py-3 outline-none transition-all"
              placeholder="A short summary shown on the awards listing page..." />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-blue uppercase tracking-wider block">Detailed Citation</label>
            <textarea name="content" value={formData.content} onChange={handleChange} rows={6}
              className="w-full bg-gray-50 border-2 border-gray-100 focus:border-brand-azure focus:ring-0 rounded-xl px-4 py-3 outline-none transition-all font-mono text-sm"
              placeholder="Full citation, context, and details... (Markdown supported)" />
          </div>
        </div>

        {/* Cover Image */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-brand-gray/60 border-b border-gray-100 pb-3">Cover Image</h3>

          {formData.image_url ? (
            <div className="relative w-full h-48 rounded-2xl overflow-hidden group">
              <img src={formData.image_url} alt="Award cover" className="w-full h-full object-cover" />
              <button type="button" onClick={() => setFormData((p) => ({ ...p, image_url: "" }))}
                className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="block w-full cursor-pointer">
              <div className={`w-full h-40 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all ${imageUploading ? "border-brand-gold bg-brand-gold/5" : "border-gray-200 hover:border-brand-azure hover:bg-blue-50"}`}>
                {imageUploading
                  ? <div className="w-6 h-6 border-2 border-brand-gold/30 border-t-brand-gold rounded-full animate-spin" />
                  : <><PhotoIcon className="w-8 h-8 text-gray-300" /><span className="text-sm text-gray-400 font-medium">Click to upload image</span></>
                }
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          )}

          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-blue uppercase tracking-wider block">Or paste image URL</label>
            <input type="url" name="image_url" value={formData.image_url} onChange={handleChange}
              className="w-full bg-gray-50 border-2 border-gray-100 focus:border-brand-azure focus:ring-0 rounded-xl px-4 py-3 outline-none transition-all"
              placeholder="https://..." />
          </div>
        </div>

        {/* Gallery */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-brand-gray/60 border-b border-gray-100 pb-3">
            Gallery Images <span className="text-gray-400 normal-case font-normal">(optional)</span>
          </h3>

          <div className="flex flex-wrap gap-4">
            {galleryImages.map((url, index) => (
              <div key={index} className="w-32 h-24 bg-gray-50 border-2 border-gray-200 rounded-xl overflow-hidden relative group">
                <img src={url} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button type="button" onClick={() => removeGalleryImage(index)}
                    className="text-white text-[10px] font-bold bg-red-500 px-2 py-1 rounded-full">Remove</button>
                </div>
              </div>
            ))}

            <div className="w-32 h-24 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl overflow-hidden flex flex-col items-center justify-center relative hover:border-brand-azure transition-colors group cursor-pointer">
              {galleryUploading
                ? <div className="w-5 h-5 border-2 border-brand-gold/30 border-t-brand-gold rounded-full animate-spin" />
                : <>
                    <span className="text-[10px] font-bold text-gray-400 group-hover:text-brand-azure">Select Multiple</span>
                    <span className="text-xs font-black text-brand-blue group-hover:text-brand-azure mt-1">Add Photos</span>
                  </>
              }
              <input type="file" multiple accept="image/*" onChange={handleGalleryUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
            </div>
          </div>
          <p className="text-xs text-gray-400">Select multiple images at once to add them to the gallery.</p>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4 pt-2">
          <Link href="/admin/awards" className="px-6 py-3 text-brand-gray font-bold hover:text-brand-blue transition-colors">Cancel</Link>
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 px-8 py-3 bg-brand-gold hover:bg-yellow-400 text-brand-blue font-black rounded-full transition-all disabled:opacity-50 active:scale-95 shadow-md">
            {loading
              ? <div className="w-4 h-4 border-2 border-brand-blue/30 border-t-brand-blue rounded-full animate-spin" />
              : <TrophyIcon className="w-5 h-5" />
            }
            {loading ? "Publishing..." : "Publish Award"}
          </button>
        </div>
      </form>
    </div>
  );
}
