"use client";

import { motion } from "motion/react";
import {
  Bike,
  ChefHat,
  ShieldCheck,
  Clock,
} from "lucide-react";

const features = [
  {
    icon: ChefHat,
    title: "Freshly Made",
    description:
      "Every pizza is prepared fresh with quality ingredients and authentic flavors.",
    number: "01",
  },
  {
    icon: Bike,
    title: "Fast Delivery",
    description:
      "Get your favorite pizza delivered fresh and hot right to your doorstep.",
    number: "02",
  },
  {
    icon: ShieldCheck,
    title: "Trusted Shops",
    description:
      "Discover approved local pizza shops and enjoy a reliable ordering experience.",
    number: "03",
  },
  {
    icon: Clock,
    title: "Easy Ordering",
    description:
      "Find your favorite pizza, place your order, and track its status with ease.",
    number: "04",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-white px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-orange-600">
            The PizzaHub Difference
          </p>

          <h2 className="text-3xl font-bold text-[#252525] sm:text-4xl lg:text-5xl">
            More Than Pizza,
            <span className="text-orange-500"> It's an Experience.</span>
          </h2>

          <p className="mt-5 leading-7 text-gray-500">
            Great food deserves a great experience. Here's why
            PizzaHub makes every pizza moment special.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                className="group relative rounded-2xl border border-orange-100 bg-[#FFF8F0] p-7 transition-all duration-300 hover:-translate-y-2 hover:border-orange-300 hover:shadow-xl"
              >
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500 text-white transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                    <Icon size={27} />
                  </div>

                  <span className="text-4xl font-bold text-orange-100">
                    {feature.number}
                  </span>
                </div>

                <h3 className="mb-3 text-xl font-bold text-[#252525]">
                  {feature.title}
                </h3>

                <p className="text-sm leading-7 text-gray-500">
                  {feature.description}
                </p>

                <div className="mt-7 h-1 w-10 rounded-full bg-orange-500 transition-all duration-300 group-hover:w-20" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}