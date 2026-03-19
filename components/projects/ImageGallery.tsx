"use client";

import { useState } from "react";
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function ImageGallery({ images, title, isBlogLayout = false }: { images: string[], title: string, isBlogLayout?: boolean }) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!images || images.length === 0) return null;

    const fixImageUrl = (url: string | null | undefined) => {
        if (!url) return "/Images/placeholder.jpg";
        if (url.includes("media.rcsb.in/")) {
            const key = url.split("media.rcsb.in/").pop();
            return `https://rcsb-api-worker.impact1-iceas.workers.dev/media/${key}`;
        }
        return url;
    };

    const openModal = (index: number) => {
        setCurrentIndex(index);
        setIsOpen(true);
        document.body.style.overflow = "hidden"; // Prevent background scrolling
    };

    const closeModal = () => {
        setIsOpen(false);
        document.body.style.overflow = "auto";
    };

    const showNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const showPrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <>
            <div className={isBlogLayout ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "grid grid-cols-2 md:grid-cols-3 gap-6"}>
                {images.map((url, idx) => (
                    <div
                        key={idx}
                        className={`overflow-hidden shadow-sm hover:shadow-xl transition-all group cursor-pointer relative ${isBlogLayout
                                ? (idx % 3 === 0 ? "md:col-span-2 aspect-[16/9] rounded-[32px]" : "aspect-square rounded-[32px]")
                                : "aspect-square rounded-3xl border border-gray-100"
                            }`}
                        onClick={() => openModal(idx)}
                    >
                        <img
                            src={fixImageUrl(url)}
                            alt={`${title} Gallery ${idx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                        />
                        {isBlogLayout && (
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        )}
                    </div>
                ))}
            </div>

            {isOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-8"
                    onClick={closeModal}
                >
                    {images.length > 1 && (
                        <button
                            className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 p-3 text-white hover:bg-white/20 rounded-full transition-colors z-50 backdrop-blur-md"
                            onClick={showPrev}
                        >
                            <ChevronLeftIcon className="w-8 h-8 md:w-10 md:h-10" />
                        </button>
                    )}

                    {images.length > 1 && (
                        <button
                            className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 p-3 text-white hover:bg-white/20 rounded-full transition-colors z-50 backdrop-blur-md"
                            onClick={showNext}
                        >
                            <ChevronRightIcon className="w-8 h-8 md:w-10 md:h-10" />
                        </button>
                    )}

                    <button
                        className="absolute top-4 md:top-10 right-4 md:right-10 p-3 text-white hover:bg-white/20 rounded-full transition-colors z-50 backdrop-blur-md"
                        onClick={closeModal}
                    >
                        <XMarkIcon className="w-8 h-8 md:w-10 md:h-10" />
                    </button>

                    <div
                        className="relative max-w-6xl w-full h-full flex flex-col items-center justify-center animate-fade-in"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={fixImageUrl(images[currentIndex])}
                            alt={`${title} Gallery ${currentIndex + 1}`}
                            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                        />
                    </div>

                    <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 text-white/80 font-mono text-sm tracking-widest backdrop-blur-md bg-black/40 px-4 py-1.5 rounded-full z-50">
                        {currentIndex + 1} / {images.length}
                    </div>
                </div>
            )}
        </>
    );
}
