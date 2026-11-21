import Link from "next/link";
import { CheckCircle, Crown, ArrowRight } from "lucide-react";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function PaymentSuccessPage() {
  return (
    <>
      <Navbar />

      <main className="flex min-h-[75vh] items-center justify-center bg-[#FFF8F0] px-4 py-16">
        <div className="w-full max-w-lg rounded-3xl border border-orange-100 bg-white p-8 text-center shadow-xl sm:p-12">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>

          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-600">
            <Crown size={16} />
            Premium Subscription
          </span>

          <h1 className="mb-3 text-3xl font-bold text-[#252525]">
            Payment Successful!
          </h1>

          <p className="mb-8 leading-7 text-gray-500">
            Thank you for choosing PizzaHub Premium. Your payment has been
            received. Your subscription will be activated after payment
            verification.
          </p>

          <div className="mb-8 rounded-2xl bg-orange-50 p-5 text-left">
            <h2 className="mb-2 font-semibold text-[#252525]">
              What happens next?
            </h2>

            <p className="text-sm leading-6 text-gray-600">
              Our payment system will verify your transaction and update your
              subscription status. You will then be able to enjoy your Premium
              vendor benefits.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#F77F00] px-6 py-3.5 font-semibold text-white transition hover:bg-orange-600"
          >
            Go to Dashboard
            <ArrowRight size={18} />
          </Link>

          <p className="mt-5 text-xs text-gray-400">
            Thank you for being a part of PizzaHub!
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}