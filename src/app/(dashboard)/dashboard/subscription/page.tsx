"use client";

import { useEffect, useState } from "react";
import {
    Check,
    Crown,
    Zap,
    ArrowRight,
    BadgeCheck,
    Loader2,
} from "lucide-react";
import { toast } from "sonner";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { apiRequest } from "@/lib/api";

interface Vendor {
    subscriptionPlan: "free" | "premium";
    subscriptionStatus: "inactive" | "active" | "cancelled" | "past_due";
}

export default function SubscriptionPage() {
    const [vendor, setVendor] = useState<Vendor | null>(null);
    const [loading, setLoading] = useState(true);
    const [upgrading, setUpgrading] = useState(false);

    useEffect(() => {
        const fetchSubscription = async () => {
            try {
                const response = await apiRequest("/api/vendors/profile");

                setVendor(response.vendor);
            } catch (error) {
                toast.error(
                    error instanceof Error
                        ? error.message
                        : "Failed to load subscription."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchSubscription();
    }, []);

    const isPremium =
        vendor?.subscriptionPlan === "premium" &&
        vendor?.subscriptionStatus === "active";

    const handleUpgrade = async () => {
        try {
            setUpgrading(true);

            const response = await apiRequest(
                "/api/subscriptions/checkout",
                {
                    method: "POST",
                }
            );

            if (!response.checkoutUrl) {
                throw new Error("Stripe Checkout URL not found.");
            }

            window.location.href = response.checkoutUrl;
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Unable to start subscription."
            );

            setUpgrading(false);
        }
    };

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-[#FFF8F0] px-4 py-14">
                <div className="mx-auto max-w-6xl">

                    <div className="mb-12 text-center">
                        <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-600">
                            <Crown size={17} />
                            PizzaHub Membership
                        </span>

                        <h1 className="mb-4 text-3xl font-extrabold text-[#252525] sm:text-5xl">
                            Grow Your Restaurant With{" "}
                            <span className="text-[#F77F00]">
                                Premium
                            </span>
                        </h1>

                        <p className="mx-auto max-w-2xl text-gray-500">
                            Unlock powerful tools, unlimited menu items and
                            better visibility for your restaurant.
                        </p>
                    </div>

                    {/* Current Subscription */}
                    <div className="mx-auto mb-10 max-w-2xl rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-bold text-[#252525]">
                            Your Current Subscription
                        </h2>

                        {loading ? (
                            <div className="flex items-center gap-2 text-gray-500">
                                <Loader2 className="animate-spin" size={18} />
                                Loading subscription...
                            </div>
                        ) : vendor ? (
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div>
                                    <p className="text-2xl font-extrabold capitalize text-[#252525]">
                                        {vendor.subscriptionPlan} Plan
                                    </p>

                                    <p className="mt-1 text-sm capitalize text-gray-500">
                                        Status: {vendor.subscriptionStatus.replace("_", " ")}
                                    </p>
                                </div>

                                <span
                                    className={`rounded-full px-4 py-2 text-sm font-bold ${
                                        isPremium
                                            ? "bg-green-100 text-green-700"
                                            : "bg-gray-100 text-gray-600"
                                    }`}
                                >
                                    {isPremium ? "Premium Active" : "Free Plan"}
                                </span>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">
                                Unable to load subscription information.
                            </p>
                        )}
                    </div>

                    {/* Pricing Card */}
                    <div className="mx-auto max-w-xl">
                        <div className="relative rounded-3xl border-2 border-[#F77F00] bg-white p-7 shadow-xl sm:p-9">

                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#F77F00] px-5 py-2 text-xs font-bold text-white">
                                RECOMMENDED FOR GROWTH
                            </div>

                            <div className="mb-6 text-center">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-[#F77F00]">
                                    <Crown size={32} />
                                </div>

                                <h2 className="text-3xl font-extrabold text-[#252525]">
                                    PizzaHub Premium
                                </h2>

                                <p className="mt-2 text-sm text-gray-500">
                                    Everything your restaurant needs to grow.
                                </p>
                            </div>

                            <div className="mb-8 border-b border-gray-100 pb-7 text-center">
                                <span className="text-5xl font-extrabold text-[#252525]">
                                    $19.99
                                </span>

                                <span className="ml-2 text-gray-500">
                                    / month
                                </span>
                            </div>

                            <div className="mb-9 space-y-4">
                                {[
                                    "Unlimited active menu items",
                                    "Premium restaurant badge",
                                    "Featured restaurant placement",
                                    "Priority restaurant visibility",
                                    "Better restaurant exposure",
                                    "Everything included in Free Plan",
                                ].map((feature) => (
                                    <div
                                        key={feature}
                                        className="flex items-start gap-3"
                                    >
                                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100">
                                            <Check
                                                size={15}
                                                className="text-green-600"
                                            />
                                        </div>

                                        <span className="text-sm text-gray-600">
                                            {feature}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={handleUpgrade}
                                disabled={loading || upgrading || isPremium || !vendor}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F77F00] px-5 py-4 font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {upgrading ? (
                                    <>
                                        <Loader2
                                            size={19}
                                            className="animate-spin"
                                        />
                                        Redirecting to Stripe...
                                    </>
                                ) : isPremium ? (
                                    <>
                                        <BadgeCheck size={19} />
                                        Premium Already Active
                                    </>
                                ) : (
                                    <>
                                        Upgrade to Premium
                                        <ArrowRight size={19} />
                                    </>
                                )}
                            </button>

                            <p className="mt-4 text-center text-xs text-gray-400">
                                Secure recurring payment powered by Stripe.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}