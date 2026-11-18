"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";

export default function Hero() {
    return (
        <section className="overflow-hidden bg-[#FFF8F0]">
            <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">

                {/* Left Content */}
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7 }}
                    className="space-y-6 text-center lg:text-left"
                >
                    <span className="inline-block rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-600">
                        Freshly Baked, Just for You 🍕
                    </span>

                    <h1 className="text-4xl font-bold leading-tight text-[#252525] sm:text-5xl lg:text-6xl">
                        Happiness Is Just a{" "}
                        <span className="text-[#F77F00]">Slice</span> Away!
                    </h1>

                    <p className="mx-auto max-w-lg text-base leading-7 text-gray-600 lg:mx-0">
                        Discover your favorite pizzas from local pizza shops.
                        Fresh ingredients, delicious flavors, and doorstep delivery
                        make every bite special.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 lg:justify-start">
                        <Link
                            href="/menu"
                            className="rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                        >
                            Explore Menu
                        </Link>

                        <Link
                            href="/sign-up"
                            className="rounded-lg border border-orange-500 px-6 py-3 text-sm font-semibold text-orange-600 transition hover:bg-orange-50"
                        >
                            Become a Vendor
                        </Link>
                    </div>
                </motion.div>

                {/* Right Image */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative flex justify-center"
                >
                    <Image
                        src="https://images.unsplash.com/photo-1513104890138-7c749659a591"
                        alt="Freshly baked delicious pizza"
                        width={600}
                        height={600}
                        priority
                        className="h-auto w-full max-w-lg rounded-3xl object-cover shadow-xl"
                    />
                </motion.div>

            </div>
        </section>
    );
}