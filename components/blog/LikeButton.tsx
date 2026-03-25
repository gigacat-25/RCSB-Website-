"use client";

import { useState } from "react";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { API_URL } from "@/lib/api";

export default function LikeButton({ projectId, initialLikes }: { projectId: number, initialLikes: number }) {
    const [likes, setLikes] = useState(initialLikes || 0);
    const [liked, setLiked] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLike = async () => {
        if (liked || loading) return; // Prevent multiple likes in the same browser session

        setLoading(true);
        // Optimistic UI update
        setLikes(prev => prev + 1);
        setLiked(true);

        try {
            const res = await fetch(`/api/projects/${projectId}/like`, {
                method: "POST"
            });
            if (res.ok) {
                const data = await res.json();
                if (data && typeof data.likes === 'number') {
                    setLikes(data.likes);
                }
            }
        } catch (err) {
            console.error("Failed to like:", err);
            // Revert optimistic update
            setLikes(prev => prev - 1);
            setLiked(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleLike}
            disabled={liked || loading}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all shadow-sm cursor-pointer
        ${liked
                    ? "bg-red-50 border-red-200 text-red-500"
                    : "bg-white border-gray-200 text-brand-gray hover:border-red-200 hover:text-red-500 hover:shadow-md"
                }`}
        >
            {liked ? (
                <HeartSolid className="w-5 h-5 text-red-500 animate-fade-in" />
            ) : (
                <HeartOutline className="w-5 h-5" />
            )}
            <span className="font-bold text-sm">{likes} {likes === 1 ? 'Like' : 'Likes'}</span>
        </button>
    );
}
