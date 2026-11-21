"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  MessageSquare,
  ShoppingBag,
  Phone,
  Minus,
  Plus,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { apiRequest } from "@/lib/api";
import type { PizzaType } from "@/data/featuredPizzas";

type PizzaOrderItem = PizzaType & {
  _id?: string;
};

type Props = {
  pizza: PizzaOrderItem;
};

export default function PizzaOrderForm({ pizza }: Props) {
  const [deliveryDate, setDeliveryDate] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalPrice = pizza.price * quantity;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!deliveryDate || !address.trim() || !phone.trim()) {
      toast.error("Please complete all required fields.");
      return;
    }

    if (quantity < 1) {
      toast.error("Please select at least one pizza.");
      return;
    }

    try {
      setIsSubmitting(true);

      const result = await apiRequest("/api/orders", {
        method: "POST",
        body: JSON.stringify({
          menuItemId: pizza._id || pizza.id,
          quantity,
          deliveryDate,
          deliveryAddress: address,
          message,
        }),
      });

      toast.success(result.message || "Order placed successfully!");

      setDeliveryDate("");
      setAddress("");
      setPhone("");
      setMessage("");
      setQuantity(1);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to place your order."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#FFF8F0] px-4 py-8 sm:py-12">
        <div className="mx-auto max-w-6xl">
          <Link
            href={`/menu/${pizza._id || pizza.id}`}
            className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-orange-600"
          >
            <ArrowLeft size={17} />
            Back to Pizza Details
          </Link>

          <div className="mb-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1.5 text-xs font-bold text-orange-600">
              <ShoppingBag size={14} />
              CHECKOUT
            </span>

            <h1 className="mt-3 text-3xl font-extrabold text-[#252525] sm:text-4xl">
              Complete Your Order
            </h1>

            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              Just a few details away from enjoying your favorite pizza.
            </p>
          </div>

          <div className="grid items-start gap-7 lg:grid-cols-[1.4fr_0.8fr]">
            <section className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm sm:p-8">
              <h2 className="text-xl font-bold text-[#252525]">
                Delivery Information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Where should we deliver your pizza?
              </p>

              <form onSubmit={handleSubmit} className="mt-7 space-y-6">
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#252525]">
                    <Phone size={17} className="text-orange-500" />
                    Phone Number *
                  </label>

                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    pattern="01[3-9][0-9]{8}"
                    title="Enter a valid 11-digit Bangladesh mobile number"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#252525]">
                    <MapPin size={17} className="text-orange-500" />
                    Delivery Address *
                  </label>

                  <textarea
                    required
                    rows={4}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House number, road, area, city..."
                    className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#252525]">
                    <CalendarDays size={17} className="text-orange-500" />
                    Preferred Delivery Date *
                  </label>

                  <input
                    type="date"
                    required
                    min={new Date().toLocaleDateString("en-CA")}
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#252525]">
                    <MessageSquare size={17} className="text-orange-500" />
                    Special Instructions
                    <span className="font-normal text-gray-400">
                      (Optional)
                    </span>
                  </label>

                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Any special delivery instructions?"
                    className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F77F00] px-5 py-4 font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <ShoppingBag size={19} />
                  {isSubmitting
                    ? "Placing Order..."
                    : `Place Order · ৳${totalPrice}`}
                </button>

                <p className="text-center text-xs text-gray-400">
                  Your order will be submitted securely.
                </p>
              </form>
            </section>

            <aside className="h-fit rounded-2xl border border-orange-100 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-xl font-bold text-[#252525]">
                Order Summary
              </h2>

              <div className="relative mt-5 aspect-[16/10] overflow-hidden rounded-xl">
                <img
                  src={pizza.image}
                  alt={pizza.name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>

              <div className="mt-4">
                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-600">
                  {pizza.category}
                </span>

                <h3 className="mt-3 text-lg font-bold text-[#252525]">
                  {pizza.name}
                </h3>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  {pizza.description}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-5">
                <span className="text-sm font-semibold text-[#252525]">
                  Quantity
                </span>

                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((prev) => Math.max(1, prev - 1))
                    }
                    disabled={quantity === 1}
                    aria-label="Decrease quantity"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:border-orange-400 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Minus size={15} />
                  </button>

                  <span className="min-w-5 text-center font-bold text-[#252525]">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => prev + 1)}
                    aria-label="Increase quantity"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:border-orange-400 hover:text-orange-600"
                  >
                    <Plus size={15} />
                  </button>
                </div>
              </div>

              <div className="mt-5 space-y-3 border-t border-gray-100 pt-5">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Price per pizza</span>
                  <span>৳{pizza.price}</span>
                </div>

                <div className="flex justify-between text-sm text-gray-500">
                  <span>Quantity</span>
                  <span>× {quantity}</span>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <span className="font-bold text-[#252525]">
                    Total Amount
                  </span>

                  <span className="text-2xl font-extrabold text-[#F77F00]">
                    ৳{totalPrice}
                  </span>
                </div>
              </div>

              <div className="mt-5 flex gap-3 rounded-xl bg-orange-50 p-4">
                <Clock
                  size={19}
                  className="mt-0.5 shrink-0 text-orange-500"
                />

                <p className="text-xs leading-5 text-gray-600">
                  Delivery charges, if applicable, will be confirmed when your
                  order is processed.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}