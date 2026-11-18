"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Camera, Save, Loader2, ArrowLeft } from "lucide-react";
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

  if (isPending) {
    return (
      <>
        <Navbar />
        <main className="flex flex-1 items-center justify-center bg-[#FFF8F0]">
          <Loader2 className="animate-spin text-orange-500" size={32} />
        </main>
        <Footer />
      </>
    );
  }

  if (!session) {
    router.push("/sign-in");
    return null;
  }

  return (
    <>
      <Navbar />

      <main className="flex-1 bg-[#FFF8F0] px-4 py-12">
        <div className="mx-auto max-w-3xl">

          <Link
            href="/dashboard"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-orange-500"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </Link>

          <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm">

            <div className="bg-gradient-to-r from-orange-500 to-orange-400 px-6 py-8 text-white sm:px-8">
              <h1 className="text-2xl font-bold">Profile Settings</h1>
              <p className="mt-2 text-sm text-orange-50">
                Manage your personal information and account details.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 p-6 sm:p-8">

              <div className="flex items-center gap-4">
                {image ? (
                  <img
                    src={image}
                    alt="Profile"
                    className="h-20 w-20 rounded-full border-4 border-orange-100 object-cover"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                    <User size={36} />
                  </div>
                )}

                <div>
                  <h2 className="font-semibold text-gray-800">
                    Profile Information
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Update your personal details.
                  </p>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                    className="h-12 w-full rounded-lg border border-gray-200 pl-10 pr-4 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="email"
                    value={session.user.email}
                    disabled
                    className="h-12 w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-500"
                  />
                </div>

                <p className="mt-1 text-xs text-gray-400">
                  Email address cannot be changed here.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Profile Image URL
                </label>

                <div className="relative">
                  <Camera
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://example.com/profile.jpg"
                    className="h-12 w-full rounded-lg border border-gray-200 pl-10 pr-4 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <p className="mt-1 text-xs text-gray-400">
                  আপাতত Image URL দিতে হবে। পরে ImgBB Upload যুক্ত করব।
                </p>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-orange-500 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:px-8"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
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