import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Star, ShoppingBag, CheckCircle2 } from "lucide-react";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { menuItems } from "@/data/menuItems";

type PizzaDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PizzaDetailsPage({
  params,
}: PizzaDetailsPageProps) {
  const { id } = await params;

  const pizza = menuItems.find((item) => item.id === id);

  if (!pizza) {
    notFound();
  }

  return (
    <>
      <Navbar />

      <main className="flex-1 bg-[#FFF8F0]">
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">

          {/* Back Button */}
          <Link
            href="/menu"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-orange-600"
          >
            <ArrowLeft size={18} />
            Back to Menu
          </Link>

          {/* Details Card */}
          <div className="grid overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm lg:grid-cols-2">

            {/* Pizza Image */}
            <div className="relative min-h-[300px] sm:min-h-[450px]">
              <Image
                src={pizza.image}
                alt={pizza.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />

              {pizza.badge && (
                <span className="absolute left-5 top-5 rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white">
                  {pizza.badge}
                </span>
              )}
            </div>

            {/* Pizza Information */}
            <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">

              <span className="w-fit rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-600">
                {pizza.category}
              </span>

              <h1 className="mt-5 text-3xl font-bold leading-tight text-[#252525] sm:text-4xl">
                {pizza.name}
              </h1>

              <p className="mt-5 text-base leading-8 text-gray-500">
                {pizza.description}
              </p>

              {/* Rating and Location */}
              <div className="mt-7 flex flex-wrap items-center gap-5">
                {pizza.rating && (
                  <div className="flex items-center gap-2">
                    <Star
                      size={19}
                      className="fill-yellow-400 text-yellow-400"
                    />
                    <span className="text-sm font-semibold text-gray-700">
                      {pizza.rating} Rating
                    </span>
                  </div>
                )}

                {pizza.location && (
                  <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-orange-500" />
                    <span className="text-sm text-gray-600">
                      {pizza.location}
                    </span>
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="mt-8 space-y-4 border-t border-gray-100 pt-7">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <CheckCircle2 size={19} className="text-green-500" />
                  Freshly prepared pizza
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <CheckCircle2 size={19} className="text-green-500" />
                  Quality ingredients
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <CheckCircle2 size={19} className="text-green-500" />
                  Delivered from local pizza shops
                </div>
              </div>

              {/* Price and Order Button */}
              <div className="mt-9 flex flex-col gap-5 border-t border-gray-100 pt-7 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="mt-1 text-3xl font-bold text-orange-600">
                    ৳{pizza.price}
                  </p>
                </div>

                <Link
                  href="/sign-in"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-100 transition hover:bg-orange-600"
                >
                  <ShoppingBag size={19} />
                  Order Now
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}