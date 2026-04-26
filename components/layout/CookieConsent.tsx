"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

type CookiePrefs = {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
};

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);
  const [view, setView] = useState<"banner" | "settings">("banner");
  const [prefs, setPrefs] = useState<CookiePrefs>({
    essential: true,
    analytics: true,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem("rcsb-cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setShowConsent(true), 1500);
      return () => clearTimeout(timer);
    } else {
      try {
        const savedPrefs = JSON.parse(consent);
        if (typeof savedPrefs === "object") setPrefs(savedPrefs);
      } catch (e) {}
    }
  }, []);

  const savePreferences = (newPrefs: CookiePrefs) => {
    localStorage.setItem("rcsb-cookie-consent", JSON.stringify(newPrefs));
    setShowConsent(false);
  };

  const acceptAll = () => {
    const allOn = { essential: true, analytics: true, marketing: true };
    setPrefs(allOn);
    savePreferences(allOn);
  };

  const declineAll = () => {
    const min = { essential: true, analytics: false, marketing: false };
    setPrefs(min);
    savePreferences(min);
  };

  return (
    <AnimatePresence>
      {showConsent && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-0 left-0 right-0 z-[99999] bg-[#0a0f1e]/95 backdrop-blur-2xl border-t border-white/10"
        >
          <div className="max-w-screen-xl mx-auto p-4 md:p-6">
            <AnimatePresence mode="wait">
              {view === "banner" ? (
                <motion.div
                  key="banner"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col lg:flex-row items-center justify-between gap-6"
                >
                  <div className="flex items-center gap-4 text-center lg:text-left">
                    <div className="hidden sm:flex shrink-0 w-12 h-12 rounded-xl bg-brand-gold/10 items-center justify-center border border-brand-gold/20">
                      <span className="text-xl">🍪</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-brand-gold font-heading uppercase tracking-[0.2em] mb-1">
                        Cookie Settings
                      </h3>
                      <p className="text-gray-400 text-xs md:text-sm max-w-2xl leading-relaxed">
                        We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 w-full lg:w-auto">
                    <button
                      onClick={() => setView("settings")}
                      className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white px-4 py-2 transition-colors"
                    >
                      Customize
                    </button>
                    <button
                      onClick={declineAll}
                      className="bg-white/5 text-white/80 px-6 py-3 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all border border-white/10"
                    >
                      Reject All
                    </button>
                    <button
                      onClick={acceptAll}
                      className="bg-brand-gold text-brand-blue px-8 py-3 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] hover:bg-yellow-400 transition-all shadow-lg shadow-brand-gold/10"
                    >
                      Accept All
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="max-w-4xl mx-auto py-4"
                >
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-black text-brand-gold font-heading uppercase tracking-widest">
                      Privacy Preferences
                    </h3>
                    <button 
                      onClick={() => setView("banner")}
                      className="bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors"
                    >
                      <svg className="w-5 h-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {/* Essential */}
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-black text-white uppercase tracking-wider">Essential</h4>
                        <span className="text-[10px] font-bold text-brand-gold/50 uppercase tracking-widest">Required</span>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Security, login, and site functionality.
                      </p>
                    </div>

                    {/* Analytics */}
                    <div 
                      onClick={() => setPrefs(p => ({ ...p, analytics: !p.analytics }))}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer group ${prefs.analytics ? "bg-brand-gold/5 border-brand-gold/30" : "bg-white/5 border-white/5"}`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-black text-white uppercase tracking-wider group-hover:text-brand-gold transition-colors">Analytics</h4>
                        <div className={`w-8 h-4 rounded-full relative transition-colors ${prefs.analytics ? "bg-brand-gold" : "bg-gray-700"}`}>
                          <motion.div animate={{ x: prefs.analytics ? 18 : 2 }} className="absolute top-1 w-2 h-2 bg-white rounded-full" />
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Track site usage and performance.
                      </p>
                    </div>

                    {/* Marketing */}
                    <div 
                      onClick={() => setPrefs(p => ({ ...p, marketing: !p.marketing }))}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer group ${prefs.marketing ? "bg-brand-gold/5 border-brand-gold/30" : "bg-white/5 border-white/5"}`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-black text-white uppercase tracking-wider group-hover:text-brand-gold transition-colors">Marketing</h4>
                        <div className={`w-8 h-4 rounded-full relative transition-colors ${prefs.marketing ? "bg-brand-gold" : "bg-gray-700"}`}>
                          <motion.div animate={{ x: prefs.marketing ? 18 : 2 }} className="absolute top-1 w-2 h-2 bg-white rounded-full" />
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Targeted content and ads.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => setView("banner")}
                      className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white px-6 py-3 transition-colors"
                    >
                      Go Back
                    </button>
                    <button
                      onClick={() => savePreferences(prefs)}
                      className="bg-brand-gold text-brand-blue px-10 py-3 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] hover:bg-yellow-400 transition-all shadow-lg shadow-brand-gold/10"
                    >
                      Save Selection
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
