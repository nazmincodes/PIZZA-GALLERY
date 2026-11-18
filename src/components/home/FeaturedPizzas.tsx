"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";

import { featuredPizzas } from "@/data/featuredPizzas";

export default function FeaturedPizzas() {
  return (
    <section className="bg-[#FFF8F0] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">

        {/* Section Heading */}
        <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-orange-600">
              Handpicked For You
            </p>

            <h2 className="text-3xl font-bold text-[#252525] sm:text-4xl lg:text-5xl">
              Our Featured
              <span className="text-orange-500"> Pizzas.</span>
            </h2>

            <p className="mt-4 max-w-lg leading-7 text-gray-500">
              Explore our handpicked selection of delicious pizzas,
              prepared to make every moment special.
            </p>
          </div>

          <Link
            href="/menu"
            className="inline-flex w-fit items-center gap-2 font-semibold text-orange-600 transition hover:gap-3"
          >
            Explore All Pizzas
            <ArrowUpRight size={20} />
          </Link>
        </div>

        {/* Pizza Cards */}
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {featuredPizzas.map((pizza, index) => (
            <motion.article
              key={pizza.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              className="group overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              {/* Pizza Image */}
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={pizza.image}
                  alt={pizza.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {pizza.badge && (
                  <span className="absolute left-4 top-4 rounded-full bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white shadow">
                    {pizza.badge}
                  </span>
                )}

                <Link
                  href={`/menu/${pizza.id}`}
                  aria-label={`View ${pizza.name} details`}
                  className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-orange-600 shadow-md transition hover:bg-orange-500 hover:text-white"
                >
                  <ArrowUpRight size={20} />
                </Link>
              </div>

              {/* Pizza Information */}
              <div className="p-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-orange-500">
                  {pizza.category}
                </p>

                <h3 className="text-lg font-bold text-[#252525] transition-colors group-hover:text-orange-600">
                  {pizza.name}
                </h3>

                <p className="mt-2 min-h-12 text-sm leading-6 text-gray-500">
                  {pizza.description}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                  <div>
                    <p className="text-xs text-gray-400">Starting from</p>
                    <p className="text-xl font-bold text-[#252525]">
                      ৳{pizza.price}
                    </p>
                  </div>

                  <Link
                    href={`/menu/${pizza.id}`}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 text-orange-600 transition hover:bg-orange-500 hover:text-white"
                    aria-label={`Order ${pizza.name}`}
                  >
                    <ShoppingBag size={19} />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}