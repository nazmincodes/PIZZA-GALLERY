"use client";

import { motion } from "motion/react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: "review-01",
    name: "Sarah Ahmed",
    role: "Pizza Lover",
    review:
      "Amazing pizza and a wonderful ordering experience. The variety of options is impressive!",
    rating: 5,
    initial: "S",
  },
  {
    id: "review-02",
    name: "Rahim Hasan",
    role: "Regular Customer",
    review:
      "Finding local pizza shops has never been easier. I love how simple the platform is!",
    rating: 5,
    initial: "R",
  },
  {
    id: "review-03",
    name: "Nusrat Jahan",
    role: "Food Enthusiast",
    review:
      "Beautiful experience from browsing to ordering. Definitely a platform worth exploring.",
    rating: 5,
    initial: "N",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-orange-600">
            Customer Stories
          </p>

          <h2 className="text-3xl font-bold text-[#252525] sm:text-4xl lg:text-5xl">
            Loved by Pizza
            <span className="text-orange-500"> Lovers.</span>
          </h2>

          <p className="mt-5 leading-7 text-gray-500">
            Every great experience starts with a happy customer.
            Discover what people think about PizzaHub.
          </p>
        </div>

        {/* Review Cards */}
        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.article
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="rounded-2xl border border-orange-100 bg-[#FFF8F0] p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <Quote size={32} className="text-orange-300" />

                <div className="flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      size={17}
                      className="fill-orange-400 text-orange-400"
                    />
                  ))}
                </div>
              </div>

              <p className="min-h-24 text-sm leading-7 text-gray-600">
                "{testimonial.review}"
              </p>

              <div className="mt-7 flex items-center gap-4 border-t border-orange-100 pt-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-lg font-bold text-white">
                  {testimonial.initial}
                </div>

                <div>
                  <h3 className="font-bold text-[#252525]">
                    {testimonial.name}
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}