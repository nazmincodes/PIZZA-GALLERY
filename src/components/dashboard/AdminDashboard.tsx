"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Store,
  UserRound,
  Pizza,
  Clock,
  CreditCard,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Settings,
  Loader2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

import { apiRequest } from "@/lib/api";

type AdminDashboardProps = {
  name: string;
};

type PendingItem = {
  _id?: string;
  id?: string;
  name?: string;
  title?: string;
  vendorName?: string;
  vendor?: string | { name?: string; shopName?: string };
  category?: string;
  price?: number;
};

type DashboardStats = {
  totalUsers: number;
  totalVendors: number;
  totalCustomers: number;
  totalMenuItems: number;
  pendingApprovals: number;
  totalTransactions: number;
};

const initialStats: DashboardStats = {
  totalUsers: 0,
  totalVendors: 0,
  totalCustomers: 0,
  totalMenuItems: 0,
  pendingApprovals: 0,
  totalTransactions: 0,
};

export default function AdminDashboard({
  name,
}: AdminDashboardProps) {
  const [stats, setStats] = useState(initialStats);
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");

    const results = await Promise.allSettled([
      apiRequest("/api/admin/overview"),
      apiRequest("/api/admin/menu/pending"),
    ]);

    const overviewResult = results[0];
    const pendingResult = results[1];

    let hasError = false;

    if (overviewResult.status === "fulfilled") {
      const overview =
        overviewResult.value.statistics || overviewResult.value;

      setStats({
        totalUsers: overview.totalUsers ?? 0,
        totalVendors: overview.totalVendors ?? 0,
        totalCustomers: overview.totalCustomers ?? 0,
        totalMenuItems: overview.totalMenuItems ?? 0,
        pendingApprovals: overview.pendingApprovals ?? 0,
        totalTransactions: overview.totalTransactions ?? 0,
      });
    } else {
      hasError = true;
      console.error("Overview API error:", overviewResult.reason);
    }

    if (pendingResult.status === "fulfilled") {
      const response = pendingResult.value;

      const pendingList =
        response.menuItems ||
        response.items ||
        response.data ||
        [];

      setPendingItems(pendingList);
    } else {
      hasError = true;
      console.error("Pending menu API error:", pendingResult.reason);
    }

    if (hasError) {
      setError(
        "Some dashboard information could not be loaded. Please refresh."
      );
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      description: "Registered accounts",
      icon: Users,
    },
    {
      title: "Total Vendors",
      value: stats.totalVendors,
      description: "Registered pizza shops",
      icon: Store,
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      description: "Registered customers",
      icon: UserRound,
    },
    {
      title: "Total Menu Items",
      value: stats.totalMenuItems,
      description: "Submitted pizza items",
      icon: Pizza,
    },
    {
      title: "Pending Approvals",
      value: stats.pendingApprovals,
      description: "Waiting for review",
      icon: Clock,
    },
    {
      title: "Total Transactions",
      value: stats.totalTransactions,
      description: "Recorded transactions",
      icon: CreditCard,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <section className="relative overflow-hidden rounded-3xl bg-[#252525] p-8 text-white md:p-10">
        <div className="relative z-10 max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-orange-300">
            <ShieldCheck size={17} />
            Administration Panel
          </div>

          <h1 className="text-3xl font-bold md:text-4xl">
            Welcome, {name}!
          </h1>

          <p className="mt-4 leading-7 text-gray-300">
            Manage users, review submitted menu items, monitor
            transactions and keep the PizzaHub platform running smoothly.
          </p>

          <Link
            href="/dashboard/users"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#F77F00] px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
          >
            <Users size={19} />
            Manage Users
          </Link>
        </div>

        <ShieldCheck
          size={190}
          className="absolute -right-8 -bottom-10 rotate-12 text-white/5"
        />
      </section>

      {/* Platform Overview */}
      <section>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-[#252525]">
              Platform Overview
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Live statistics from your PizzaHub database.
            </p>
          </div>

          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-orange-200 px-4 py-2 text-sm font-medium text-[#F77F00] transition hover:bg-orange-50 disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            <div className="flex items-center gap-2">
              <AlertCircle size={18} />
              <p>{error}</p>
            </div>

            <button
              onClick={fetchDashboardData}
              className="shrink-0 font-semibold underline"
            >
              Try again
            </button>
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {statCards.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="rounded-xl bg-orange-50 p-3 text-[#F77F00]">
                    <Icon size={23} />
                  </div>

                  <ArrowUpRight
                    size={20}
                    className="text-gray-400"
                  />
                </div>

                <h3 className="mt-5 text-3xl font-bold text-[#252525]">
                  {loading ? (
                    <Loader2 className="animate-spin" size={25} />
                  ) : (
                    stat.value.toLocaleString()
                  )}
                </h3>

                <p className="mt-1 font-medium text-gray-700">
                  {stat.title}
                </p>

                <p className="mt-2 text-sm text-gray-400">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="mb-5 text-2xl font-bold text-[#252525]">
          Administration
        </h2>

        <div className="grid gap-5 md:grid-cols-3">
          <Link
            href="/dashboard/users"
            className="flex items-center gap-4 rounded-2xl border border-orange-100 bg-white p-5 transition hover:border-orange-300 hover:shadow-md"
          >
            <div className="rounded-xl bg-orange-50 p-3 text-[#F77F00]">
              <Users size={25} />
            </div>

            <div>
              <h3 className="font-semibold text-[#252525]">
                Manage Users
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                View and manage accounts.
              </p>
            </div>
          </Link>

          <Link
            href="/dashboard/approvals"
            className="flex items-center gap-4 rounded-2xl border border-orange-100 bg-white p-5 transition hover:border-orange-300 hover:shadow-md"
          >
            <div className="rounded-xl bg-orange-50 p-3 text-[#F77F00]">
              <CheckCircle2 size={25} />
            </div>

            <div>
              <h3 className="font-semibold text-[#252525]">
                Menu Approvals
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Review submitted menu items.
              </p>
            </div>
          </Link>

          <Link
            href="/dashboard/transactions"
            className="flex items-center gap-4 rounded-2xl border border-orange-100 bg-white p-5 transition hover:border-orange-300 hover:shadow-md"
          >
            <div className="rounded-xl bg-orange-50 p-3 text-[#F77F00]">
              <CreditCard size={25} />
            </div>

            <div>
              <h3 className="font-semibold text-[#252525]">
                Transactions
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Monitor subscription payments.
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* Pending Menu Items */}
      <section className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm md:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-[#252525]">
              Pending Menu Approvals
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Review new items submitted by vendors.
            </p>
          </div>

          <Link
            href="/dashboard/approvals"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#F77F00] hover:text-orange-700"
          >
            View All
            <ArrowUpRight size={17} />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-[#F77F00]" size={30} />
          </div>
        ) : pendingItems.length === 0 ? (
          <div className="rounded-xl bg-gray-50 py-10 text-center">
            <CheckCircle2
              size={35}
              className="mx-auto text-green-500"
            />
            <p className="mt-3 font-medium text-gray-700">
              No pending menu approvals.
            </p>
            <p className="mt-1 text-sm text-gray-400">
              All submitted menu items have been reviewed.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingItems.slice(0, 5).map((item, index) => {
              const vendor =
                typeof item.vendor === "string"
                  ? item.vendor
                  : item.vendor?.shopName ||
                    item.vendor?.name ||
                    item.vendorName ||
                    "Vendor";

              return (
                <div
                  key={item._id || item.id || index}
                  className="flex flex-col gap-4 rounded-xl border border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <h3 className="font-semibold text-[#252525]">
                      {item.name || item.title || "Untitled Menu Item"}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {vendor} · {item.category || "Uncategorized"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:justify-end">
                    <p className="font-bold text-[#252525]">
                      {typeof item.price === "number"
                        ? `৳${item.price.toLocaleString()}`
                        : "Price unavailable"}
                    </p>

                    <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                      Pending
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Platform Settings */}
      <Link
        href="/dashboard/settings"
        className="flex items-center justify-between rounded-2xl border border-orange-100 bg-white p-6 transition hover:border-orange-300 hover:shadow-md"
      >
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-orange-50 p-3 text-[#F77F00]">
            <Settings size={24} />
          </div>

          <div>
            <h3 className="font-semibold text-[#252525]">
              Platform Settings
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Manage platform configurations.
            </p>
          </div>
        </div>

        <ArrowUpRight className="text-gray-400" />
      </Link>
    </div>
  );
}