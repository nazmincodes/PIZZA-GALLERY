"use client";

import { useCallback, useEffect, useState } from "react";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/api";

import {
  Search,
  Wallet,
  TrendingUp,
  CheckCircle,
  XCircle,
  CreditCard,
  CalendarDays,
  Receipt,
  RefreshCw,
} from "lucide-react";

type PaymentStatus =
  | "pending"
  | "succeeded"
  | "failed"
  | "refunded";

type Transaction = {
  _id?: string;
  id?: string;
  vendorName?: string;
  email?: string;
  plan?: string;
  amount: number;
  currency?: string;
  paymentMethod?: string;
  date?: string;
  createdAt?: string;
  status: PaymentStatus;
  stripeSessionId?: string;
};

type Statistics = {
  totalTransactions?: number;
  successfulTransactions?: number;
  failedTransactions?: number;
  pendingTransactions?: number;
  refundedTransactions?: number;
  totalRevenue?: number;
  currency?: string;
  total?: number;
  succeeded?: number;
  failed?: number;
  pending?: number;
};

type TransactionResponse = {
  success: boolean;
  transactions: Transaction[];
  message?: string;
};

type StatisticsResponse = {
  success: boolean;
  statistics: Statistics;
  message?: string;
};

const statusStyles: Record<PaymentStatus, string> = {
  succeeded: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  pending: "bg-yellow-100 text-yellow-700",
  refunded: "bg-purple-100 text-purple-700",
};

const statusLabels: Record<PaymentStatus, string> = {
  succeeded: "Successful",
  failed: "Failed",
  pending: "Pending",
  refunded: "Refunded",
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [statistics, setStatistics] = useState<Statistics>({});
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [transactionResponse, statisticsResponse] =
        await Promise.all([
          apiRequest("/api/admin/transactions?limit=50"),
          apiRequest("/api/admin/transactions/statistics"),
        ]) as [TransactionResponse, StatisticsResponse];

      if (!transactionResponse.success) {
        throw new Error(
          transactionResponse.message || "Failed to load transactions."
        );
      }

      if (!statisticsResponse.success) {
        throw new Error(
          statisticsResponse.message || "Failed to load statistics."
        );
      }

      setTransactions(transactionResponse.transactions || []);
      setStatistics(statisticsResponse.statistics || {});
    } catch (err) {
      console.error("Transactions loading error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading transactions."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchTransactions();
  }, [fetchTransactions]);

  const successfulTransactions = transactions.filter(
    (transaction) => transaction.status === "succeeded"
  );

  const failedTransactions = transactions.filter(
    (transaction) => transaction.status === "failed"
  );

  const pendingTransactions = transactions.filter(
    (transaction) => transaction.status === "pending"
  );

  const totalTransactions =
    statistics.totalTransactions ??
    statistics.total ??
    transactions.length;

  const successfulCount =
    statistics.successfulTransactions ??
    statistics.succeeded ??
    successfulTransactions.length;

  const failedCount =
    statistics.failedTransactions ??
    statistics.failed ??
    failedTransactions.length;

  const pendingCount =
    statistics.pendingTransactions ??
    statistics.pending ??
    pendingTransactions.length;

  const totalRevenue = statistics.totalRevenue ?? 0;

  const formatCurrency = (amount: number, currency = "usd") => {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency.toUpperCase(),
      }).format(amount);
    } catch {
      return `${currency.toUpperCase()} ${amount}`;
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "N/A";

    return parsedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const vendorName = transaction.vendorName || "";
    const email = transaction.email || "";
    const transactionId =
      transaction.id ||
      transaction._id ||
      transaction.stripeSessionId ||
      "";

    const matchesSearch =
      vendorName.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase()) ||
      transactionId.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      activeFilter === "All" ||
      statusLabels[transaction.status] === activeFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#FFF8F0]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

          {/* Page Header */}
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="mb-2 text-sm font-semibold text-[#F77F00]">
                ADMIN DASHBOARD
              </p>

              <h1 className="text-3xl font-bold text-[#252525] md:text-4xl">
                Transactions
              </h1>

              <p className="mt-2 text-gray-500">
                Monitor vendor premium subscriptions and payment activities.
              </p>
            </div>

            <Button
              onClick={() => void fetchTransactions()}
              disabled={loading}
              className="bg-[#F77F00] hover:bg-[#e66f00]"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </Button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <p className="font-semibold">Unable to load transactions</p>
              <p className="mt-1">{error}</p>
            </div>
          )}

          {/* Statistics */}
          <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">Total Revenue</p>
                <Wallet className="text-[#F77F00]" />
              </div>

              <h2 className="mt-4 text-3xl font-bold text-[#252525]">
                {loading ? "..." : formatCurrency(totalRevenue, statistics.currency || "usd")}
              </h2>

              <p className="mt-2 text-xs text-green-600">
                From successful payments
              </p>
            </div>

            <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">Total Transactions</p>
                <Receipt className="text-blue-500" />
              </div>

              <h2 className="mt-4 text-3xl font-bold text-[#252525]">
                {loading ? "..." : totalTransactions}
              </h2>
            </div>

            <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">Successful</p>
                <CheckCircle className="text-green-500" />
              </div>

              <h2 className="mt-4 text-3xl font-bold text-[#252525]">
                {loading ? "..." : successfulCount}
              </h2>
            </div>

            <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">Failed Payments</p>
                <XCircle className="text-red-500" />
              </div>

              <h2 className="mt-4 text-3xl font-bold text-[#252525]">
                {loading ? "..." : failedCount}
              </h2>
            </div>

          </div>

          {/* Payment Summary */}
          <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2">

            <div className="rounded-2xl border border-green-100 bg-green-50 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white p-3">
                  <TrendingUp className="text-green-600" />
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Successful Payments
                  </p>

                  <h3 className="text-2xl font-bold text-green-700">
                    {loading ? "..." : successfulCount}
                  </h3>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-yellow-100 bg-yellow-50 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white p-3">
                  <CalendarDays className="text-yellow-600" />
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Pending Payments
                  </p>

                  <h3 className="text-2xl font-bold text-yellow-700">
                    {loading ? "..." : pendingCount}
                  </h3>
                </div>
              </div>
            </div>

          </div>

          {/* Search and Filter */}
          <div className="mb-6 rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

              <div className="relative w-full md:max-w-md">
                <Search
                  size={19}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <Input
                  placeholder="Search vendor, email or transaction ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-11 pl-10"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {["All", "Successful", "Failed", "Pending", "Refunded"].map(
                  (filter) => (
                    <Button
                      key={filter}
                      size="sm"
                      variant={
                        activeFilter === filter ? "default" : "outline"
                      }
                      onClick={() => setActiveFilter(filter)}
                      className={
                        activeFilter === filter
                          ? "bg-[#F77F00] hover:bg-[#e66f00]"
                          : ""
                      }
                    >
                      {filter}
                    </Button>
                  )
                )}
              </div>

            </div>
          </div>

          {/* Transactions Table */}
          <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm">

            <div className="border-b border-orange-100 px-6 py-5">
              <h2 className="text-lg font-bold text-[#252525]">
                Payment History
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {loading ? "Loading..." : `${filteredTransactions.length} transactions found`}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">

                <thead className="bg-orange-50 text-sm text-gray-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">
                      Transaction ID
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Vendor
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Plan
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Amount
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Payment Method
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Date
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">

                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-16 text-center text-gray-500">
                        Loading transactions...
                      </td>
                    </tr>
                  ) : filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction) => {
                      const transactionId =
                        transaction.id ||
                        transaction._id ||
                        transaction.stripeSessionId ||
                        "N/A";

                      return (
                        <tr
                          key={transactionId}
                          className="transition hover:bg-orange-50/50"
                        >
                          <td className="px-6 py-4 text-sm font-semibold text-[#F77F00]">
                            {transactionId}
                          </td>

                          <td className="px-6 py-4">
                            <p className="font-semibold text-[#252525]">
                              {transaction.vendorName || "Unknown Vendor"}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              {transaction.email || "N/A"}
                            </p>
                          </td>

                          <td className="px-6 py-4 text-sm text-gray-600">
                            {transaction.plan || "Premium"}
                          </td>

                          <td className="px-6 py-4 font-semibold text-[#252525]">
                            {formatCurrency(
                              transaction.amount,
                              transaction.currency || "usd"
                            )}
                          </td>

                          <td className="px-6 py-4">
                            <span className="flex items-center gap-2 text-sm text-gray-600">
                              <CreditCard size={16} />
                              {transaction.paymentMethod || "Stripe"}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-sm text-gray-500">
                            {formatDate(transaction.date || transaction.createdAt)}
                          </td>

                          <td className="px-6 py-4">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                statusStyles[transaction.status]
                              }`}
                            >
                              {statusLabels[transaction.status]}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-16 text-center">
                        <Receipt
                          size={42}
                          className="mx-auto mb-3 text-[#F77F00]"
                        />

                        <h3 className="font-bold text-[#252525]">
                          No Transactions Found
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          {error
                            ? "Please check your API connection and try again."
                            : "No real transactions are available for this search or filter."}
                        </p>
                      </td>
                    </tr>
                  )}

                </tbody>
              </table>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}