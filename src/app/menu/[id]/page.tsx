import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ArrowLeft,
  MapPin,
  Star,
  ShoppingBag,
  Clock,
  ShieldCheck,
} from "lucide-react";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Pizza = {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  location: string;
  restaurantName: string;
  rating: number;
  isFeatured: boolean;
};

type PizzaDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PizzaDetailsPage({
  params,
}: PizzaDetailsPageProps) {
  const { id } = await params;

  let pizza: Pizza | undefined;

  try {
    const response = await fetch(`${API_URL}/api/menu/public`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch pizza details.");
    }

    const result = await response.json();

    pizza = (result.menuItems as Pizza[]).find(
      (item) => item._id === id
    );
  } catch {
    throw new Error("Unable to load pizza details. Please try again.");
  }

  if (!pizza) {
    notFound();
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#FFF8F0] px-4 py-10 sm:py-14">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/menu"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-orange-600"
          >
            <ArrowLeft size={17} />
            Back to Menu
          </Link>

          <div className="grid items-center gap-10 lg:grid-cols-2">
            {/* Pizza Image */}
            <div className="relative aspect-square overflow-hidden rounded-3xl bg-orange-50 shadow-lg">
              {pizza.image ? (
                <img
                  src={pizza.image}
                  alt={pizza.name}
                  className="h-full w-full object-cover transition duration-500 hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-orange-400">
                  No Image Available
                </div>
              )}

              {pizza.isFeatured && (
                <span className="absolute left-5 top-5 rounded-full bg-[#F77F00] px-4 py-2 text-sm font-semibold text-white shadow-md">
                  Featured
                </span>
              )}
            </div>

            {/* Pizza Information */}
            <div>
              <span className="inline-block rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-600">
                {pizza.category}
              </span>

              <h1 className="mt-5 text-3xl font-extrabold leading-tight text-[#252525] sm:text-4xl lg:text-5xl">
                {pizza.name}
              </h1>

              <p className="mt-5 text-base leading-8 text-gray-500">
                {pizza.description}
              </p>

              {/* Restaurant */}
              <p className="mt-4 text-sm font-semibold text-gray-700">
                Restaurant: {pizza.restaurantName}
              </p>

              {/* Rating and Location */}
              <div className="mt-6 flex flex-wrap items-center gap-5">
                {pizza.rating > 0 && (
                  <div className="flex items-center gap-2">
                    <Star
                      size={19}
                      className="fill-yellow-400 text-yellow-400"
                    />

                    <span className="font-semibold text-[#252525]">
                      {pizza.rating}
                    </span>

                    <span className="text-sm text-gray-400">
                      Customer Rating
                    </span>
                  </div>
                )}

                {pizza.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin size={17} className="text-orange-500" />
                    {pizza.location}
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="my-8 grid gap-4 border-y border-orange-100 py-6 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-orange-100 p-3">
                    <Clock className="text-orange-600" size={21} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[#252525]">
                      Freshly Prepared
                    </p>
                    <p className="text-xs text-gray-400">
                      Made with fresh ingredients
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-orange-100 p-3">
                    <ShieldCheck className="text-orange-600" size={21} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[#252525]">
                      Trusted Restaurant
                    </p>
                    <p className="text-xs text-gray-400">
                      Quality-focused service
                    </p>
                  </div>
                </div>
              </div>

              {/* Price and Order */}
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-400">Price</p>
                  <p className="text-3xl font-extrabold text-[#F77F00]">
                    ৳{pizza.price}
                  </p>
                </div>

                <Link
                  href={`/menu/${pizza._id}/order`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F77F00] px-8 py-4 font-semibold text-white shadow-md transition hover:bg-orange-600 hover:shadow-lg"
                >
                  <ShoppingBag size={19} />
                  Order Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}