"use client";
export const runtime = 'edge';


import { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { isAdmin } from "@/lib/admin";
import { PlusIcon, PencilIcon, TrashIcon, LinkIcon, BookOpenIcon, SparklesIcon, CheckIcon, XMarkIcon, MagnifyingGlassIcon, NewspaperIcon } from "@heroicons/react/24/outline";

export default function AdminBlogsPage() {
  const { user, isLoaded } = useUser();
  const [userIsAdmin, setIsUserAdmin] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      const email = user.primaryEmailAddress?.emailAddress;
      const admin = isAdmin(email, user?.publicMetadata?.role);
      setIsUserAdmin(admin);
    } else if (isLoaded && !user) {
      setIsUserAdmin(false);
    }
  }, [isLoaded, user]);

  const [items, setItems] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/projects"); // Blogs are still stored in projects table
      if (res.ok) {
        const data = await res.json();
        // Filter for only blogs
        const blogs = data.filter((item: any) => item.type === 'blog');
        setItems(blogs);
      }
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id: number) => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems(items.filter(item => item.id !== id));
        setConfirmDeleteId(null);
      } else if (res.status === 403) {
        setConfirmDeleteId(null);
        alert("Action Denied: You can only delete stories that you have created.");
      } else {
        const data = await res.json();
        setConfirmDeleteId(null);
        alert(data.error || "Failed to delete blog post.");
      }
    } catch (error) {
      console.error(error);
      setConfirmDeleteId(null);
      alert("Error deleting blog post.");
    } finally {
      setDeleting(false);
    }
  };

  const filteredItems = items.filter((item: any) =>
    item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-heading font-bold text-brand-blue flex items-center gap-3">
            {userIsAdmin ? (
              <BookOpenIcon className="w-8 h-8 text-brand-gold" />
            ) : (
              <SparklesIcon className="w-8 h-8 text-brand-gold" />
            )}
            {userIsAdmin ? "Blog Management" : "My Stories"}
          </h2>
          <p className="text-brand-gray mt-1">
            {userIsAdmin
              ? "Manage all club stories and community contributions."
              : `Welcome back, ${user?.firstName || 'Storyteller'}! Manage your experiences and impact.`}
          </p>
        </div>
        <Link
          href="/admin/blogs/add"
          className="flex items-center gap-2 px-6 py-2 bg-brand-gold hover:bg-yellow-500 text-brand-blue font-bold rounded-full transition-colors whitespace-nowrap shadow-md hover:shadow-lg"
        >
          <PlusIcon className="w-5 h-5" />
          {userIsAdmin ? "Create New Post" : "Share a New Story"}
        </Link>
      </div>

      <div className="mb-6 relative w-full md:w-96">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by title or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold sm:text-sm transition-shadow"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-brand-gray font-bold text-sm tracking-wider uppercase">
              <th className="p-4">Title & URL</th>
              <th className="p-4 hidden sm:table-cell">Category</th>
              <th className="p-4 hidden md:table-cell">Published</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500 font-bold">
                  Loading blogs...
                </td>
              </tr>
            ) : filteredItems.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-12 text-center text-gray-500">
                  <div className="text-lg font-bold mb-2">No blog posts found.</div>
                  <p>Share your first story with the world!</p>
                </td>
              </tr>
            ) : (
              filteredItems.map((item: any) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-brand-blue text-lg mb-1">{item.title}</div>
                    <div className="flex items-center gap-2 text-xs text-brand-gray font-mono">
                      <LinkIcon className="w-3 h-3" /> /blogs/{item.slug}
                    </div>
                  </td>
                  <td className="p-4 hidden sm:table-cell">
                    <span className="bg-brand-cranberry/10 text-brand-cranberry border border-brand-cranberry/20 px-3 py-1 rounded-full text-xs font-bold inline-block">
                      {item.category}
                    </span>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <div className="text-sm font-semibold text-brand-gray">{item.year}</div>
                  </td>
                  <td className="p-4 text-right">
                    {confirmDeleteId === item.id ? (
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-sm text-red-600 font-semibold mr-1">Delete?</span>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deleting}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white text-sm font-bold rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                        >
                          <CheckIcon className="w-4 h-4" /> Yes
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-gray-200 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          <XMarkIcon className="w-4 h-4" /> No
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/blogs/${item.id}`}
                          className="p-2 text-brand-azure hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center"
                          title="Edit Post"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </Link>
                        <Link
                          href={`/admin/newsletter?subject=${encodeURIComponent(
                            `New Story: ${item.title}`
                          )}&body=${encodeURIComponent(
                            `<p>Hello! We've just published a new story: <b>${item.title}</b>.</p><p><a href='https://rcsb.in/blogs/${item.slug}'>Read the full story here →</a></p>`
                          )}`}
                          className="p-2 text-brand-gold hover:bg-yellow-50 rounded-lg transition-colors flex items-center justify-center"
                          title="Share Story with Subscribers"
                        >
                          <NewspaperIcon className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => setConfirmDeleteId(item.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
                          title="Delete Post"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
