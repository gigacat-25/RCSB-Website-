"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon, PhotoIcon, XMarkIcon, PlusIcon } from "@heroicons/react/24/outline";

function AddBlogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: searchParams.get("title") || "",
    slug: "",
    category: searchParams.get("category") || "Club Stories",
    year: new Date().getFullYear().toString(),
    description: "",
    image_url: "",
    content: "",
    type: "blog",
    status: "completed",
    gallery_urls: "[]", // Stored as a JSON string
  });

  const [gallery, setGallery] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    let { name, value } = e.target;
    
    if (name === "slug") {
      value = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    }

    setFormData((prev) => {
      const newState = { ...prev, [name]: value };
      
      // Auto-generate slug from title ONLY if name is 'title'
      if (name === "title") {
        newState.slug = value.toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");
      }
      
      return newState;
    });
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingGallery(true);
    const newUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const uploadData = new FormData();
      uploadData.append("file", file);

      try {
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: uploadData,
        });
        if (res.ok) {
          const data = await res.json();
          newUrls.push(data.url);
        }
      } catch (err) {
        console.error("Gallery upload failed for a file:", err);
      }
    }

    const updatedGallery = [...gallery, ...newUrls];
    setGallery(updatedGallery);
    setFormData(prev => ({ ...prev, gallery_urls: JSON.stringify(updatedGallery) }));
    setUploadingGallery(false);
  };

  const removeGalleryImage = (index: number) => {
    const updated = gallery.filter((_, i) => i !== index);
    setGallery(updated);
    setFormData(prev => ({ ...prev, gallery_urls: JSON.stringify(updated) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || errorData.details || "Failed to create blog post");
      }
      
      router.push("/admin/blogs");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="py-6 max-w-5xl">
      <div className="mb-8">
        <Link href="/admin/blogs" className="inline-flex items-center gap-2 text-brand-gray hover:text-brand-blue mb-4 transition-colors font-semibold text-sm">
          <ArrowLeftIcon className="w-4 h-4" /> Back to Blogs
        </Link>
        <h2 className="text-3xl font-heading font-bold text-brand-blue">Create Blog Post</h2>
        <p className="text-brand-gray mt-1">Share a new story, event recap, or editorial piece.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-8 font-semibold border-l-4 border-red-500">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <input 
                    type="text" 
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="text-xl w-full bg-gray-50 border-2 border-gray-100 focus:border-brand-azure focus:ring-0 rounded-xl px-4 py-3 outline-none transition-all font-bold text-brand-blue"
                    placeholder="e.g. My Experience at the RYLA Camp"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-brand-gray uppercase tracking-widest flex items-center gap-2">
                    URL Slug
                    <span className="capitalize font-normal text-gray-400 font-mono">(rcsb.in/blogs/{formData.slug || "..."})</span>
                  </label>
                  <input 
                    type="text" 
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-50 border border-gray-100 focus:border-brand-azure focus:ring-0 rounded-lg px-4 py-2 outline-none transition-all font-mono text-sm text-brand-blue"
                    placeholder="url-slug-here"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-brand-blue uppercase tracking-wider block">Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border-2 border-gray-100 focus:border-brand-azure focus:ring-0 rounded-xl px-4 py-3 outline-none transition-all"
                    >
                      <option>Club Stories</option>
                      <option>Community Impact</option>
                      <option>Member Spotlights</option>
                      <option>Event Recap</option>
                      <option>Editorial</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-brand-blue uppercase tracking-wider block">Year / Date Label *</label>
                    <input 
                      type="text" 
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-50 border-2 border-gray-100 focus:border-brand-azure focus:ring-0 rounded-xl px-4 py-3 outline-none transition-all"
                      placeholder="e.g. March 2024"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-brand-blue uppercase tracking-wider block">Short Excerpt *</label>
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={2}
                    className="w-full bg-gray-50 border-2 border-gray-100 focus:border-brand-azure focus:ring-0 rounded-xl px-4 py-3 outline-none transition-all"
                    placeholder="A catchy summary for the blog card..."
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <label className="text-sm font-bold text-brand-blue uppercase tracking-wider block mb-4">Blog Content (Markdown)</label>
              <textarea 
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={15}
                className="w-full bg-gray-50 border-2 border-gray-100 focus:border-brand-azure focus:ring-0 rounded-xl px-4 py-4 outline-none transition-all font-mono text-sm leading-relaxed"
                placeholder="Write your story here. Use markdown for formatting..."
              ></textarea>
            </div>
          </div>

          {/* Sidebar: Media */}
          <div className="space-y-6">
            {/* Cover Image */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <label className="text-sm font-bold text-brand-blue uppercase tracking-wider block mb-4">Cover Image *</label>
              <div className="aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl overflow-hidden mb-4 relative group">
                {formData.image_url ? (
                  <img src={formData.image_url} alt="Cover Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <PhotoIcon className="w-10 h-10 mb-2 opacity-50" />
                    <span className="text-xs font-bold uppercase">No Image Selected</span>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setLoading(true);
                    const uploadData = new FormData();
                    uploadData.append("file", file);
                    try {
                      const res = await fetch("/api/admin/upload", { method: "POST", body: uploadData });
                      if (res.ok) {
                        const data = await res.json();
                        setFormData(prev => ({ ...prev, image_url: data.url }));
                      }
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
              </div>
              <p className="text-[10px] text-gray-400 font-bold uppercase mb-2">Or Paste URL</p>
              <input 
                type="url" 
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-xs outline-none focus:border-brand-azure transition-all"
                placeholder="https://..."
              />
            </div>

            {/* Gallery */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-bold text-brand-blue uppercase tracking-wider">Gallery Photos</label>
                <span className="text-[10px] font-bold text-brand-gray bg-gray-100 px-2 py-0.5 rounded-full">{gallery.length} Images</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                {gallery.map((url, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-gray-100 shadow-sm">
                    <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => removeGalleryImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                
                <div className="relative aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center hover:border-brand-azure hover:bg-white transition-all group overflow-hidden">
                  {uploadingGallery ? (
                    <div className="text-[10px] font-bold text-brand-azure animate-pulse">Uploading...</div>
                  ) : (
                    <>
                      <PlusIcon className="w-6 h-6 text-gray-300 group-hover:text-brand-azure transition-colors" />
                      <span className="text-[10px] font-bold text-gray-400 group-hover:text-brand-azure transition-colors mt-1">Add Photos</span>
                      <input 
                        type="file" 
                        multiple 
                        accept="image/*"
                        onChange={handleGalleryUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </>
                  )}
                </div>
              </div>
              <p className="text-[10px] text-gray-400 italic">Upload multiple photos to create a rich story experience.</p>
            </div>

            {/* Publish Actions */}
            <div className="bg-brand-blue p-6 rounded-3xl shadow-lg border border-blue-900 sticky top-6">
              <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Ready to publish?
              </h4>
              <button 
                type="submit" 
                disabled={loading || uploadingGallery}
                className="w-full py-4 bg-brand-gold hover:bg-yellow-500 text-brand-blue font-black rounded-2xl transition-all shadow-xl hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {loading ? "Publishing Story..." : "Publish Blog Post"}
              </button>
              <p className="text-[10px] text-blue-200 mt-4 text-center">
                This will make the post live immediately on the public website.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function AddBlogPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-brand-gray animate-pulse">Loading Editor...</div>}>
      <AddBlogContent />
    </Suspense>
  );
}
