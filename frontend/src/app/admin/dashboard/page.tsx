"use client";

import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminDashboardPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    } else if (!isLoading && user?.role !== "admin") {
      router.push("/dashboard"); // Redirect normal users
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== "admin") {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <header className="bg-white border-b border-[#E5E5E5] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-[#171717] rounded-md flex items-center justify-center text-white font-bold">
            A
          </div>
          <span className="font-semibold text-[#171717]">Admin Portal</span>
        </div>
        <button
          onClick={logout}
          className="text-sm font-medium text-[#737373] hover:text-[#171717] transition-colors"
        >
          Logout
        </button>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto p-6 md:p-12">
        <h1 className="text-3xl font-semibold text-[#171717] mb-2">Admin Dashboard</h1>
        <p className="text-[#737373] mb-8">Role: Admin | {user.email}</p>
        
        <div className="bg-white border border-[#E5E5E5] rounded-xl p-8 flex flex-col items-center justify-center min-h-[300px] text-center">
          <div className="w-12 h-12 bg-[#FAFAFA] rounded-full flex items-center justify-center mb-4 border border-[#E5E5E5]">
            <svg className="w-6 h-6 text-[#737373]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2 className="text-lg font-medium text-[#171717] mb-2">Admin management tools are coming soon.</h2>
          <p className="text-[#737373] max-w-sm">
            Content management, user controls, and analytics will appear here.
          </p>
        </div>
      </main>
    </div>
  );
}
