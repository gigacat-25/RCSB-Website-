"use client";
export const runtime = "edge";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { isAdmin } from "@/lib/admin";
import {
  ArrowLeftIcon, TrophyIcon, PhotoIcon, XMarkIcon, TrashIcon,
  CheckIcon, NewspaperIcon, SparklesIcon
} from "@heroicons/react/24/outline";

const API_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_API_URL || "https://rcsb-api-worker.impact1-iceas.workers.dev";

function fixImageUrl(url: string | null | undefined): string {
  if (!url) return "";
  if (url.includes("media.rcsb.in/")) {
    const key = url.split("media.rcsb.in/").pop();
    return `${API_URL}/media/${key}`;
  }
  return url;
}

const AWARD_CATEGORIES = [
  "District Award", "Club Award", "Individual Award", "Best Project",
  "Leadership Award", "Service Award", "Milestone", "Other",
];

export default function EditAwardPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { isLoaded, user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  const userIsAdmin = isAdmin(email, user?.publicMetadata?.role);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [galleryUploading, setGalleryUploading] = useState(false);

  // AI Email state
  const [emailDraft, setEmailDraft] = useState<{ subject: string; body: string } | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [showEmailPanel, setShowEmailPanel] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "District Award",
    year: "",
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

  useEffect(() => {
    const fetchAward = async () => {
      try {
        const res = await fetch("/api/admin/projects");
        const all = await res.json();
        const item = all.find((p: any) => p.id === parseInt(params.id));
        if (item) {
          setFormData({
            title: item.title || "",
            slug: item.slug || "",
            category: item.category || "District Award",
            year: item.year || "",
            description: item.description || "",
            image_url: fixImageUrl(item.image_url),
            content: item.content || "",
            type: "award",
            status: item.status || "published",
            event_date: item.event_date || "",
            gallery_urls: item.gallery_urls || "[]",
            featured_links: item.featured_links || "[]",
          });
        } else {
          setError("Award not found.");
        }
      } catch {
        setError("Failed to load award.");
      } finally {
        setLoading(false);
      }
    };
    fetchAward();
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (res.ok) {
        const data = await res.json();
        setFormData((prev) => ({ ...prev, image_url: data.url }));
      }
    } catch { setError("Image upload failed."); }
    finally { setSaving(false); }
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
      } catch { /* skip failed */ }
    }
    if (newUrls.length > 0) {
      const current = JSON.parse(formData.gallery_urls || "[]");
      setFormData((prev) => ({ ...prev, gallery_urls: JSON.stringify([...current, ...newUrls]) }));
    }
    setGalleryUploading(false);
  };

  const removeGalleryImage = (index: number) => {
    const current = JSON.parse(formData.gallery_urls || "[]");
    current.splice(index, 1);
    setFormData((prev) => ({ ...prev, gallery_urls: JSON.stringify(current) }));
  };

  const handleGenerateEmail = async () => {
    setAiLoading(true);
    setShowEmailPanel(true);
    try {
      const res = await fetch("/api/admin/generate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "award",
          title: formData.title,
          description: formData.description,
          content: formData.content,
          category: formData.category,
          year: formData.year,
          slug: formData.slug,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setEmailDraft(data);
      } else {
        // Fallback manual draft
        setEmailDraft({
          subject: `🏆 Announcing: ${formData.title}`,
          body: `<p>Dear Rotaract Family,</p><p>We are proud to announce that <b>${formData.title}</b> — a ${formData.category} — has been awarded to Rotaract Club of Swarna Bengaluru for the year ${formData.year}.</p><p>${formData.description}</p><p>Read more: <a href="https://rcsb-website.pages.dev/awards/${formData.slug}">View Award →</a></p><p>Yours in Service,<br/>Rotaract Club of Swarna Bengaluru</p>`,
        });
      }
    } catch {
      setEmailDraft({
        subject: `🏆 Announcing: ${formData.title}`,
        body: `<p>Dear Rotaract Family,</p><p>We are proud to announce that <b>${formData.title}</b> — a ${formData.category} — has been awarded to Rotaract Club of Swarna Bengaluru for the year ${formData.year}.</p><p>${formData.description}</p><p>Read more: <a href="https://rcsb-website.pages.dev/awards/${formData.slug}">View Award →</a></p><p>Yours in Service,<br/>Rotaract Club of Swarna Bengaluru</p>`,
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/projects/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, type: "award" }),
      });
      if (!res.ok) throw new Error("Failed to update award.");
      router.push("/admin/awards");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/projects/${params.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete award.");
      router.push("/admin/awards");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  const galleryImages: string[] = JSON.parse(formData.gallery_urls || "[]");

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-brand-gold/30 border-t-brand-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="py-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <Link href="/admin/awards" className="inline-flex items-center gap-2 text-brand-gray hover:text-brand-blue mb-4 transition-colors font-semibold text-sm">
            <ArrowLeftIcon className="w-4 h-4" /> Back to Awards
          </Link>
          <div className="flex items-center gap-3">
            <TrophyIcon className="w-8 h-8 text-brand-gold" />
            <div>
              <h2 className="text-3xl font-heading font-bold text-brand-blue">Edit Award</h2>
              <p className="text-brand-gray mt-0.5">Editing: &ldquo;{formData.title}&rdquo;</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* AI Email Blast */}
          <button
            type="button"
            onClick={handleGenerateEmail}
            className="flex items-center gap-2 px-5 py-2 bg-brand-gold/10 text-brand-gold hover:bg-brand-gold/20 font-bold rounded-full transition-colors border border-brand-gold/20 text-sm"
          >
            <NewspaperIcon className="w-4 h-4" />
            Email Blast
          </button>

          {/* Delete */}
          {confirmDelete ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-red-600 font-semibold">Sure?</span>
              <button onClick={handleDelete} disabled={deleting} className="flex items-center gap-1 px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-full hover:bg-red-600 disabled:opacity-50">
                <CheckIcon className="w-4 h-4" /> {deleting ? "Deleting..." : "Yes"}
              </button>
              <button onClick={() => setConfirmDelete(false)} className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-bold rounded-full hover:bg-gray-200">
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button onClick={() => setConfirmDelete(true)} className="flex items-center gap-2 px-5 py-2 bg-red-50 text-red-600 hover:bg-red-100 font-bold rounded-full transition-colors border border-red-200 text-sm">
              <TrashIcon className="w-4 h-4" /> Delete
            </button>
          )}
        </div>
      </div>

      {/* AI Email Panel */}
      {showEmailPanel && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-700 font-bold">
              <SparklesIcon className="w-5 h-5" /> AI Email Draft
            </div>
            <button onClick={() => setShowEmailPanel(false)} className="text-gray-400 hover:text-gray-600">
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {aiLoading ? (
            <div className="flex items-center gap-3 py-4">
              <div className="w-5 h-5 border-2 border-amber-300 border-t-amber-600 rounded-full animate-spin" />
              <span className="text-sm text-amber-700 font-medium">Generating email...</span>
            </div>
          ) : emailDraft ? (
            <>
              <div className="space-y-2">
                <label className="text-xs font-bold text-amber-700 uppercase tracking-wider">Subject</label>
                <input
                  type="text"
                  value={emailDraft.subject}
                  onChange={(e) => setEmailDraft((d) => d ? { ...d, subject: e.target.value } : d)}
                  className="w-full bg-white border border-amber-200 rounded-xl px-4 py-2 outline-none text-sm font-semibold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-amber-700 uppercase tracking-wider">Body (HTML)</label>
                <textarea
                  value={emailDraft.body}
                  onChange={(e) => setEmailDraft((d) => d ? { ...d, body: e.target.value } : d)}
                  rows={6}
                  className="w-full bg-white border border-amber-200 rounded-xl px-4 py-2 outline-none text-sm font-mono"
                />
              </div>
              <div className="flex gap-3">
                <Link
                  href={`/admin/newsletter?subject=${encodeURIComponent(emailDraft.subject)}&body=${encodeURIComponent(emailDraft.body)}`}
                  className="flex items-center gap-2 px-6 py-2.5 bg-brand-gold text-brand-blue font-bold rounded-full text-sm hover:bg-yellow-400 transition-colors"
                >
                  <NewspaperIcon className="w-4 h-4" /> Send Newsletter
                </Link>
                <button
                  type="button"
                  onClick={handleGenerateEmail}
                  className="flex items-center gap-2 px-5 py-2.5 border border-amber-300 text-amber-700 font-bold rounded-full text-sm hover:bg-amber-100 transition-colors"
                >
                  <SparklesIcon className="w-4 h-4" /> Regenerate
                </button>
              </div>
            </>
          ) : null}
        </div>
      )}

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
                className="flex-1 bg-transparent px-4 py-3 outline-none font-mono text-sm" />
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
              placeholder="Full citation, context, and details about the award... (Markdown supported)" />
          </div>
        </div>

        {/* Cover Image */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-brand-gray/60 border-b border-gray-100 pb-3">Cover Image</h3>

          <div className="flex items-start gap-6">
            <div className="w-48 h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl overflow-hidden flex items-center justify-center relative group shrink-0">
              {formData.image_url ? (
                <>
                  <img src={fixImageUrl(formData.image_url)} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button type="button" onClick={() => setFormData((p) => ({ ...p, image_url: "" }))}
                      className="text-white text-xs font-bold bg-red-500 px-3 py-1 rounded-full">Remove</button>
                  </div>
                </>
              ) : (
                <div className="text-center p-4">
                  <PhotoIcon className="w-8 h-8 text-gray-300 mx-auto mb-1" />
                  <div className="text-[10px] text-gray-400">No Image</div>
                </div>
              )}
            </div>

            <div className="flex-1 space-y-3">
              <div className="relative">
                <input type="file" accept="image/*" onChange={handleCoverUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <button type="button" className="w-full py-3 bg-gray-50 border-2 border-gray-100 text-brand-blue font-bold rounded-xl hover:bg-white hover:border-brand-azure transition-all text-sm">
                  {saving ? "Uploading..." : "Click to Upload Image"}
                </button>
              </div>
              <div className="flex gap-2 items-center">
                <div className="h-px bg-gray-200 flex-1" />
                <span className="text-[10px] font-bold text-gray-400 uppercase">OR</span>
                <div className="h-px bg-gray-200 flex-1" />
              </div>
              <input type="url" name="image_url" value={formData.image_url} onChange={handleChange}
                className="w-full bg-gray-50 border-2 border-gray-100 focus:border-brand-azure focus:ring-0 rounded-xl px-4 py-2 outline-none transition-all text-xs"
                placeholder="Paste an external image URL..." />
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-brand-gray/60 border-b border-gray-100 pb-3">Gallery Images</h3>

          <div className="flex flex-wrap gap-4">
            {galleryImages.map((url, index) => (
              <div key={index} className="w-32 h-24 bg-gray-50 border-2 border-gray-200 rounded-xl overflow-hidden relative group">
                <img src={fixImageUrl(url)} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button type="button" onClick={() => removeGalleryImage(index)}
                    className="text-white text-[10px] font-bold bg-red-500 px-2 py-1 rounded-full">Remove</button>
                </div>
              </div>
            ))}

            <div className="w-32 h-24 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl overflow-hidden flex flex-col items-center justify-center relative hover:border-brand-azure transition-colors group cursor-pointer">
              {galleryUploading ? (
                <div className="w-5 h-5 border-2 border-brand-gold/30 border-t-brand-gold rounded-full animate-spin" />
              ) : (
                <>
                  <span className="text-[10px] font-bold text-gray-400 group-hover:text-brand-azure">Select Multiple</span>
                  <span className="text-xs font-black text-brand-blue group-hover:text-brand-azure mt-1">Add Photos</span>
                </>
              )}
              <input type="file" multiple accept="image/*" onChange={handleGalleryUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
            </div>
          </div>
          <p className="text-xs text-gray-400">Select multiple images at once to add them to the gallery.</p>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4 pt-2">
          <Link href="/admin/awards" className="px-6 py-3 text-brand-gray font-bold hover:text-brand-blue transition-colors">
            Cancel
          </Link>
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 px-8 py-3 bg-brand-gold hover:bg-yellow-400 text-brand-blue font-black rounded-full transition-all disabled:opacity-50 active:scale-95 shadow-md">
            {saving ? <div className="w-4 h-4 border-2 border-brand-blue/30 border-t-brand-blue rounded-full animate-spin" /> : <TrophyIcon className="w-5 h-5" />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
