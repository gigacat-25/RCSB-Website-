"use client";
export const runtime = 'edge';

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { isAdmin } from "@/lib/admin";
import { PlusIcon, PencilIcon, TrashIcon, CheckIcon, XMarkIcon, MagnifyingGlassIcon, Bars2Icon } from "@heroicons/react/24/outline";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableRow({ member, confirmDeleteId, setConfirmDeleteId, handleDelete, deleting, isDragEnabled }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: member.id, disabled: !isDragEnabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    position: isDragging ? 'relative' : 'static',
  } as React.CSSProperties;

  return (
    <tr ref={setNodeRef} style={style} className={`border-b border-gray-100 bg-white transition-colors ${isDragging ? 'shadow-xl outline outline-1 outline-brand-gold relative z-50' : 'hover:bg-gray-50'}`}>
      <td className="p-4 w-12 text-center">
        {isDragEnabled ? (
          <button {...attributes} {...listeners} className="cursor-grab hover:bg-gray-100 p-1.5 rounded-lg text-gray-400 hover:text-brand-blue transition-colors outline-none focus:ring-2 focus:ring-brand-gold">
            <Bars2Icon className="w-5 h-5" />
          </button>
        ) : (
          <span className="w-8 h-8 inline-flex items-center justify-center text-gray-300 opacity-50"><Bars2Icon className="w-5 h-5" /></span>
        )}
      </td>
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
  );
}

export default function AdminTeamPage() {
  const router = useRouter();
  const { isLoaded, user } = useUser();
  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);

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
        // ensure correct initial ordering
        data.sort((a: any, b: any) => a.order_index - b.order_index);
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

  const filteredMembers = members.filter((m: any) =>
    m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isDragEnabled = searchQuery === "";

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = members.findIndex((m: any) => m.id === active.id);
      const newIndex = members.findIndex((m: any) => m.id === over.id);

      const newMembers = arrayMove(members, oldIndex, newIndex);
      setMembers(newMembers);
      setHasChanges(true);
    }
  };

  const handleSaveOrder = async () => {
    setSavingOrder(true);
    const updatePayload = members.map((m: any, index: number) => ({
      id: m.id,
      order_index: index + 1 // 1-based indexing for display safety
    }));

    try {
      const res = await fetch("/api/admin/team/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload)
      });
      if (!res.ok) throw new Error("Failed to save reorder");
      setHasChanges(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save reorder. Please try again.");
    } finally {
      setSavingOrder(false);
    }
  };

  return (
    <div className="py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-heading font-bold text-brand-blue">Team Leadership</h2>
          <p className="text-brand-gray mt-1">Drag and drop to reorder the Board of Directors.</p>
        </div>
        <div className="flex items-center gap-3">
          {hasChanges && (
            <button
              onClick={handleSaveOrder}
              disabled={savingOrder}
              className="flex items-center gap-2 px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full transition-colors whitespace-nowrap shadow-md hover:shadow-lg disabled:opacity-50"
            >
              <CheckIcon className="w-5 h-5" />
              {savingOrder ? "Saving..." : "Save Order"}
            </button>
          )}
          <Link
            href="/admin/team/add"
            className="flex items-center gap-2 px-6 py-2 bg-brand-gold hover:bg-yellow-500 text-brand-blue font-bold rounded-full transition-colors whitespace-nowrap shadow-md hover:shadow-lg"
          >
            <PlusIcon className="w-5 h-5" />
            Add Member
          </Link>
        </div>
      </div>

      <div className="mb-6 relative w-full md:w-96">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search records... (disables reordering)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold sm:text-sm transition-shadow"
        />
      </div>

      {loading ? (
        <div className="text-center py-20 font-bold text-brand-blue">Loading team roster...</div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border-l-4 border-red-500 font-semibold">{error}</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-brand-gray font-bold text-sm tracking-wider uppercase">
                  <th className="p-4 w-12 text-center">Drag</th>
                  <th className="p-4">Name & Profile</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Period</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <SortableContext items={filteredMembers.map((m: any) => m.id)} strategy={verticalListSortingStrategy}>
                <tbody>
                  {filteredMembers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-500">
                        No team members found.
                      </td>
                    </tr>
                  ) : (
                    filteredMembers.map((member: any) => (
                      <SortableRow
                        key={member.id}
                        member={member}
                        confirmDeleteId={confirmDeleteId}
                        setConfirmDeleteId={setConfirmDeleteId}
                        handleDelete={handleDelete}
                        deleting={deleting}
                        isDragEnabled={isDragEnabled}
                      />
                    ))
                  )}
                </tbody>
              </SortableContext>
            </table>
          </DndContext>
        </div>
      )}
    </div>
  );
}
