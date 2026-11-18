"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, LockKeyhole, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { authClient } from "@/lib/auth-client";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const resetToken = params.get("token");

    if (resetToken) {
      setToken(resetToken);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid or missing reset link.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
      toast.error("Password must contain uppercase and lowercase letters.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.resetPassword({
        newPassword: password,
        token,
      });

      if (error) {
        toast.error(error.message || "Password reset failed.");
        return;
      }

      toast.success("Password reset successfully!");

      router.push("/sign-in");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="flex flex-1 items-center justify-center bg-[#FFF8F0] px-4 py-16">
        <div className="w-full max-w-md rounded-2xl border border-orange-100 bg-white p-8 shadow-xl shadow-orange-100/50">

          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-[#F77F00]">
              <LockKeyhole size={30} />
            </div>
          </div>

          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-[#252525]">
              Create New Password
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Choose a strong password to secure your PizzaHub account.
            </p>
          </div>

          {!token ? (
            <div className="text-center">
              <p className="text-sm text-red-500">
                Invalid or expired reset link. Please request a new one.
              </p>

              <Link
                href="/forgot-password"
                className="mt-5 inline-block font-semibold text-[#F77F00] hover:underline"
              >
                Request New Reset Link
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  New Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    className="h-12 w-full rounded-lg border border-gray-200 pl-10 pr-11 text-sm outline-none transition focus:border-[#F77F00] focus:ring-2 focus:ring-orange-100"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <p className="mt-2 text-xs text-gray-400">
                  At least 8 characters, including uppercase and lowercase letters.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                    className="h-12 w-full rounded-lg border border-gray-200 pl-10 pr-11 text-sm outline-none transition focus:border-[#F77F00] focus:ring-2 focus:ring-orange-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#F77F00] font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          )}

          <div className="mt-7 border-t border-gray-100 pt-5 text-center">
            <Link
              href="/sign-in"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-[#F77F00]"
            >
              <ArrowLeft size={16} />
              Back to Sign In
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}