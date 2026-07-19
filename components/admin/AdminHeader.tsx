"use client";

import { useUser } from "@clerk/nextjs";
import { Bars3Icon } from "@heroicons/react/24/outline";

interface AdminHeaderProps {
  onToggleMobileMenu?: () => void;
}

export default function AdminHeader({ onToggleMobileMenu }: AdminHeaderProps) {
  const { user, isLoaded } = useUser();

  return (
    <header className="bg-white border-b border-gray-100 h-16 md:h-20 flex items-center justify-between px-4 md:px-8 shadow-sm sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="p-2 rounded-xl bg-gray-50 border border-gray-200 text-brand-blue md:hidden hover:bg-gray-100 transition-colors"
            aria-label="Open navigation menu"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
        )}
        <h1 className="text-base md:text-xl font-heading font-bold text-brand-blue truncate">
          Admin Control Panel
        </h1>
      </div>
      
      <div className="flex items-center gap-3">
        {isLoaded && user && (
          <div className="flex items-center gap-2 md:gap-3 bg-gray-50 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-gray-100">
            <span className="text-xs md:text-sm font-semibold text-brand-gray hidden sm:inline">
              {user.firstName} {user.lastName}
            </span>
            <img
              src={user.imageUrl}
              alt="Admin Profile"
              className="w-7 h-7 md:w-8 md:h-8 rounded-full border-2 border-brand-azure"
            />
          </div>
        )}
      </div>
    </header>
  );
}
