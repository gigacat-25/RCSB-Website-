"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen() {
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Fast progress increment simulation
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                const increment = Math.floor(Math.random() * 15) + 6;
                return Math.min(100, prev + increment);
            });
        }, 120);

        const handleLoad = () => {
            setProgress(100);
            setTimeout(() => setIsLoading(false), 500);
        };

        // Failsafe: Hide loading screen after 4.5 seconds no matter what
        const failsafe = setTimeout(handleLoad, 4500);

        if (document.readyState === "complete") {
            setTimeout(handleLoad, 300);
            clearTimeout(failsafe);
        } else {
            window.addEventListener("load", handleLoad);
            return () => {
                window.removeEventListener("load", handleLoad);
                clearTimeout(failsafe);
                clearInterval(interval);
            };
        }
    }, []);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ 
                        opacity: 0, 
                        y: "-100%",
                        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
                    }}
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a1835]"
                >
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.5 }}
                        className="relative flex flex-col items-center"
                    >
                        {/* Glowing effect behind logo */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-brand-gold/15 blur-[80px] rounded-full animate-pulse-soft" />

                        {/* Logo */}
                        <motion.img
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            src="/logo.png"
                            alt="RCSB Logo"
                            className="h-28 w-auto object-contain relative z-10 filter brightness-110"
                        />

                        {/* Loading progress and percentage */}
                        <div className="mt-10 flex flex-col items-center gap-4 z-10">
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-gold flex items-center justify-center"
                            >
                                TRANSMITTING DATA
                            </motion.div>

                            {/* Clean progress bar */}
                            <div className="w-48 h-[2px] bg-white/10 rounded-full overflow-hidden relative">
                                <motion.div 
                                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-brand-gold to-brand-azure rounded-full" 
                                    style={{ width: `${progress}%` }}
                                    transition={{ duration: 0.1 }}
                                />
                            </div>

                            {/* Percentage indicator */}
                            <motion.span 
                                className="text-[11px] font-bold text-white/50 tracking-wider font-poppins"
                            >
                                {progress}%
                            </motion.span>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
