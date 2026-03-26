"use client";

import { useEffect, useState } from "react";

export default function LoadingScreen() {
    const [isLoading, setIsLoading] = useState(true);
    const [fade, setFade] = useState(false);

    useEffect(() => {
        const handleLoad = () => {
            setFade(true);
            setTimeout(() => setIsLoading(false), 500);
        };

        // Failsafe: Hide loading screen after 5 seconds no matter what
        const failsafe = setTimeout(handleLoad, 5000);

        if (document.readyState === "complete") {
            setTimeout(handleLoad, 300);
            clearTimeout(failsafe);
        } else {
            window.addEventListener("load", handleLoad);
            return () => {
                window.removeEventListener("load", handleLoad);
                clearTimeout(failsafe);
            };
        }
    }, []);

    if (!isLoading) return null;

    return (
        <div
            className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-brand-light transition-opacity duration-500 ease-in-out ${fade ? "opacity-0" : "opacity-100"}`}
        >
            <div className="relative flex flex-col items-center">
                {/* Glowing effect behind logo */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-brand-gold/20 blur-3xl rounded-full animate-pulse" />

                {/* Logo */}
                <img
                    src="/logo.png"
                    alt="RCSB Logo"
                    className="h-28 w-auto object-contain animate-bounce relative z-10"
                />

                {/* Loading text and dots */}
                <div className="mt-8 flex flex-col items-center gap-3">
                    <div className="text-sm font-bold uppercase tracking-[0.2em] text-brand-blue flex items-center justify-center">
                        Loading
                        <span className="flex w-6 relative ml-1">
                            <span className="absolute animate-[bounce_1s_infinite_0ms] rounded-full w-1 h-1 bg-brand-gold" style={{ left: '0' }} />
                            <span className="absolute animate-[bounce_1s_infinite_200ms] rounded-full w-1 h-1 bg-brand-gold" style={{ left: '8px' }} />
                            <span className="absolute animate-[bounce_1s_infinite_400ms] rounded-full w-1 h-1 bg-brand-gold" style={{ left: '16px' }} />
                        </span>
                    </div>

                    <div className="w-32 h-[2px] bg-brand-gold/20 rounded-full overflow-hidden relative">
                        <div className="absolute top-0 left-0 h-full w-1/3 bg-brand-gold rounded-full animate-[custom-progress_1.5s_ease-in-out_infinite]" />
                    </div>
                </div>
            </div>
        </div>
    );
}
