"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";

const signupSchema = z
  .object({
    fullName: z.string().min(2, "Name must be at least 2 characters.").max(80, "Name is too long."),
    email: z.string().email("Please enter a valid email address."),
    mobile: z
      .string()
      .optional()
      .refine((val) => !val || /^[6-9]\d{9}$/.test(val), "Please enter a valid 10-digit mobile number."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormValues) => {
    setError("");
    setSuccess(false);
    try {
      const response = await api.post("/auth/signup", {
        fullName: data.fullName,
        email: data.email,
        mobile: data.mobile,
        password: data.password,
      });

      if (response.data.success) {
        setSuccess(true);
        login(response.data.data.user);
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] p-4 py-12">
      <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[#E5E5E5] p-8 md:p-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-10 h-10 bg-[#FCA311] rounded-lg flex items-center justify-center text-white font-bold text-xl mb-6">
            D
          </div>
          <h1 className="text-2xl font-semibold text-[#171717] mb-2 text-center">Create your account</h1>
          <p className="text-[#737373] text-sm text-center">Start your MPSC preparation journey.</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-[#DC2626] text-sm rounded-lg border border-red-100 flex items-start">
            <span className="mr-2 mt-0.5">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-3 bg-green-50 text-[#16A34A] text-sm rounded-lg border border-green-100 flex items-start">
            <span className="mr-2 mt-0.5">✅</span>
            <span>Account created successfully! Redirecting...</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#171717] block" htmlFor="fullName">
              Full name
            </label>
            <input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              {...register("fullName")}
              className={`w-full px-3 py-2.5 bg-white border ${errors.fullName ? 'border-[#DC2626] focus:ring-[#DC2626]/20' : 'border-[#E5E5E5] focus:ring-[#171717]/10'} rounded-lg text-sm text-[#171717] focus:outline-none focus:border-[#171717] focus:ring-4 transition-all`}
            />
            {errors.fullName && <p className="text-[#DC2626] text-xs">{errors.fullName.message}</p>}
          </div>

          <div className="space-y-1.5">
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
            {errors.email && <p className="text-[#DC2626] text-xs">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#171717] block" htmlFor="mobile">
              Mobile number (optional)
            </label>
            <input
              id="mobile"
              type="tel"
              placeholder="e.g. 9876543210"
              {...register("mobile")}
              className={`w-full px-3 py-2.5 bg-white border ${errors.mobile ? 'border-[#DC2626] focus:ring-[#DC2626]/20' : 'border-[#E5E5E5] focus:ring-[#171717]/10'} rounded-lg text-sm text-[#171717] focus:outline-none focus:border-[#171717] focus:ring-4 transition-all`}
            />
            {errors.mobile && <p className="text-[#DC2626] text-xs">{errors.mobile.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#171717] block" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
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
            {errors.password && <p className="text-[#DC2626] text-xs">{errors.password.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#171717] block" htmlFor="confirmPassword">
              Confirm password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                {...register("confirmPassword")}
                className={`w-full px-3 py-2.5 bg-white border ${errors.confirmPassword ? 'border-[#DC2626] focus:ring-[#DC2626]/20' : 'border-[#E5E5E5] focus:ring-[#171717]/10'} rounded-lg text-sm text-[#171717] focus:outline-none focus:border-[#171717] focus:ring-4 transition-all pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737373] hover:text-[#171717] transition-colors focus:outline-none"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-[#DC2626] text-xs">{errors.confirmPassword.message}</p>}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || success}
              className="w-full bg-[#171717] hover:bg-[#171717]/90 text-white font-medium py-2.5 rounded-lg text-sm transition-all focus:outline-none focus:ring-4 focus:ring-[#171717]/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign up"}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center text-sm text-[#737373]">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-[#171717] hover:underline hover:text-[#FCA311] transition-colors">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
