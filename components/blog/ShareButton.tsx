"use client";

import { ShareIcon } from"@heroicons/react/24/outline";

export default function ShareButton({ title, description }: { title: string; description?: string }) {
    const handleShare = async () => {
        const url = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    text: description || `Check out this story: ${title}`,
                    url,
                });
            } catch (err) {
                console.error("Error sharing:", err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(url);
                alert("Link copied to clipboard!");
            } catch (err) {
                console.error("Failed to copy:", err);
            }
        }
    };

    return (
        <button
            onClick={handleShare}
            className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 flex items-center justify-center hover:bg-brand-azure dark:hover:bg-brand-azure hover:text-white transition-all shadow-sm"
            aria-label="Share this story"
        >
            <ShareIcon className="w-5 h-5 text-brand-blue dark:text-brand-azure dark:text-white" />
        </button>
    );
}
