"use client";
export const runtime = 'edge';


import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { isAdmin } from "@/lib/admin";
import { PlusIcon, PencilIcon, TrashIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function AdminTeamPage() {
  const router = useRouter();
  const { isLoaded, user } = useUser();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Role Protection
  useEffect(() => {
    if (isLoaded && user) {
      const email = user.primaryEmailAddress?.emailAddress;
      if (!isAdmin(email, user?.publicMetadata?.role)) {
        router.push("/admin");
      }
    }
  }, [isLoaded, user, router]);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch("/api/admin/team");
        if (!res.ok) throw new Error("Failed to fetch team");
        const data = await res.json();
        setMembers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  const handleDelete = async (id: number) => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/team/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setMembers(members.filter((m: any) => m.id !== id));
      setConfirmDeleteId(null);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-heading font-bold text-brand-blue">Team Leadership</h2>
          <p className="text-brand-gray mt-1">Manage the Board of Directors and key tenure roles.</p>
        </div>
        <Link
          href="/admin/team/add"
          className="flex items-center gap-2 px-6 py-2 bg-brand-gold hover:bg-yellow-500 text-brand-blue font-bold rounded-full transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          Add Member
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-20 font-bold text-brand-blue">Loading team roster...</div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border-l-4 border-red-500 font-semibold">{error}</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-brand-gray font-bold text-sm tracking-wider uppercase">
                <th className="p-4">Name & Profile</th>
                <th className="p-4">Role</th>
                <th className="p-4">Period</th>
                <th className="p-4">Order Index</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    No team members found. Start by adding the President!
                  </td>
                </tr>
              ) : (
                members.map((member: any) => (
                  <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={member.image_url || "/favicon.png"}
                          alt={member.name}
                          className={`w-10 h-10 rounded-full border border-gray-100 ${member.image_url ? 'object-cover' : 'object-contain p-2 bg-gray-50'}`}
                        />
                        <div className="font-bold text-brand-blue">{member.name}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                        {member.role}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600 font-semibold">{member.period}</td>
                    <td className="p-4">
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold font-mono">
                        {member.order_index ?? 0}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {confirmDeleteId === member.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-sm text-red-600 font-semibold mr-1">Delete?</span>
                          <button
                            onClick={() => handleDelete(member.id)}
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
                            href={`/admin/team/${member.id}`}
                            className="p-2 text-brand-azure hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <PencilIcon className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => setConfirmDeleteId(member.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
      )}
    </div>
  );
}


