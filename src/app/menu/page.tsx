"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  MapPin,
  Star,
  ArrowUpRight,
  SlidersHorizontal,
} from "lucide-react";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { menuItems } from "@/data/menuItems";

export default function MenuPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [location, setLocation] = useState("All");

  const categories = [
    "All",
    "Classic",
    "Vegetarian",
    "Meat Lovers",
    "Specialty",
  ];

  const locations = [
    "All",
    ...new Set(menuItems.map((pizza) => pizza.location).filter(Boolean)),
  ];

  const filteredPizzas = menuItems.filter((pizza) => {
    const matchesSearch = pizza.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || pizza.category === category;

    const matchesLocation =
      location === "All" || pizza.location === location;

    return matchesSearch && matchesCategory && matchesLocation;
  });

  return (
    <>
      <Navbar />

      <main className="flex-1 bg-[#FFF8F0]">
        {/* Page Header */}
        <section className="bg-gradient-to-br from-red-300 via-[#FFF8F0] to-orange-100 px-4 py-16 text-center sm:py-20">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[3px] text-orange-600">
            Discover Your Favorite
          </p>

          <h1 className="text-3xl font-bold text-[#252525] sm:text-4xl lg:text-5xl">
            Explore Our <span className="text-orange-500">Pizza Menu</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
            Find your perfect slice from delicious pizzas made by local pizza shops.
          </p>
        </section>

        {/* Menu Content */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          {/* Search */}
          <div className="mb-8 flex flex-col gap-5 rounded-2xl border border-orange-100 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Find Your Pizza
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Search and explore delicious flavors.
              </p>
            </div>

            <div className="relative w-full lg:max-w-md">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search pizza by name..."
                className="h-12 w-full rounded-xl border border-gray-200 bg-[#FFF8F0] pl-12 pr-4 text-sm text-gray-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="mb-8 grid gap-5 md:grid-cols-[1fr_220px] md:items-end">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-orange-500" />

                <h3 className="font-semibold text-gray-900">
                  Browse by Category
                </h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                      category === item
                        ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                        : "border border-orange-100 bg-white text-gray-600 hover:border-orange-400 hover:text-orange-600"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="location"
                className="mb-3 block font-semibold text-gray-900"
              >
                Filter by Location
              </label>

              <select
                id="location"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                className="h-11 w-full rounded-xl border border-orange-100 bg-white px-4 text-sm text-gray-700 outline-none focus:border-orange-500"
              >
                {locations.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              All Pizzas
            </h2>

            <p className="text-sm text-gray-500">
              {filteredPizzas.length} items found
            </p>
          </div>

          {/* Pizza Cards */}
          {filteredPizzas.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredPizzas.map((pizza) => (
                <article
                  key={pizza.id}
                  className="group overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={pizza.image}
                      alt={pizza.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition duration-500 group-hover:scale-110"
                    />

                    {pizza.badge && (
                      <span className="absolute left-3 top-3 rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white">
                        {pizza.badge}
                      </span>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600">
                        {pizza.category}
                      </span>

                      {pizza.rating && (
                        <span className="flex items-center gap-1 text-sm font-semibold text-gray-700">
                          <Star
                            size={15}
                            className="fill-yellow-400 text-yellow-400"
                          />
                          {pizza.rating}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 transition group-hover:text-orange-600">
                      {pizza.name}
                    </h3>

                    <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-gray-500">
                      {pizza.description}
                    </p>

                    <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                      <MapPin size={14} className="text-orange-500" />
                      {pizza.location}
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                      <p className="text-xl font-bold text-orange-600">
                        ৳{pizza.price}
                      </p>

                      <Link
                        href={`/menu/${pizza.id}`}
                        className="inline-flex items-center gap-2 rounded-lg bg-[#252525] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-500"
                      >
                        Details
                        <ArrowUpRight size={16} />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-orange-200 bg-white px-5 py-16 text-center">
              <Search size={35} className="mx-auto text-orange-400" />

              <h3 className="mt-4 text-xl font-bold text-gray-900">
                No Pizzas Found
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Try another search or change your filters.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                  setLocation("All");
                }}
                className="mt-5 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                Clear Filters
              </button>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}