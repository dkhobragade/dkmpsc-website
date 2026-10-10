"use client";

import { useState } from "react";
import { useForm as useRHForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useRHForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setError("");
    try {
      const response = await api.post("/auth/login", data);
      if (response.data.success) {
        login(response.data.data.user);
        if (response.data.data.user.role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] p-4">
      <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[#E5E5E5] p-8 md:p-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-10 h-10 bg-[#FCA311] rounded-lg flex items-center justify-center text-white font-bold text-xl mb-6">
            D
          </div>
          <h1 className="text-2xl font-semibold text-[#171717] mb-2 text-center">Welcome back</h1>
          <p className="text-[#737373] text-sm text-center">Sign in to continue your preparation.</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-[#DC2626] text-sm rounded-lg border border-red-100 flex items-start">
            <span className="mr-2 mt-0.5">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#171717] block" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className={`w-full px-3 py-2.5 bg-white border ${errors.email ? 'border-[#DC2626] focus:ring-[#DC2626]/20' : 'border-[#E5E5E5] focus:ring-[#171717]/10'} rounded-lg text-sm text-[#171717] focus:outline-none focus:border-[#171717] focus:ring-4 transition-all`}
            />
            {errors.email && <p className="text-[#DC2626] text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#171717] block" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password")}
                className={`w-full px-3 py-2.5 bg-white border ${errors.password ? 'border-[#DC2626] focus:ring-[#DC2626]/20' : 'border-[#E5E5E5] focus:ring-[#171717]/10'} rounded-lg text-sm text-[#171717] focus:outline-none focus:border-[#171717] focus:ring-4 transition-all pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737373] hover:text-[#171717] transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-[#DC2626] text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#171717] hover:bg-[#171717]/90 text-white font-medium py-2.5 rounded-lg text-sm transition-all focus:outline-none focus:ring-4 focus:ring-[#171717]/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign in"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-[#737373]">
          Don't have an account?{" "}
          <Link href="/signup" className="font-medium text-[#171717] hover:underline hover:text-[#FCA311] transition-colors">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
