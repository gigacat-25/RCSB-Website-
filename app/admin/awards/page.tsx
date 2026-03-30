"use client";
export const runtime = "edge";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { isAdmin } from "@/lib/admin";
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  LinkIcon, 
  CheckIcon, 
  XMarkIcon, 
  MagnifyingGlassIcon, 
  TrophyIcon, 
  NewspaperIcon,
  ArchiveBoxIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline";

export default function AdminAwardsPage() {
  const router = useRouter();
  const { isLoaded, user } = useUser();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active"); // 'active', 'trash'
  const [confirmId, setConfirmId] = useState<{id: number, type: 'delete' | 'permanent' | 'restore'} | null>(null);
  const [processing, setProcessing] = useState(false);
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
        // Filter solely for awards
        setItems(data.filter((i: any) => i.type === 'award'));
      }
    } catch (error) {
      console.error("Failed to fetch awards:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id: number, permanent: boolean = false) => {
    setProcessing(true);
    try {
      const res = await fetch(`/api/admin/projects/${id}${permanent ? '?permanent=true' : ''}`, { method: "DELETE" });
      if (res.ok) {
        const data = await res.json();
        if (permanent || data.movedToBin) {
          if (permanent) {
            setItems(items.filter(item => item.id !== id));
          } else {
            setItems(items.map(item => item.id === id ? { ...item, status: 'trash' } : item));
          }
          setConfirmId(null);
        }
      } else {
        alert("Failed to delete award.");
      }
    } catch (error) {
      console.error(error);
      alert("Error deleting award.");
    } finally {
      setProcessing(false);
    }
  };

  const handleRestore = async (item: any) => {
    setProcessing(true);
    try {
      const res = await fetch(`/api/admin/projects/${item.id}`, { 
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...item,
          status: 'completed' 
        })
      });
      if (res.ok) {
        setItems(items.map(i => i.id === item.id ? { ...i, status: 'completed' } : i));
        setConfirmId(null);
      } else {
        alert("Failed to restore award.");
      }
    } catch (error) {
      console.error(error);
      alert("Error restoring award.");
    } finally {
      setProcessing(false);
    }
  };

  const filteredItems = items.filter(item => {
    const isTrashed = item.status === 'trash';
    const tabMatch = activeTab === 'trash' ? isTrashed : !isTrashed;
    const searchMatch = item.title?.toLowerCase().includes(searchQuery.toLowerCase()) || item.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return tabMatch && searchMatch;
  });

  return (
    <div className="py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-heading font-bold text-brand-blue flex items-center gap-3">
            <TrophyIcon className="w-8 h-8 text-brand-gold" />
            Awards & Milestones
          </h2>
          <p className="text-brand-gray mt-1">Manage club honors and prestigious recognitions.</p>
        </div>
        <Link
          href="/admin/awards/add"
          className="flex items-center gap-2 px-6 py-2 bg-brand-gold hover:bg-yellow-500 text-brand-blue font-bold rounded-full transition-colors whitespace-nowrap"
        >
          <PlusIcon className="w-5 h-5" />
          Add New Award
        </Link>
      </div>

      <div className="flex space-x-2 border-b border-gray-200 mb-6 overflow-x-auto pb-1">
        {[
          { id: 'active', label: 'Active Awards', icon: TrophyIcon },
          { id: 'trash', label: 'Trash Bin', icon: ArchiveBoxIcon }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-bold text-sm tracking-wide transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${activeTab === tab.id
              ? 'border-brand-blue text-brand-blue'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label} ({
              tab.id === 'trash' 
                ? items.filter(i => i.status === 'trash').length 
                : items.filter(i => i.status !== 'trash').length
            })
          </button>
        ))}
      </div>

      <div className="mb-6 relative w-full md:w-96">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search awards..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold sm:text-sm transition-shadow"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-brand-gray font-bold text-sm tracking-wider uppercase">
              <th className="p-4">Award Title</th>
              <th className="p-4 hidden sm:table-cell">Category</th>
              <th className="p-4 hidden md:table-cell">{activeTab === 'trash' ? 'Deleted Date' : 'Year'}</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500 font-bold">
                  Loading awards...
                </td>
              </tr>
            ) : filteredItems.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-12 text-center text-gray-500">
                  <div className="text-lg font-bold mb-2">
                    {activeTab === 'trash' ? 'No awards in trash.' : 'No active awards found.'}
                  </div>
                  {activeTab !== 'trash' && <p>Click "Add New Award" to document a club milestone.</p>}
                </td>
              </tr>
            ) : (
              filteredItems.map((item: any) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-brand-blue text-lg mb-1">{item.title}</div>
                    <div className="flex items-center gap-2 text-xs text-brand-gray font-mono">
                      <LinkIcon className="w-3 h-3" /> /awards/{item.slug}
                    </div>
                  </td>
                  <td className="p-4 hidden sm:table-cell">
                    <span className="bg-amber-50 text-amber-900 border border-amber-100 px-3 py-1 rounded-full text-xs font-bold inline-block">
                      {item.category}
                    </span>
                  </td>
                  <td className="p-4 hidden md:table-cell font-bold text-brand-blue">
                    {activeTab === 'trash' 
                      ? new Date(item.updated_at).toLocaleDateString()
                      : item.year
                    }
                  </td>
                  <td className="p-4 text-right">
                    {confirmId?.id === item.id && confirmId ? (
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-sm font-semibold mr-1">
                          {confirmId.type === 'restore' ? 'Restore?' : 'Delete?'}
                        </span>
                        <button
                          onClick={() => {
                            if (!confirmId) return;
                            if (confirmId.type === 'restore') handleRestore(item);
                            else handleDelete(item.id, confirmId.type === 'permanent');
                          }}
                          disabled={processing}
                          className={`flex items-center gap-1 px-3 py-1.5 text-white text-sm font-bold rounded-lg transition-colors disabled:opacity-50 ${
                            confirmId?.type === 'restore' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-red-500 hover:bg-red-600'
                          }`}
                        >
                          <CheckIcon className="w-4 h-4" /> Yes
                        </button>
                        <button
                          onClick={() => setConfirmId(null)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-gray-200 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          <XMarkIcon className="w-4 h-4" /> No
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        {item.status === 'trash' ? (
                          <>
                            <button
                              onClick={() => setConfirmId({ id: item.id, type: 'restore' })}
                              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors flex items-center justify-center"
                              title="Restore Award"
                            >
                              <ArrowPathIcon className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => setConfirmId({ id: item.id, type: 'permanent' })}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center"
                              title="Delete Permanently"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </>
                        ) : (
                          <>
                            <Link
                              href={`/admin/newsletter?subject=${encodeURIComponent(`🏆 ${item.title}`)}&body=${encodeURIComponent(`<p>Dear Rotaract Family,</p><p>We are proud to share that <b>${item.title}</b> has been awarded to Rotaract Club of Swarna Bengaluru for the year ${item.year}.</p><p>${item.description || ''}</p><p><a href='https://rcsb-website.pages.dev/awards/${item.slug}'>Read more →</a></p><p>Yours in Service,<br/>Rotaract Club of Swarna Bengaluru</p>`)}`}
                              className="p-2 text-brand-gold hover:bg-amber-50 rounded-lg transition-colors flex items-center justify-center"
                              title="Send Newsletter"
                            >
                              <NewspaperIcon className="w-5 h-5" />
                            </Link>
                            <Link
                              href={`/admin/awards/${item.id}`}
                              className="p-2 text-brand-azure hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center"
                              title="Edit Award"
                            >
                              <PencilIcon className="w-5 h-5" />
                            </Link>
                            <button
                              onClick={() => setConfirmId({ id: item.id, type: 'delete' })}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
                              title="Move to Bin"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </>
                        )}
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
