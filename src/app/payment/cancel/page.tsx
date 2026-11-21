import Link from "next/link";
import { XCircle, RefreshCw, ArrowLeft } from "lucide-react";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function PaymentCancelPage() {
  return (
    <>
      <Navbar />

      <main className="flex min-h-[75vh] items-center justify-center bg-[#FFF8F0] px-4 py-16">
        <div className="w-full max-w-lg rounded-3xl border border-orange-100 bg-white p-8 text-center shadow-xl sm:p-12">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-12 w-12 text-red-500" />
          </div>

          <h1 className="mb-3 text-3xl font-bold text-[#252525]">
            Payment Cancelled
          </h1>

          <p className="mb-8 leading-7 text-gray-500">
            Your Premium subscription payment was not completed. Don't worry!
            No subscription has been activated.
          </p>

          <div className="mb-8 rounded-2xl bg-orange-50 p-5 text-left">
            <h2 className="mb-2 font-semibold text-[#252525]">
              Want to try again?
            </h2>

            <p className="text-sm leading-6 text-gray-600">
              You can return to your dashboard and try subscribing to PizzaHub
              Premium whenever you are ready.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="mb-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#F77F00] px-6 py-3.5 font-semibold text-white transition hover:bg-orange-600"
          >
            <RefreshCw size={18} />
            Return to Dashboard
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 py-2 text-sm font-medium text-gray-500 transition hover:text-orange-600"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
}