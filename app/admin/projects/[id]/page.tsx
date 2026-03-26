"use client";
export const runtime = 'edge';


import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TrashIcon, PlusIcon, PhotoIcon, XMarkIcon, ArrowLeftIcon, NewspaperIcon } from "@heroicons/react/24/outline";
import IconSelect from "@/components/admin/IconSelect";
const API_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_API_URL || "https://rcsb-api-worker.impact1-iceas.workers.dev";

// Fix images stored with media.rcsb.in (old broken domain) by rewriting to the worker's media proxy
function fixImageUrl(url: string | null | undefined): string {
  if (!url) return "";
  if (url.includes("media.rcsb.in/")) {
    const key = url.split("media.rcsb.in/").pop();
    return `${API_URL}/media/${key}`;
  }
  return url;
}

export default function EditProjectPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "",
    year: "",
    description: "",
    image_url: "",
    content: "",
    type: "project",
    status: "completed",
    gallery_urls: "[]",
    rsvp_link: "",
    event_date: "",
    featured_links: "[]",
  });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch("/api/admin/projects");
        const projects = await res.json();
        const project = projects.find((p: any) => p.id === parseInt(params.id));

        if (project) {
          setFormData({
            title: project.title,
            slug: project.slug,
            category: project.category,
            year: project.year,
            description: project.description,
            image_url: fixImageUrl(project.image_url),
            content: project.content || "",
            type: project.type || "project",
            status: project.status || "completed",
            gallery_urls: project.gallery_urls || "[]",
            rsvp_link: project.rsvp_link || "",
            event_date: project.event_date || "",
            featured_links: project.featured_links || "[]",
          });
        } else {
          setError("Project not found");
        }
      } catch (err: any) {
        setError("Failed to fetch project details");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/projects/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update project");

      router.push("/admin/projects");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this project? This action cannot be undone.")) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/projects/${params.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete project");
      router.push("/admin/projects");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setSaving(false);
    }
  };

  if (loading) return <div className="py-20 text-center font-bold text-brand-blue">Loading project details...</div>;

  return (
    <div className="py-6 max-w-4xl">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <Link href="/admin/projects" className="inline-flex items-center gap-2 text-brand-gray hover:text-brand-blue mb-4 transition-colors font-semibold text-sm">
            <ArrowLeftIcon className="w-4 h-4" /> Back to Projects
          </Link>
          <h2 className="text-3xl font-heading font-bold text-brand-blue">Edit Project</h2>
          <p className="text-brand-gray mt-1">Update the details for "{formData.title}"</p>
        </div>

        <div className="flex gap-3">
          <Link
            href={`/admin/newsletter?subject=${encodeURIComponent(`New Announcement: ${formData.title}`)}&body=${encodeURIComponent(`<p>Hello! We're excited to share an update on <b>${formData.title}</b>.</p><p>${formData.description}</p><p><a href='https://rcsb-website.pages.dev/${formData.type === 'event' ? 'events' : 'projects'}/${formData.slug}'>View on official site →</a></p>`)}`}
            className="flex items-center gap-2 px-6 py-2 bg-brand-gold/10 text-brand-gold hover:bg-brand-gold/20 font-bold rounded-full transition-colors border border-brand-gold/20"
          >
            <NewspaperIcon className="w-5 h-5" />
            Email Blast
          </Link>
          <button
            onClick={handleDelete}
            className="px-6 py-2 bg-red-50 text-red-600 hover:bg-red-100 font-bold rounded-full transition-colors border border-red-200"
          >
            Delete Project
          </button>
        </div>
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
          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-blue uppercase tracking-wider block">Entry Type *</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full bg-gray-50 border-2 border-gray-100 focus:border-brand-azure focus:ring-0 rounded-xl px-4 py-3 outline-none transition-all"
            >
              <option value="project">Project</option>
              <option value="event">Upcoming Event</option>
            </select>
          </div>

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

          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-blue uppercase tracking-wider block">Year / Date Label *</label>
            <input
              type="text"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
              className="w-full bg-gray-50 border-2 border-gray-100 focus:border-brand-azure focus:ring-0 rounded-xl px-4 py-3 outline-none transition-all"
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
          ></textarea>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-bold text-brand-blue uppercase tracking-wider block">Cover Image *</label>

          <div className="flex items-start gap-6">
            <div className="w-48 h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl overflow-hidden flex items-center justify-center relative group">
              {formData.image_url ? (
                <>
                  <img src={fixImageUrl(formData.image_url)} alt="Preview" className="w-full h-full object-cover" />
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

                    setSaving(true);
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
                      setSaving(false);
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <button
                  type="button"
                  className="w-full py-3 bg-gray-50 border-2 border-gray-100 text-brand-blue font-bold rounded-xl hover:bg-white hover:border-brand-azure transition-all text-sm"
                >
                  {saving ? "Uploading..." : "Click to Upload Image"}
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

        {/* Gallery Images Section */}
        <div className="space-y-4">
          <label className="text-sm font-bold text-brand-blue uppercase tracking-wider block">Gallery Images (Optional)</label>
          <div className="flex flex-wrap gap-4">
            {JSON.parse(formData.gallery_urls || "[]").map((url: string, index: number) => (
              <div key={index} className="w-32 h-24 bg-gray-50 border-2 border-gray-200 rounded-xl overflow-hidden relative group">
                <img src={fixImageUrl(url)} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      const current = JSON.parse(formData.gallery_urls || "[]");
                      current.splice(index, 1);
                      setFormData(prev => ({ ...prev, gallery_urls: JSON.stringify(current) }));
                    }}
                    className="text-white text-[10px] font-bold bg-red-500 px-2 py-1 rounded-full shadow-lg"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="w-32 h-24 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl overflow-hidden flex flex-col items-center justify-center relative hover:border-brand-azure transition-colors group">
              <span className="text-[10px] font-bold text-gray-400 group-hover:text-brand-azure">Select Multiple</span>
              <span className="text-xs font-black text-brand-blue group-hover:text-brand-azure mt-1">Add Photos</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={async (e) => {
                  const files = e.target.files;
                  if (!files || files.length === 0) return;

                  setSaving(true);
                  setError(null);

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

                      if (!res.ok) throw new Error(`Upload failed for ${file.name}`);
                      const data = await res.json();
                      newUrls.push(data.url);
                    } catch (err: any) {
                      setError("Partial upload failure: " + err.message);
                    }
                  }

                  if (newUrls.length > 0) {
                    const current = JSON.parse(formData.gallery_urls || "[]");
                    const updated = [...current, ...newUrls];
                    setFormData(prev => ({ ...prev, gallery_urls: JSON.stringify(updated) }));
                  }

                  setSaving(false);
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
            </div>
          </div>
        </div>

        {/* Featured Links Section */}
        <div className="space-y-4">
          <label className="text-sm font-bold text-brand-blue uppercase tracking-wider block">Featured Links (Optional)</label>
          <div className="space-y-3">
            {JSON.parse((formData as any).featured_links || "[]").map((link: { label: string, url: string, icon?: string }, index: number) => (
              <div key={index} className="flex gap-3 items-center">
                <IconSelect
                  value={link.icon || "none"}
                  onChange={(val) => {
                    const current = JSON.parse((formData as any).featured_links || "[]");
                    current[index].icon = val;
                    setFormData(prev => ({ ...prev, featured_links: JSON.stringify(current) }));
                  }}
                />
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => {
                    const current = JSON.parse((formData as any).featured_links || "[]");
                    current[index].label = e.target.value;
                    setFormData(prev => ({ ...prev, featured_links: JSON.stringify(current) }));
                  }}
                  className="w-1/3 bg-gray-50 border-2 border-gray-100 focus:border-brand-azure focus:ring-0 rounded-xl px-4 py-2 outline-none transition-all text-sm"
                  placeholder="Button Label (e.g. YouTube)"
                />
                <input
                  type="url"
                  value={link.url}
                  onChange={(e) => {
                    const current = JSON.parse((formData as any).featured_links || "[]");
                    current[index].url = e.target.value;
                    setFormData(prev => ({ ...prev, featured_links: JSON.stringify(current) }));
                  }}
                  className="flex-1 bg-gray-50 border-2 border-gray-100 focus:border-brand-azure focus:ring-0 rounded-xl px-4 py-2 outline-none transition-all text-sm"
                  placeholder="URL (https://...)"
                />
                <button
                  type="button"
                  onClick={() => {
                    const current = JSON.parse((formData as any).featured_links || "[]");
                    current.splice(index, 1);
                    setFormData(prev => ({ ...prev, featured_links: JSON.stringify(current) }));
                  }}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0 font-bold text-xs"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const current = JSON.parse((formData as any).featured_links || "[]");
                current.push({ label: "", url: "", icon: "none" });
                setFormData(prev => ({ ...prev, featured_links: JSON.stringify(current) }));
              }}
              className="text-sm font-bold text-brand-azure hover:text-blue-700 transition-colors"
            >
              + Add Featured Link
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* RSVP Link */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-blue uppercase tracking-wider block">RSVP / Ticket Link (Optional)</label>
            <input
              type="url"
              name="rsvp_link"
              value={(formData as any).rsvp_link || ""}
              onChange={handleChange}
              className="w-full bg-gray-50 border-2 border-gray-100 focus:border-brand-azure focus:ring-0 rounded-xl px-4 py-3 outline-none transition-all"
              placeholder="e.g. https://forms.gle/..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-blue uppercase tracking-wider block">Event Date (Optional)</label>
            <input
              type="date"
              name="event_date"
              value={(formData as any).event_date || ""}
              onChange={handleChange}
              className="w-full bg-gray-50 border-2 border-gray-100 focus:border-brand-azure focus:ring-0 rounded-xl px-4 py-3 outline-none transition-all"
            />
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
          ></textarea>
        </div>

        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-brand-blue text-white font-bold rounded-full hover:bg-blue-900 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
