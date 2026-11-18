"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Pizza,
  Menu,
  X,
  User,
  LayoutDashboard,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;

  const closeMenu = () => {
    setIsOpen(false);
    setProfileOpen(false);
  };

  const handleLogout = async () => {
    try {
      await authClient.signOut();

      toast.success("Logged out successfully!");

      closeMenu();
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link href="/" onClick={closeMenu} className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white">
            <Pizza size={24} />
          </div>

          <span className="text-2xl font-bold tracking-tight text-gray-900">
            Pizza<span className="text-orange-500">Hub</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <Link href="/" className="text-sm font-medium text-orange-600">
            Home
          </Link>

          <Link
            href="/menu"
            className="text-sm font-medium text-gray-600 transition hover:text-orange-500"
          >
            Browse Menu
          </Link>
        </div>

        {/* Desktop Auth Section */}
        <div className="hidden items-center gap-3 md:flex">
          {!isPending && !user && (
            <>
              <Link
                href="/sign-in"
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-orange-50 hover:text-orange-600"
              >
                Sign In
              </Link>

              <Link
                href="/sign-up"
                className="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                Get Started
              </Link>
            </>
          )}

          {user && (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-xl border border-gray-100 px-3 py-2 transition hover:bg-orange-50"
              >
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name}
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                    <User size={20} />
                  </div>
                )}

                <span className="max-w-28 truncate text-sm font-semibold text-gray-800">
                  {user.name}
                </span>

                <ChevronDown size={16} className="text-gray-500" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-14 w-56 rounded-xl border border-gray-100 bg-white p-2 shadow-xl">
                  <div className="border-b border-gray-100 px-3 py-3">
                    <p className="truncate text-sm font-semibold text-gray-800">
                      {user.name}
                    </p>

                    <p className="truncate text-xs text-gray-500">
                      {user.email}
                    </p>
                  </div>

                  <Link
                    href="/dashboard"
                    onClick={closeMenu}
                    className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition hover:bg-orange-50 hover:text-orange-600"
                  >
                    <LayoutDashboard size={17} />
                    Dashboard
                  </Link>

                  <Link
                    href="/profile"
                    onClick={closeMenu}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition hover:bg-orange-50 hover:text-orange-600"
                  >
                    <Settings size={17} />
                    Profile Settings
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-500 transition hover:bg-red-50"
                  >
                    <LogOut size={17} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg p-2 text-gray-700 transition hover:bg-orange-50 md:hidden"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={25} /> : <Menu size={25} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-5 shadow-lg md:hidden">
          <div className="flex flex-col gap-4">

            <Link
              href="/"
              onClick={closeMenu}
              className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-orange-50 hover:text-orange-600"
            >
              Home
            </Link>

            <Link
              href="/menu"
              onClick={closeMenu}
              className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-orange-50 hover:text-orange-600"
            >
              Browse Menu
            </Link>

            {!isPending && !user && (
              <div className="flex flex-col gap-3 border-t border-gray-100 pt-4">
                <Link
                  href="/sign-in"
                  onClick={closeMenu}
                  className="rounded-lg border border-orange-500 px-4 py-3 text-center text-sm font-semibold text-orange-600"
                >
                  Sign In
                </Link>

                <Link
                  href="/sign-up"
                  onClick={closeMenu}
                  className="rounded-lg bg-orange-500 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-orange-600"
                >
                  Get Started
                </Link>
              </div>
            )}

            {user && (
              <div className="border-t border-gray-100 pt-4">
                <div className="mb-4 flex items-center gap-3 px-3">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                      <User size={20} />
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-800">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {user.email}
                    </p>
                  </div>
                </div>

                <Link
                  href="/dashboard"
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-700 hover:bg-orange-50"
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>

                <Link
                  href="/profile"
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-700 hover:bg-orange-50"
                >
                  <Settings size={18} />
                  Profile Settings
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-red-500 hover:bg-red-50"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}