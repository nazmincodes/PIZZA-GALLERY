"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Camera,
  Save,
  Loader2,
  ArrowLeft,
  ShieldCheck,
  CircleUserRound,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setImage(session.user.image || "");
    }
  }, [session]);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/sign-in");
    }
  }, [isPending, session, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name is required.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.updateUser({
        name: name.trim(),
        image: image.trim() || undefined,
      });

      if (error) {
        toast.error(error.message || "Profile update failed.");
        return;
      }

      toast.success("Profile updated successfully!");
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (isPending || !session) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-[50vh] items-center justify-center bg-[#FFF8F0]">
          <Loader2 className="animate-spin text-orange-500" size={30} />
        </main>
        <Footer />
      </>
    );
  }

  const userRole =
    (session.user as typeof session.user & { role?: string }).role ||
    "customer";

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#FFF8F0] px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-2xl">

          {/* Back Button */}
          <Link
            href="/dashboard"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-orange-600"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>

          {/* Page Heading */}
          <div className="mb-6">
            <p className="mb-1 text-xs font-bold tracking-wider text-orange-600">
              ACCOUNT SETTINGS
            </p>

            <h1 className="text-2xl font-extrabold text-[#252525] sm:text-3xl">
              Profile Settings
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage your personal information and account details.
            </p>
          </div>

          {/* Profile Card */}
          <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm">

            {/* Card Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 to-orange-400 px-5 py-5 sm:px-7">
              <div className="relative z-10">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={19} className="text-white" />

                  <span className="text-xs font-semibold text-orange-50">
                    YOUR ACCOUNT
                  </span>
                </div>

                <h2 className="mt-2 text-xl font-bold text-white">
                  Personal Information
                </h2>

                <p className="mt-1 text-xs text-orange-50 sm:text-sm">
                  Keep your account information up to date.
                </p>
              </div>

              <div className="absolute -right-8 -top-12 h-36 w-36 rounded-full bg-white/10" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6">

              {/* Profile Preview */}
              <div className="flex items-center gap-4 border-b border-gray-100 pb-5">

                {image ? (
                  <img
                    src={image}
                    alt="Profile preview"
                    className="h-20 w-20 shrink-0 rounded-full border-4 border-orange-100 object-cover"
                  />
                ) : (
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-orange-100 bg-orange-50 text-orange-500">
                    <CircleUserRound size={42} />
                  </div>
                )}

                <div className="min-w-0">
                  <h3 className="truncate font-bold text-[#252525]">
                    {name || "Your Name"}
                  </h3>

                  <p className="mt-1 truncate text-xs text-gray-500">
                    {session.user.email}
                  </p>

                  <span className="mt-2 inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold capitalize text-orange-600">
                    {userRole}
                  </span>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                    maxLength={100}
                    className="h-11 w-full rounded-lg border border-gray-200 pl-10 pr-4 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="email"
                    value={session.user.email}
                    disabled
                    className="h-11 w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-500"
                  />
                </div>

                <p className="mt-1 text-xs text-gray-400">
                  Email address cannot be changed here.
                </p>
              </div>

              {/* Profile Image */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Profile Image URL
                </label>

                <div className="relative">
                  <Camera
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://example.com/profile.jpg"
                    className="h-11 w-full rounded-lg border border-gray-200 pl-10 pr-4 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <p className="mt-1 text-xs text-gray-400">
                  Image preview updates automatically.
                </p>
              </div>

              {/* Account Information */}
              <div className="rounded-xl border border-orange-100 bg-orange-50/60 p-4">
                <h3 className="mb-3 text-sm font-bold text-[#252525]">
                  Account Information
                </h3>

                <div className="flex items-center justify-between gap-3 border-b border-orange-100 pb-3">
                  <span className="text-xs text-gray-500">
                    Account Type
                  </span>

                  <span className="text-xs font-semibold capitalize text-[#252525]">
                    {userRole}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="text-xs text-gray-500">
                    Email Verification
                  </span>

                  <span className="text-xs font-semibold text-green-600">
                    {session.user.emailVerified ? "Verified" : "Not Verified"}
                  </span>
                </div>
              </div>

              {/* Save Button */}
              <div className="border-t border-gray-100 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-6 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                >
                  {loading ? (
                    <>
                      <Loader2 size={17} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={17} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}