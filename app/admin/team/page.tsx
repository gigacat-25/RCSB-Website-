"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { isAdmin } from "@/lib/admin";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function AdminTeamPage() {
  const router = useRouter();
  const { isLoaded, user } = useUser();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Role Protection
  useEffect(() => {
    if (isLoaded && user) {
      const email = user.primaryEmailAddress?.emailAddress;
      if (!isAdmin(email)) {
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
    if (!confirm("Are you sure you want to delete this member?")) return;
    try {
      const res = await fetch(`/api/admin/team/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setMembers(members.filter((m: any) => m.id !== id));
    } catch (err: any) {
      alert(err.message);
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
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    No team members found. Start by adding the President!
                  </td>
                </tr>
              ) : (
                members.map((member: any) => (
                  <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={member.image_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"} 
                          alt="" 
                          className="w-10 h-10 rounded-full border border-gray-100 object-cover"
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
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/admin/team/${member.id}`} 
                          className="p-2 text-brand-azure hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(member.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
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
