"use client";
export const runtime = 'edge';


import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { isAdmin } from "@/lib/admin";
import { PlusIcon, PencilIcon, TrashIcon, LinkIcon, CheckIcon, XMarkIcon, MagnifyingGlassIcon, NewspaperIcon } from "@heroicons/react/24/outline";

export default function AdminProjectsPage() {
  const router = useRouter();
  const { isLoaded, user } = useUser();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("project"); // 'project', 'event'
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Role Protection
  useEffect(() => {
    if (isLoaded && user) {
      const email = user.primaryEmailAddress?.emailAddress;
      const admin = isAdmin(email, user?.publicMetadata?.role);
      setIsUserAdmin(admin);
      if (!admin) {
        router.push("/admin");
      }
    }
  }, [isLoaded, user, router]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/projects?timestamp=${new Date().getTime()}`, { cache: "no-store", headers: { "Cache-Control": "no-cache" } });
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (error) {
      console.error("Failed to fetch items:", error);
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
      } else {
        setConfirmDeleteId(null);
        alert("Failed to delete item.");
      }
    } catch (error) {
      console.error(error);
      setConfirmDeleteId(null);
      alert("Error deleting item.");
    } finally {
      setDeleting(false);
    }
  };

  const filteredItems = items.filter(item => {
    const typeMatch = (item.type || 'project') === activeTab;
    const searchMatch = item.title?.toLowerCase().includes(searchQuery.toLowerCase()) || item.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return typeMatch && searchMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'ongoing': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'completed': default: return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  const getTabLabel = (tab: string) => {
    switch (tab) {
      case 'project': return 'Projects';
      case 'event': return 'Events';
      default: return 'Items';
    }
  };

  return (
    <div className="py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-heading font-bold text-brand-blue">Projects & Events</h2>
          <p className="text-brand-gray mt-1">Manage community projects and club events.</p>
        </div>
        <Link
          href="/admin/projects/add"
          className="flex items-center gap-2 px-6 py-2 bg-brand-gold hover:bg-yellow-500 text-brand-blue font-bold rounded-full transition-colors whitespace-nowrap"
        >
          <PlusIcon className="w-5 h-5" />
          Add New Entry
        </Link>
      </div>

      <div className="flex space-x-2 border-b border-gray-200 mb-6 overflow-x-auto pb-1">
        {['project', 'event'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-bold text-sm tracking-wide transition-all border-b-2 whitespace-nowrap ${activeTab === tab
              ? 'border-brand-blue text-brand-blue'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            {getTabLabel(tab)} ({items.filter(i => (i.type || 'project') === tab).length})
          </button>
        ))}
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
              <th className="p-4">Title & Details</th>
              <th className="p-4 hidden sm:table-cell">Category</th>
              <th className="p-4 hidden md:table-cell">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500 font-bold">
                  Loading content...
                </td>
              </tr>
            ) : filteredItems.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-12 text-center text-gray-500">
                  <div className="text-lg font-bold mb-2">No {getTabLabel(activeTab).toLowerCase()} found.</div>
                  <p>Click "Add New Entry" to create your first one.</p>
                </td>
              </tr>
            ) : (
              filteredItems.map((item: any) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-brand-blue text-lg mb-1">{item.title}</div>
                    <div className="flex items-center gap-2 text-xs text-brand-gray font-mono">
                      <LinkIcon className="w-3 h-3" /> /{item.type === 'project' ? 'projects' : 'events'}/{item.slug}
                    </div>
                  </td>
                  <td className="p-4 hidden sm:table-cell">
                    <span className="bg-blue-50 text-brand-blue border border-blue-100 px-3 py-1 rounded-full text-xs font-bold inline-block">
                      {item.category}
                    </span>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider inline-block ${getStatusColor(item.status)}`}>
                      {item.status || 'completed'}
                    </span>
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
                          href={`/admin/projects/${item.id}`}
                          className="p-2 text-brand-azure hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center"
                          title="Edit Entry"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </Link>
                        <Link
                          href={`/admin/newsletter?subject=${encodeURIComponent(
                            `Announcement: ${item.title}`
                          )}&body=${encodeURIComponent(
                            `<p>Hello! We're excited to announce our upcoming ${item.type || "project"
                            }: <b>${item.title}</b>.</p><p>${item.description || ""
                            }</p><p><a href='https://rcsb-website.pages.dev/${item.type === "event" ? "events" : "projects"
                            }/${item.slug}'>View details on website →</a></p>`
                          )}`}
                          className="p-2 text-brand-gold hover:bg-yellow-50 rounded-lg transition-colors flex items-center justify-center"
                          title="Blast Email to Subscribers"
                        >
                          <NewspaperIcon className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => setConfirmDeleteId(item.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
                          title="Delete Entry"
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
