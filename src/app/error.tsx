"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, Pizza } from "lucide-react";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Development-এ Error সম্পর্কে বিস্তারিত দেখাবে
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FFF8F0] px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-orange-100 bg-white p-7 text-center shadow-sm sm:p-9">

        {/* Error Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
          <AlertTriangle size={38} className="text-red-500" />
        </div>

        <p className="mt-6 text-sm font-bold tracking-wider text-orange-500">
          SOMETHING WENT WRONG
        </p>

        <h1 className="mt-2 text-2xl font-extrabold text-[#252525]">
          Oops! Something Went Wrong
        </h1>

        <p className="mt-3 text-sm leading-6 text-gray-500">
          We couldn't load this page properly. Please try again
          or return to the homepage.
        </p>

        {/* Error ID */}
        {error.digest && (
          <p className="mt-3 text-xs text-gray-400">
            Error ID: {error.digest}
          </p>
        )}

        {/* Actions */}
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">

          <button
            onClick={() => reset()}
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            <RefreshCw size={17} />
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-orange-200 px-4 text-sm font-semibold text-orange-600 transition hover:bg-orange-50"
          >
            <Home size={17} />
            Go Home
          </Link>

        </div>

        {/* Brand */}
        <div className="mt-8 border-t border-gray-100 pt-5">
          <div className="flex items-center justify-center gap-2">
            <Pizza size={20} className="text-orange-500" />

            <span className="text-lg font-extrabold text-[#252525]">
              Pizza<span className="text-orange-500">Hub</span>
            </span>
          </div>

          <p className="mt-1 text-xs text-gray-400">
            Freshly Baked Happiness, Delivered to You.
          </p>
        </div>

      </div>
    </main>
  );
}