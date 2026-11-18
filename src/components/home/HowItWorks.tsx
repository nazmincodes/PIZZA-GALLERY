"use client";

import { motion } from "motion/react";
import {
  Search,
  ShoppingBag,
  Bike,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Discover Your Pizza",
    description:
      "Explore local pizza shops and discover delicious pizzas made for your taste.",
  },
  {
    number: "02",
    icon: ShoppingBag,
    title: "Place Your Order",
    description:
      "Choose your favorite pizza, add delivery details, and send your order in seconds.",
  },
  {
    number: "03",
    icon: Bike,
    title: "Enjoy Every Slice",
    description:
      "Your selected pizza shop prepares your order. Sit back and enjoy the experience.",
  },
];

export default function HowItWorks() {
  return (
    <section className="overflow-hidden bg-[#252525] px-4 py-24 text-white sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-orange-400">
              Simple & Delicious
            </p>

            <h2 className="max-w-xl text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              Your Favorite Pizza,
              <span className="text-orange-400"> Three Steps Away.</span>
            </h2>
          </div>

          <Link
            href="/menu"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            Explore Menu
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="relative grid gap-12 md:grid-cols-3 md:gap-8">
          <div className="absolute left-[16%] right-[16%] top-10 hidden border-t border-dashed border-white/20 md:block" />

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative"
              >
                <div className="mb-8 flex items-center gap-5">
                  <div className="relative z-10 flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-orange-400/40 bg-[#252525] text-orange-400">
                    <Icon size={30} strokeWidth={1.5} />
                  </div>

                  <span className="text-6xl font-bold text-white/10">
                    {step.number}
                  </span>
                </div>

                <h3 className="mb-4 text-2xl font-bold">
                  {step.title}
                </h3>

                <p className="max-w-sm text-sm leading-7 text-gray-400">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}