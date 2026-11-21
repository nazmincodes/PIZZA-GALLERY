import { Pizza } from "lucide-react";

export default function Loading() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#FFF8F0] px-4">

      {/* Animated Pizza Icon */}
      <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-orange-100">
        <div className="absolute inset-0 animate-ping rounded-full border-2 border-orange-300 opacity-40" />

        <Pizza
          size={42}
          className="animate-bounce text-orange-500"
        />
      </div>

      {/* Loading Text */}
      <h2 className="mt-6 text-xl font-extrabold text-[#252525]">
        Preparing Something Delicious!
      </h2>

      <p className="mt-2 text-sm text-gray-500">
        Please wait while we get things ready for you.
      </p>

      {/* Loading Bar */}
      <div className="mt-6 h-1.5 w-48 overflow-hidden rounded-full bg-orange-100">
        <div className="h-full w-1/2 animate-pulse rounded-full bg-orange-500" />
      </div>

      <p className="mt-3 text-xs font-medium text-orange-500">
        PizzaHub
      </p>

    </main>
  );
}