"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Store } from "lucide-react";
import { motion } from "motion/react";

export default function PartnerCTA() {
  return (
    <section className="bg-[#FFF8F0] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid overflow-hidden rounded-3xl bg-[#252525] lg:grid-cols-2">

          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center p-8 sm:p-12 lg:p-16"
          >
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500 text-white">
              <Store size={28} />
            </div>

            <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-orange-400">
              Grow With PizzaHub
            </p>

            <h2 className="max-w-lg text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              Have a Pizza Shop?
              <span className="text-orange-400">
                {" "}Let's Grow Together.
              </span>
            </h2>

            <p className="mt-6 max-w-lg text-sm leading-7 text-gray-400 sm:text-base">
              Bring your delicious pizzas to more customers.
              Manage your menu, receive orders, and grow your
              pizza business with PizzaHub.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                Become a Partner
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/menu"
                className="rounded-full border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-orange-400 hover:text-orange-400"
              >
                Explore Menu
              </Link>
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative min-h-[350px] lg:min-h-[550px]"
          >
            <Image
              src="https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=1200&q=85"
              alt="Freshly prepared pizza"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

            <div className="absolute bottom-6 left-6 rounded-2xl border border-white/20 bg-white/90 p-5 text-[#252525] shadow-xl backdrop-blur">
              <p className="text-sm font-semibold">Your Business</p>
              <p className="mt-1 text-xs text-gray-500">
                Your Pizza. More Customers.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}