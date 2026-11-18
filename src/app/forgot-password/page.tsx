"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, Loader2, KeyRound } from "lucide-react";
import { toast } from "sonner";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { authClient } from "@/lib/auth-client";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.requestPasswordReset({
        email,
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast.error(error.message || "Something went wrong.");
        return;
      }

      setSubmitted(true);
      toast.success("Password reset email sent!");
    } catch {
      toast.error("Unable to send reset email. Please try again.");
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
              <KeyRound size={30} />
            </div>
          </div>

          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-[#252525]">
              Forgot Password?
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              No worries! Enter your email address and we will send you a link
              to reset your password.
            </p>
          </div>

          {submitted ? (
            <div className="text-center">
              <div className="mb-5 flex justify-center">
                <Mail size={38} className="text-green-500" />
              </div>

              <h2 className="font-semibold text-[#252525]">
                Check Your Email
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                If an account exists for {email}, you will receive a password
                reset link.
              </p>

              <button
                onClick={() => {
                  setSubmitted(false);
                }}
                className="mt-5 text-sm font-semibold text-[#F77F00] hover:underline"
              >
                Try another email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-[#F77F00] focus:ring-2 focus:ring-orange-100"
                  />
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
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
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