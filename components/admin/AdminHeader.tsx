"use client";

import { useUser } from "@clerk/nextjs";

export default function AdminHeader() {
  const { user, isLoaded } = useUser();

  return (
    <header className="bg-white border-b border-gray-100 h-20 flex items-center justify-between px-8 shadow-sm">
      <div>
        <h1 className="text-xl font-heading font-bold text-brand-blue">Admin Control Panel</h1>
      </div>
      
      <div className="flex items-center gap-4">
        {isLoaded && user && (
          <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
            <span className="text-sm font-semibold text-brand-gray">{user.firstName} {user.lastName}</span>
            <img src={user.imageUrl} alt="Admin Profile" className="w-8 h-8 rounded-full border-2 border-brand-azure" />
          </div>
        )}
      </div>
    </header>
  );
}
