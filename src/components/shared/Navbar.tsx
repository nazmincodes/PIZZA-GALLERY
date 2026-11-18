"use client";

import { useState } from "react";
import Link from "next/link";
import { Pizza, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenu}
          className="flex items-center gap-2"
        >
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

        {/* Desktop Auth Buttons */}
        <div className="hidden items-center gap-3 md:flex">
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
          </div>
        </div>
      )}
    </header>
  );
}