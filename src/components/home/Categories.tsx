import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

// Category Data
const categories = [
  {
    name: "Classic Pizza",
    description: "Timeless flavors, unforgettable taste.",
    image:
      "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=900&q=85",
    slug: "Classic",
    number: "01",
  },
  {
    name: "Vegetarian",
    description: "Fresh vegetables and delicious flavors.",
    image:
      "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=900&q=85",
    slug: "Vegetarian",
    number: "02",
  },
  {
    name: "Meat Lovers",
    description: "Loaded with savory meat and rich cheese.",
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=900&q=85",
    slug: "Meat Lovers",
    number: "03",
  },
  {
    name: "Gourmet Selection",
    description: "Discover our special artisan creations.",
    image:
      "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=900&q=85",
    slug: "Specialty / Gourmet",
    number: "04",
  },
  {
    name: "Sides & Snacks",
    description: "Perfect bites to complete your meal.",
    image:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=85",
    slug: "Sides / Appetizers",
    number: "05",
  },
  {
    name: "Drinks & Desserts",
    description: "Refreshing drinks and delightful desserts.",
    image:
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=85",
    slug: "Beverages / Desserts",
    number: "06",
  },
];

// Categories Component
export default function Categories() {
  return (
    <section className="bg-[#FFF8F0] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">

        {/* Section Heading */}
        <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-orange-600">
              Explore Our Collection
            </p>

            <h2 className="max-w-xl text-3xl font-bold leading-tight text-[#252525] sm:text-4xl lg:text-5xl">
              Find Your Perfect
              <span className="text-orange-500"> Slice</span>
            </h2>

            <p className="mt-4 max-w-lg text-gray-600">
              From timeless classics to exciting new flavors,
              discover something delicious for every craving.
            </p>
          </div>

          <Link
            href="/menu"
            className="inline-flex w-fit items-center gap-2 font-semibold text-orange-600 transition hover:gap-3"
          >
            View All Menu
            <ArrowUpRight size={20} />
          </Link>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.number}
              href={`/menu?category=${encodeURIComponent(category.slug)}`}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                <span className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-gray-800">
                  {category.number}
                </span>

                <div className="absolute bottom-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-white text-orange-500 transition-all duration-300 group-hover:bg-orange-500 group-hover:text-white">
                  <ArrowUpRight size={22} />
                </div>
              </div>

              {/* Details */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#252525] transition-colors group-hover:text-orange-600">
                  {category.name}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}