"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { isAdmin } from "@/lib/admin";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

function AddProjectForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoaded, user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  const userIsAdmin = isAdmin(email);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: searchParams.get("title") || "",
    slug: (searchParams.get("title") || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""),
    category: searchParams.get("category") || "Community Service",
    year: new Date().getFullYear().toString(),
    description: "",
    image_url: "",
    content: "",
    type: "project",
    status: "completed",
  });

  // Role Adjustment: If not admin, force type to blog
  useEffect(() => {
    if (isLoaded && !userIsAdmin) {
      setFormData(prev => ({ ...prev, type: "blog" }));
    }
  }, [isLoaded, userIsAdmin]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Auto-generate slug from title if title is changed
    if (name === "title") {
      setFormData((prev) => ({
        ...prev,
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/projects", { // We will create a Next.js API route that proxies to Cloudflare
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to create project");
      
      router.push("/admin/projects");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="py-6 max-w-4xl">
      <div className="mb-8">
        <Link href={userIsAdmin ? "/admin/projects" : "/admin"} className="inline-flex items-center gap-2 text-brand-gray hover:text-brand-blue mb-4 transition-colors font-semibold text-sm">
          <ArrowLeftIcon className="w-4 h-4" /> Back to {userIsAdmin ? "Projects" : "Dashboard"}
        </Link>
        <h2 className="text-3xl font-heading font-bold text-brand-blue">
          {userIsAdmin ? (formData.type === 'blog' ? 'Add New Blog Post' : 'Add New Project') : 'Share Your Story'}
        </h2>
        <p className="text-brand-gray mt-1">
          {userIsAdmin ? 'Create a new club initiative or story to showcase.' : 'Inspire others by documenting your experience.'}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-8 font-semibold border-l-4 border-red-500">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-blue uppercase tracking-wider block">Project Title *</label>
            <input 
              type="text" 
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full bg-gray-50 border-2 border-gray-100 focus:border-brand-azure focus:ring-0 rounded-xl px-4 py-3 outline-none transition-all"
              placeholder="e.g. RYLA 2026"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-blue uppercase tracking-wider block">URL Slug *</label>
            <input 
              type="text" 
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              className="w-full bg-gray-50 border-2 border-gray-100 focus:border-brand-azure focus:ring-0 rounded-xl px-4 py-3 outline-none transition-all"
              placeholder="e.g. ryla-2026"
            />
          </div>
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
              <option>Community Service</option>
              <option>Professional Development</option>
              <option>Club Service</option>
              <option>International Service</option>
              <option>Leadership</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {userIsAdmin ? (
            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-blue uppercase tracking-wider block">Entry Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full bg-gray-50 border-2 border-gray-100 focus:border-brand-azure focus:ring-0 rounded-xl px-4 py-3 outline-none transition-all"
              >
                <option value="project">Project</option>
                <option value="blog">Blog Post</option>
                <option value="event">Upcoming Event</option>
              </select>
            </div>
          ) : null}

          {userIsAdmin ? (
            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-blue uppercase tracking-wider block">Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-gray-50 border-2 border-gray-100 focus:border-brand-azure focus:ring-0 rounded-xl px-4 py-3 outline-none transition-all"
              >
                <option value="completed">Completed</option>
                <option value="ongoing">Ongoing</option>
                <option value="upcoming">Upcoming</option>
              </select>
            </div>
          ) : null}

          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-blue uppercase tracking-wider block">Year / Term *</label>
            <input 
              type="text" 
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
              className="w-full bg-gray-50 border-2 border-gray-100 focus:border-brand-azure focus:ring-0 rounded-xl px-4 py-3 outline-none transition-all"
              placeholder="e.g. 2024-25"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-brand-blue uppercase tracking-wider block">Short Description *</label>
          <textarea 
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={2}
            className="w-full bg-gray-50 border-2 border-gray-100 focus:border-brand-azure focus:ring-0 rounded-xl px-4 py-3 outline-none transition-all"
            placeholder="A brief summary of the project for the cards..."
          ></textarea>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-bold text-brand-blue uppercase tracking-wider block">Cover Image *</label>
          
          <div className="flex items-start gap-6">
            <div className="w-48 h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl overflow-hidden flex items-center justify-center relative group">
              {formData.image_url ? (
                <>
                  <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, image_url: "" }))}
                      className="text-white text-xs font-bold bg-red-500 px-3 py-1 rounded-full shadow-lg"
                    >
                      Remove
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center p-4">
                  <div className="text-gray-400 text-xs font-bold uppercase mb-1">No Image</div>
                  <div className="text-[10px] text-gray-400">800x600 recommended</div>
                </div>
              )}
            </div>

            <div className="flex-1 space-y-3">
              <div className="relative">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    
                    setLoading(true);
                    setError(null);
                    
                    const uploadData = new FormData();
                    uploadData.append("file", file);
                    
                    try {
                      const res = await fetch("/api/admin/upload", {
                        method: "POST",
                        body: uploadData,
                      });
                      
                      if (!res.ok) throw new Error("Upload failed");
                      const data = await res.json();
                      setFormData(prev => ({ ...prev, image_url: data.url }));
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
                  className="w-full py-3 bg-gray-50 border-2 border-gray-100 text-brand-blue font-bold rounded-xl hover:bg-white hover:border-brand-azure transition-all text-sm"
                >
                  {loading ? "Uploading..." : "Click to Upload Image"}
                </button>
              </div>
              <div className="flex gap-2 items-center">
                <div className="h-px bg-gray-200 flex-1"></div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">OR</span>
                <div className="h-px bg-gray-200 flex-1"></div>
              </div>
              <input 
                type="url" 
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                className="w-full bg-gray-50 border-2 border-gray-100 focus:border-brand-azure focus:ring-0 rounded-xl px-4 py-2 outline-none transition-all text-xs"
                placeholder="Paste an external image URL instead..."
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-brand-blue uppercase tracking-wider block">Full Article Content (Markdown)</label>
          <textarea 
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={8}
            className="w-full bg-gray-50 border-2 border-gray-100 focus:border-brand-azure focus:ring-0 rounded-xl px-4 py-3 outline-none transition-all font-mono text-sm"
            placeholder="Write the full case study here..."
          ></textarea>
        </div>

        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <button 
            type="submit" 
            disabled={loading}
            className="px-8 py-3 bg-brand-blue text-white font-bold rounded-full hover:bg-blue-900 transition-colors disabled:opacity-50"
          >
            {loading ? "Publishing..." : (userIsAdmin ? "Publish Project" : "Share Story")}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function AddProjectPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center font-bold text-brand-blue">Loading form...</div>}>
      <AddProjectForm />
    </Suspense>
  );
}
