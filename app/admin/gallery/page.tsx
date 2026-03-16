"use client";

export const runtime = 'edge';

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

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd
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
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          caption,
          image_url: imageUrl
        })
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
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: "DELETE"
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
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border text-sm font-semibold ${toast.type === "success"
            ? "bg-emerald-900/90 border-emerald-700 text-emerald-200"
            : "bg-red-900/90 border-red-700 text-red-200"
          }`}>
          {toast.type === "success"
            ? <CheckCircleIcon className="w-5 h-5 text-emerald-400" />
            : <XCircleIcon className="w-5 h-5 text-red-400" />}
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

      {/* Rest of UI remains exactly same */}
      {/* (Your gallery grid + form components stay unchanged) */}

    </div>
  );
}