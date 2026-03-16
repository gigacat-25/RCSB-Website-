"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  PlusIcon,
  TrashIcon,
  PhotoIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon,
  XCircleIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
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

  const fetchSlides = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/gallery");
      const data = await res.json();
      const nextSlides = Array.isArray(data) ? data : [];
      nextSlides.sort((a: GallerySlide, b: GallerySlide) => a.order_index - b.order_index);
      setSlides(nextSlides);
    } catch {
      showToast("error", "Failed to load gallery slides.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSlides();
  }, [fetchSlides]);

  const uploadFile = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      });

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
    if (file && file.type.startsWith("image/")) {
      uploadFile(file);
    }
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          caption,
          image_url: imageUrl,
        }),
      });

      if (!res.ok) throw new Error("Save failed");

      showToast("success", "Slide added to gallery!");
      resetForm();
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
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: "DELETE",
      });

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
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border text-sm font-semibold ${
            toast.type === "success"
              ? "bg-emerald-900/90 border-emerald-700 text-emerald-200"
              : "bg-red-900/90 border-red-700 text-red-200"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircleIcon className="w-5 h-5 text-emerald-400" />
          ) : (
            <XCircleIcon className="w-5 h-5 text-red-400" />
          )}
          {toast.msg}
        </div>
      )}

      <div className="border-b border-white/5 bg-slate-900/50 backdrop-blur px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center">
            <CameraIcon className="w-5 h-5 text-brand-gold" />
          </div>

          <div>
            <h1 className="text-2xl font-heading font-black">Gallery Management</h1>
            <p className="text-sm text-white/40">Manage the photo slideshow on the homepage</p>
          </div>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-gold text-slate-950 font-bold rounded-xl hover:bg-yellow-400"
        >
          <PlusIcon className="w-5 h-5" />
          Add Slide
        </button>
      </div>

      <div className="px-8 py-8">
        {showForm && (
          <form onSubmit={handleSubmit} className="mb-8 rounded-2xl border border-white/10 bg-slate-900/70 p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="space-y-2">
                <span className="text-sm text-white/70">Title</span>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl bg-slate-800 border border-white/10 px-4 py-3 outline-none focus:border-brand-gold"
                  placeholder="Sunday outreach in Accra"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm text-white/70">Caption</span>
                <input
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full rounded-xl bg-slate-800 border border-white/10 px-4 py-3 outline-none focus:border-brand-gold"
                  placeholder="Optional short description"
                />
              </label>
            </div>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`rounded-2xl border-2 border-dashed p-6 transition ${
                dragOver ? "border-brand-gold bg-brand-gold/10" : "border-white/20 bg-slate-900"
              }`}
            >
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFilePick} />

              <div className="flex flex-col items-center text-center gap-2">
                <ArrowUpTrayIcon className="w-8 h-8 text-white/50" />
                <p className="text-sm text-white/70">Drag and drop an image here, or</p>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10"
                >
                  Browse files
                </button>
                {uploading && <p className="text-xs text-brand-gold">Uploading...</p>}
              </div>
            </div>

            {imagePreview && (
              <div className="rounded-2xl overflow-hidden border border-white/10 max-w-xl">
                <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover" />
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                disabled={saving || uploading}
                className="px-5 py-2.5 rounded-xl bg-brand-gold text-slate-950 font-bold disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Slide"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2.5 rounded-xl border border-white/20 hover:bg-white/10"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="text-white/60">Loading slides...</div>
        ) : slides.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-10 text-center">
            <PhotoIcon className="w-10 h-10 text-white/30 mx-auto mb-3" />
            <p className="text-white/80 font-semibold">No slides yet</p>
            <p className="text-sm text-white/50">Add your first image to power the homepage gallery.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {slides.map((slide) => (
              <article key={slide.id} className="rounded-2xl overflow-hidden border border-white/10 bg-slate-900/60">
                <div className="relative">
                  <img src={slide.image_url} alt={slide.title} className="w-full h-56 object-cover" />
                  <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-black/60 text-xs flex items-center gap-1 text-white/80">
                    <Bars3Icon className="w-4 h-4" />
                    #{slide.order_index}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg line-clamp-1">{slide.title}</h3>
                  <p className="text-sm text-white/60 mt-1 min-h-[2.5rem] line-clamp-2">{slide.caption || "No caption"}</p>
                  <div className="pt-4">
                    <button
                      onClick={() => handleDelete(slide.id)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-red-500/40 text-red-300 hover:bg-red-500/10"
                    >
                      <TrashIcon className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
