"use client";
export const runtime = 'edge';

import { useState, useEffect } from "react";
import Link from "next/link";
import { PlusIcon, PencilIcon, TrashIcon, CheckIcon, XMarkIcon, ClockIcon, Bars2Icon } from "@heroicons/react/24/outline";

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

function SortableRow({ item, confirmDeleteId, setConfirmDeleteId, handleDelete, deleting }: any) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        position: isDragging ? 'relative' : 'static',
    } as React.CSSProperties;

    return (
        <tr ref={setNodeRef} style={style} className={`border-b border-gray-100 bg-white transition-colors ${isDragging ? 'shadow-xl outline outline-1 outline-brand-gold relative z-50' : 'hover:bg-gray-50'}`}>
            <td className="p-4 w-12 text-center">
                <button {...attributes} {...listeners} className="cursor-grab hover:bg-gray-100 p-1.5 rounded-lg text-gray-400 hover:text-brand-blue transition-colors outline-none focus:ring-2 focus:ring-brand-gold">
                    <Bars2Icon className="w-5 h-5" />
                </button>
            </td>
            <td className="p-4">
                <div className="flex items-center gap-4">
                    {item.image_url ? (
                        <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 shrink-0">
                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 shrink-0 flex items-center justify-center bg-white p-2">
                            <img src="/favicon.png" alt={item.name} className="w-full h-full object-contain grayscale" />
                        </div>
                    )}
                    <div>
                        <div className="font-bold text-brand-blue text-base">{item.name}</div>
                    </div>
                </div>
            </td>
            <td className="p-4 text-gray-600 font-semibold">{item.period}</td>
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
                            href={`/admin/past-presidents/${item.id}`}
                            className="p-2 text-brand-azure hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center"
                            title="Edit"
                        >
                            <PencilIcon className="w-5 h-5" />
                        </Link>
                        <button
                            onClick={() => setConfirmDeleteId(item.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
                            title="Delete"
                        >
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </td>
        </tr>
    );
}

export default function AdminPastPresidentsPage() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [savingOrder, setSavingOrder] = useState(false);

    const fetchItems = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/admin/past-presidents");
            if (res.ok) {
                const data = await res.json();
                data.sort((a: any, b: any) => a.order_index - b.order_index);
                setItems(data);
            }
        } catch (error) {
            console.error("Failed to fetch past presidents:", error);
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
            const res = await fetch(`/api/admin/past-presidents/${id}`, { method: "DELETE" });
            if (res.ok) {
                setItems(items.filter(item => item.id !== id));
                setConfirmDeleteId(null);
            } else {
                alert("Failed to delete past president.");
            }
        } catch (error) {
            console.error(error);
            alert("Error deleting past president.");
        } finally {
            setDeleting(false);
        }
    };

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: any) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex((m: any) => m.id === active.id);
            const newIndex = items.findIndex((m: any) => m.id === over.id);

            const newItems = arrayMove(items, oldIndex, newIndex);
            setItems(newItems);
            setHasChanges(true);
        }
    };

    const handleSaveOrder = async () => {
        setSavingOrder(true);
        const updatePayload = items.map((item: any, index: number) => ({
            id: item.id,
            order_index: index + 1
        }));

        try {
            const res = await fetch("/api/admin/past-presidents/reorder", {
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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-heading font-bold text-brand-blue flex items-center gap-3">
                        <ClockIcon className="w-8 h-8 text-brand-gold" />
                        Manage Past Presidents
                    </h2>
                    <p className="text-brand-gray mt-1">
                        Drag and drop to reorder the club's past leadership lineage.
                    </p>
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
                        href="/admin/past-presidents/add"
                        className="flex items-center gap-2 px-6 py-2 bg-brand-gold hover:bg-yellow-500 text-brand-blue font-bold rounded-full transition-colors whitespace-nowrap shadow-md hover:shadow-lg"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Add Past President
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-brand-gray font-bold text-sm tracking-wider uppercase">
                                <th className="p-4 w-12 text-center">Drag</th>
                                <th className="p-4">Name & Profile</th>
                                <th className="p-4">Period</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <SortableContext items={items.map((m: any) => m.id)} strategy={verticalListSortingStrategy}>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-brand-blue font-bold">
                                            Loading past presidents...
                                        </td>
                                    </tr>
                                ) : items.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-12 text-center text-gray-500">
                                            <div className="text-lg font-bold mb-2">No past presidents found.</div>
                                            <p>Add your club's past leaders to remember their legacy.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    items.map((item: any) => (
                                        <SortableRow
                                            key={item.id}
                                            item={item}
                                            confirmDeleteId={confirmDeleteId}
                                            setConfirmDeleteId={setConfirmDeleteId}
                                            handleDelete={handleDelete}
                                            deleting={deleting}
                                        />
                                    ))
                                )}
                            </tbody>
                        </SortableContext>
                    </table>
                </DndContext>
            </div>
        </div>
    );
}
