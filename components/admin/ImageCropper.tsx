"use client";
import React, { useState, useCallback } from "react";
import Cropper, { Area } from "react-easy-crop";

// Utility to crop image
const getCroppedImg = async (imageSrc: string, pixelCrop: Area): Promise<Blob> => {
    const image = new Image();
    image.crossOrigin = "anonymous";

    await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
        image.src = imageSrc;
    });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
        throw new Error("No 2d context");
    }

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                reject(new Error("Canvas is empty"));
                return;
            }
            resolve(blob);
        }, "image/jpeg", 0.95);
    });
};

export default function ImageCropper({
    imageSrc,
    onCropCompleteAction,
    onCancel,
}: {
    imageSrc: string;
    onCropCompleteAction: (croppedImageBlob: Blob) => void;
    onCancel: () => void;
}) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const onCropComplete = useCallback((croppedArea: Area, currentCroppedAreaPixels: Area) => {
        setCroppedAreaPixels(currentCroppedAreaPixels);
    }, []);

    const handleSave = async () => {
        if (!croppedAreaPixels || isProcessing) return;
        setIsProcessing(true);
        try {
            const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
            onCropCompleteAction(croppedImageBlob);
        } catch (e) {
            console.error("Failed to crop image:", e);
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl flex flex-col relative">
                <h3 className="text-xl font-black text-brand-blue mb-4">Crop Avatar</h3>

                <div className="relative w-full h-80 bg-gray-100 rounded-2xl overflow-hidden mb-6">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        cropShape="round"
                        showGrid={false}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                    />
                </div>

                <div className="flex items-center gap-4 mb-8">
                    <span className="text-sm font-bold text-brand-gray">Zoom</span>
                    <input
                        type="range"
                        min={1}
                        max={3}
                        step={0.1}
                        value={zoom}
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="w-full accent-brand-gold h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                </div>

                <div className="flex justify-end gap-3 mt-auto">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-3 rounded-xl font-bold border-2 border-gray-100 text-gray-500 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={isProcessing}
                        className="px-8 py-3 rounded-xl font-bold bg-brand-gold text-brand-blue hover:bg-yellow-500 transition-colors shadow-md disabled:opacity-50 flex items-center gap-2"
                    >
                        {isProcessing ? "Processing..." : "Save & Upload"}
                    </button>
                </div>
            </div>
        </div>
    );
}
