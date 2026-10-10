"use client";

import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    } else if (!isLoading && user?.role === "admin") {
      router.push("/admin/dashboard");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <header className="bg-white border-b border-[#E5E5E5] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-[#FCA311] rounded-md flex items-center justify-center text-white font-bold">
            D
          </div>
          <span className="font-semibold text-[#171717]">DKMPSC</span>
        </div>
        <button
          onClick={logout}
          className="text-sm font-medium text-[#737373] hover:text-[#171717] transition-colors"
        >
          Logout
        </button>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto p-6 md:p-12">
        <h1 className="text-3xl font-semibold text-[#171717] mb-2">Welcome, {user.fullName}</h1>
        <p className="text-[#737373] mb-8">Role: Student | {user.email}</p>
        
        <div className="bg-white border border-[#E5E5E5] rounded-xl p-8 flex flex-col items-center justify-center min-h-[300px] text-center">
          <div className="w-12 h-12 bg-[#FAFAFA] rounded-full flex items-center justify-center mb-4 border border-[#E5E5E5]">
            <svg className="w-6 h-6 text-[#737373]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h2 className="text-lg font-medium text-[#171717] mb-2">Your learning dashboard is coming soon.</h2>
          <p className="text-[#737373] max-w-sm">
            We are working hard to bring you the best MPSC preparation experience. Check back later!
          </p>
        </div>
      </main>
    </div>
  );
}
