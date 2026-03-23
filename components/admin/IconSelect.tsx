"use client";

import { useState, useRef, useEffect } from "react";
import { FaYoutube, FaInstagram, FaFacebook, FaLinkedin, FaTwitter, FaGlobe, FaGithub } from "react-icons/fa";

const ICONS = [
    { value: "none", label: "No Icon", icon: null },
    { value: "globe", label: "Website", icon: FaGlobe },
    { value: "youtube", label: "YouTube", icon: FaYoutube },
    { value: "instagram", label: "Instagram", icon: FaInstagram },
    { value: "linkedin", label: "LinkedIn", icon: FaLinkedin },
    { value: "facebook", label: "Facebook", icon: FaFacebook },
    { value: "twitter", label: "X / Twitter", icon: FaTwitter },
    { value: "github", label: "GitHub", icon: FaGithub },
];

export default function IconSelect({ value, onChange }: { value: string, onChange: (v: string) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selected = ICONS.find(i => i.value === value) || ICONS[0];
    const Icon = selected.icon;

    return (
        <div className="relative w-[180px] shrink-0" ref={ref}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between bg-gray-50 border-2 border-gray-100 hover:border-brand-azure focus:border-brand-azure rounded-xl px-4 py-2 outline-none transition-all text-sm"
            >
                <span className="flex items-center gap-2 text-brand-blue font-semibold">
                    {Icon ? <Icon className="w-4 h-4" /> : <div className="w-4 h-4 rounded-full border-2 border-gray-300" />}
                    {selected.label}
                </span>
                <span className="text-gray-400 text-xs">▼</span>
            </button>

            {isOpen && (
                <div className="absolute z-50 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden py-1">
                    {ICONS.map((item) => {
                        const ItemIcon = item.icon;
                        const isSelected = value === item.value;
                        return (
                            <button
                                key={item.value}
                                type="button"
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${isSelected
                                        ? "bg-brand-azure/10 text-brand-azure font-bold"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-brand-blue font-medium"
                                    }`}
                                onClick={() => {
                                    onChange(item.value);
                                    setIsOpen(false);
                                }}
                            >
                                {ItemIcon ? <ItemIcon className={`w-4 h-4 ${isSelected ? "text-brand-azure" : "text-gray-400"}`} /> : <div className="w-4 h-4" />}
                                {item.label}
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    );
}
