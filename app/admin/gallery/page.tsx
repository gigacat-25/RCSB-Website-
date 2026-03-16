"use client";

import { useState, useEffect, useRef } from "react";
import { PlusIcon, TrashIcon, PhotoIcon, ArrowUpTrayIcon, CheckCircleIcon, XCircleIcon, Bars3Icon } from "@heroicons/react/24/outline";
import { CameraIcon } from "@heroicons/react/24/solid";

interface GallerySlide {
  id: number;
  title: string;
  caption: string;
  image_url: string;
  order_index: number;
  created_at: string;
}

export default function GalleryAdminPage() {
  const [slides, setSlides] = useState<GallerySlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchSlides = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/gallery");
      const data = await res.json();
      setSlides(Array.isArray(data) ? data : []);
    } catch {
      showToast("error", "Failed to load gallery slides.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSlides(); }, []);

  const uploadFile = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setImageUrl(data.url);
      setImagePreview(data.url);
      showToast("success", "Image uploaded!");
    } catch {
      showToast("error", "Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) uploadFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageUrl) {
      showToast("error", "Title and image are required.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, caption, image_url: imageUrl }),
      });
      if (!res.ok) throw new Error("Save failed");
      showToast("success", "Slide added to gallery!");
      setTitle("");
      setCaption("");
      setImageUrl("");
      setImagePreview("");
      setShowForm(false);
      fetchSlides();
    } catch {
      showToast("error", "Failed to save slide.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Remove this slide from the gallery?")) return;
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      showToast("success", "Slide removed.");
      fetchSlides();
    } catch {
      showToast("error", "Failed to delete slide.");
    }
  };

  const resetForm = () => {
    setTitle("");
    setCaption("");
    setImageUrl("");
    setImagePreview("");
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border text-sm font-semibold transition-all ${
          toast.type === "success"
            ? "bg-emerald-900/90 border-emerald-700 text-emerald-200"
            : "bg-red-900/90 border-red-700 text-red-200"
        }`}>
          {toast.type === "success"
            ? <CheckCircleIcon className="w-5 h-5 text-emerald-400" />
            : <XCircleIcon className="w-5 h-5 text-red-400" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="border-b border-white/5 bg-slate-900/50 backdrop-blur px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center">
            <CameraIcon className="w-5 h-5 text-brand-gold" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-black text-white">Gallery Management</h1>
            <p className="text-sm text-white/40 mt-0.5">
              Manage the photo slideshow on the homepage
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-gold text-slate-950 font-bold rounded-xl hover:bg-yellow-400 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          Add Slide
        </button>
      </div>

      <div className="p-8 max-w-6xl mx-auto">
        {/* Add Slide Form */}
        {showForm && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
              <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-xl font-heading font-black text-white">Add Gallery Slide</h2>
                <button onClick={resetForm} className="text-white/40 hover:text-white text-2xl leading-none">&times;</button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                {/* Drop Zone */}
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onClick={() => fileRef.current?.click()}
                  className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all overflow-hidden group ${
                    dragOver ? "border-brand-gold bg-brand-gold/5" : "border-white/10 hover:border-white/30"
                  }`}
                  style={{ minHeight: "200px" }}
                >
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFilePick}
                  />
                  {imagePreview ? (
                    <>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">Click to replace</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 gap-3">
                      {uploading ? (
                        <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <ArrowUpTrayIcon className="w-8 h-8 text-white/30" />
                          <p className="text-white/50 text-sm">Drop an image here or click to upload</p>
                          <p className="text-white/25 text-xs">JPG, PNG, WEBP supported</p>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Or enter URL manually */}
                <div>
                  <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">
                    Or paste image URL
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => { setImageUrl(e.target.value); setImagePreview(e.target.value); }}
                    placeholder="https://..."
                    className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white/90 placeholder-white/20 text-sm focus:outline-none focus:border-brand-gold/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">
                    Title <span className="text-brand-gold">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="e.g. Youth Empowerment Summit"
                    className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white/90 placeholder-white/20 text-sm focus:outline-none focus:border-brand-gold/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">
                    Caption
                  </label>
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="A short description shown on the slide..."
                    rows={2}
                    className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white/90 placeholder-white/20 text-sm focus:outline-none focus:border-brand-gold/50 resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 py-3 border border-white/10 text-white/60 hover:text-white hover:border-white/30 font-semibold rounded-xl transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving || uploading || !imageUrl}
                    className="flex-1 py-3 bg-brand-gold text-slate-950 font-bold rounded-xl hover:bg-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm"
                  >
                    {saving ? "Saving..." : "Add to Gallery"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Current Slides Grid */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-heading font-bold text-white/80">
              Current Slides
              <span className="ml-3 text-sm font-normal text-white/30">({slides.length} total)</span>
            </h2>
            <p className="text-xs text-white/30">Slides appear on the homepage in order shown below</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3].map(i => (
                <div key={i} className="h-64 rounded-2xl bg-slate-800/50 animate-pulse" />
              ))}
            </div>
          ) : slides.length === 0 ? (
            <div className="text-center py-24 border-2 border-dashed border-white/10 rounded-3xl">
              <PhotoIcon className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/40 font-medium">No gallery slides yet</p>
              <p className="text-white/20 text-sm mt-1">Click &quot;Add Slide&quot; to upload your first photo.</p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-6 px-6 py-2.5 bg-brand-gold text-slate-950 font-bold rounded-xl hover:bg-yellow-400 transition-colors text-sm"
              >
                Add First Slide
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {slides.map((slide, idx) => (
                <div
                  key={slide.id}
                  className="group relative rounded-2xl overflow-hidden border border-white/5 bg-slate-900 hover:border-white/20 transition-all shadow-xl"
                >
                  {/* Image */}
                  <div className="relative h-48 bg-slate-800 overflow-hidden">
                    <img
                      src={slide.image_url}
                      alt={slide.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

                    {/* Order badge */}
                    <div className="absolute top-3 left-3 w-7 h-7 rounded-full bg-slate-950/80 border border-white/10 flex items-center justify-center text-xs font-black text-white/60">
                      {idx + 1}
                    </div>

                    {/* Delete btn */}
                    <button
                      onClick={() => handleDelete(slide.id)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-900/80 border border-red-700/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                    >
                      <TrashIcon className="w-4 h-4 text-red-300" />
                    </button>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <p className="text-[10px] font-black text-brand-gold uppercase tracking-widest mb-1">Feature Story</p>
                    <h3 className="text-white font-bold text-sm leading-tight mb-1 truncate">{slide.title}</h3>
                    {slide.caption && (
                      <p className="text-white/40 text-xs leading-relaxed line-clamp-2">{slide.caption}</p>
                    )}
                  </div>
                </div>
              ))}

              {/* Add more card */}
              <button
                onClick={() => setShowForm(true)}
                className="h-64 rounded-2xl border-2 border-dashed border-white/10 hover:border-brand-gold/30 hover:bg-brand-gold/5 flex flex-col items-center justify-center gap-3 transition-all group"
              >
                <PlusIcon className="w-8 h-8 text-white/20 group-hover:text-brand-gold/50 transition-colors" />
                <span className="text-white/30 text-sm group-hover:text-white/50 transition-colors">Add Slide</span>
              </button>
            </div>
          )}
        </div>

        {/* Info callout */}
        <div className="mt-8 p-5 rounded-2xl bg-blue-950/30 border border-blue-900/40">
          <div className="flex gap-3">
            <Bars3Icon className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-blue-300 font-semibold text-sm">Slides auto-rotate every 6 seconds</p>
              <p className="text-blue-400/60 text-xs mt-1">
                Slides appear in the &ldquo;Moments of Fellowship&rdquo; carousel on the homepage. 
                They rotate in the order shown above (by order index). 
                You need to <strong className="text-blue-300">redeploy the Cloudflare Worker</strong> after running the D1 migration for the first time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
