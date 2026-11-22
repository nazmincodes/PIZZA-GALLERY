"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Pizza,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Plus,
  ArrowUpRight,
  Store,
  Package,
  RefreshCw,
} from "lucide-react";

import { apiRequest } from "@/lib/api";

type VendorDashboardProps = {
  name: string;
};

type MenuItem = {
  _id: string;
};

type VendorOrder = {
  _id: string;
  customerId: string;
  pizzaName: string;
  quantity: number;
  totalPrice: number;
  status: string;
  createdAt: string;
};

type MenuResponse = {
  success: boolean;
  total: number;
  menuItems: MenuItem[];
};

type OrdersResponse = {
  success: boolean;
  total: number;
  orders: VendorOrder[];
};

type Subscription = {
  plan: "free" | "premium";
  status: string;
  startDate: string | null;
  expiryDate: string | null;
  cancelAtPeriodEnd: boolean;
  activeMenuCount: number;
  menuLimit: number | null;
  remainingMenuSlots: number | null;
};

type Transaction = {
  _id: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
};

type SubscriptionResponse = {
  success: boolean;
  subscription: Subscription;
  transactions: Transaction[];
};

export default function VendorDashboard({
  name,
}: VendorDashboardProps) {
  const [menuCount, setMenuCount] = useState(0);
  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [subscription, setSubscription] =
  useState<Subscription | null>(null);

const [transactions, setTransactions] =
  useState<Transaction[]>([]);
 const fetchDashboardData = async () => {
  try {
    setLoading(true);
    setError("");

    const [
      menuResponse,
      ordersResponse,
      subscriptionResponse,
    ] = await Promise.all([
      apiRequest("/api/menu/my-items"),
      apiRequest("/api/orders/vendor-orders"),
      apiRequest("/api/subscriptions/me"),
    ]);

    const menuData = menuResponse as MenuResponse;
    const orderData = ordersResponse as OrdersResponse;
    const subscriptionData =
      subscriptionResponse as SubscriptionResponse;

    if (
      !menuData.success ||
      !orderData.success ||
      !subscriptionData.success
    ) {
      throw new Error("Failed to load dashboard data.");
    }

    setMenuCount(menuData.total ?? menuData.menuItems.length);
    setOrders(orderData.orders ?? []);
    setTotalOrders(orderData.total ?? orderData.orders.length);

    setSubscription(subscriptionData.subscription);
    setTransactions(subscriptionData.transactions ?? []);

  } catch (err) {
    console.error("Vendor dashboard error:", err);

    setError(
      err instanceof Error
        ? err.message
        : "Failed to load dashboard data."
    );
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  ).length;

  const acceptedOrders = orders.filter(
    (order) => order.status === "accepted"
  ).length;

  const stats = [
    {
      title: "Total Menu Items",
      value: menuCount,
      icon: Pizza,
      description: "Your listed pizzas",
    },
    {
      title: "Total Orders",
      value: totalOrders,
      icon: ShoppingBag,
      description: "Orders received",
    },
    {
      title: "Pending Orders",
      value: pendingOrders,
      icon: Clock,
      description: "Waiting for action",
    },
    {
      title: "Accepted Orders",
      value: acceptedOrders,
      icon: CheckCircle2,
      description: "Successfully accepted",
    },
  ];

  const recentOrders = orders.slice(0, 5);

  const formatDate = (date: string) => {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatStatus = (status: string) => {
    return status.replaceAll("_", " ");
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-orange-100 text-orange-700";

      case "accepted":
      case "delivered":
        return "bg-green-100 text-green-700";

      case "preparing":
      case "ready":
      case "out_for_delivery":
        return "bg-blue-100 text-blue-700";

      case "rejected":
      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-8">

      {/* Welcome Section */}
      <section className="relative overflow-hidden rounded-3xl bg-[#252525] p-8 text-white md:p-10">
        <div className="relative z-10 max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-orange-300">
            <Store size={16} />
            Vendor Workspace
          </div>

          <h1 className="text-3xl font-bold md:text-4xl">
            Welcome back, {name}!
          </h1>

          <p className="mt-4 leading-7 text-gray-300">
            Manage your pizza shop, organize your menu, and keep
            track of customer orders from one place.
          </p>

          <Link
            href="/dashboard/add-item"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#F77F00] px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
          >
            <Plus size={19} />
            Add New Pizza
          </Link>
        </div>

        <Pizza
          size={190}
          className="absolute -right-8 -bottom-10 rotate-12 text-white/5"
        />
      </section>

      {/* Subscription Overview */}
<section className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
  <div className="flex flex-wrap items-center justify-between gap-4">
    <div>
      <h2 className="text-2xl font-bold text-[#252525]">
        My Subscription
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        Manage your current subscription plan.
      </p>
    </div>

    <Link
      href="/dashboard/subscription"
      className="rounded-xl bg-[#F77F00] px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600"
    >
      Manage Subscription
    </Link>
  </div>

  {loading ? (
    <p className="mt-6 text-gray-500">Loading subscription...</p>
  ) : subscription ? (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-xl bg-orange-50 p-5">
        <p className="text-sm text-gray-500">Current Plan</p>
        <h3 className="mt-2 text-2xl font-bold capitalize text-[#F77F00]">
          {subscription.plan}
        </h3>
      </div>

      <div className="rounded-xl bg-gray-50 p-5">
        <p className="text-sm text-gray-500">Subscription Status</p>
        <h3 className="mt-2 text-xl font-bold capitalize text-[#252525]">
          {subscription.status.replaceAll("_", " ")}
        </h3>
      </div>

      <div className="rounded-xl bg-gray-50 p-5">
        <p className="text-sm text-gray-500">Active Menu Items</p>
        <h3 className="mt-2 text-2xl font-bold text-[#252525]">
          {subscription.activeMenuCount}
          {subscription.menuLimit !== null
            ? ` / ${subscription.menuLimit}`
            : " / Unlimited"}
        </h3>
      </div>

      <div className="rounded-xl bg-gray-50 p-5">
        <p className="text-sm text-gray-500">Remaining Slots</p>
        <h3 className="mt-2 text-2xl font-bold text-[#252525]">
          {subscription.remainingMenuSlots ?? "Unlimited"}
        </h3>
      </div>

      <div className="rounded-xl bg-gray-50 p-5 sm:col-span-2">
        <p className="text-sm text-gray-500">Subscription Start</p>
        <p className="mt-2 font-semibold text-[#252525]">
          {subscription.startDate
            ? formatDate(subscription.startDate)
            : "Not available"}
        </p>
      </div>

      <div className="rounded-xl bg-gray-50 p-5 sm:col-span-2">
        <p className="text-sm text-gray-500">Expiry Date</p>
        <p className="mt-2 font-semibold text-[#252525]">
          {subscription.expiryDate
            ? formatDate(subscription.expiryDate)
            : "Not available"}
        </p>
      </div>

      {subscription.cancelAtPeriodEnd && (
        <p className="text-sm font-medium text-orange-600 sm:col-span-2 lg:col-span-4">
          Your subscription is scheduled to end at the current billing period.
        </p>
      )}
    </div>
  ) : (
    <p className="mt-6 text-gray-500">
      Subscription information is unavailable.
    </p>
  )}

  <div className="mt-8">
    <h3 className="mb-4 text-lg font-bold text-[#252525]">
      Recent Payment History
    </h3>

    {transactions.length === 0 ? (
      <p className="rounded-xl bg-gray-50 p-5 text-sm text-gray-500">
        No payment history available.
      </p>
    ) : (
      <div className="space-y-3">
        {transactions.slice(0, 5).map((transaction) => (
          <div
            key={transaction._id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-100 p-4"
          >
            <div>
              <p className="font-semibold text-[#252525]">
                Premium Subscription
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {formatDate(transaction.createdAt)}
              </p>
            </div>

            <div className="text-right">
              <p className="font-bold text-[#252525]">
                {transaction.amount}{" "}
                {transaction.currency.toUpperCase()}
              </p>
              <span className="text-xs font-semibold capitalize text-green-600">
                {transaction.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
</section>

      {/* Statistics */}
      <section>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-[#252525]">
              Shop Overview
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              A quick overview of your shop performance.
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
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            <p>{error}</p>

            <button
              onClick={fetchDashboardData}
              className="font-semibold underline"
            >
              Try Again
            </button>
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
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
                  {loading ? "..." : stat.value}
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
          Quick Actions
        </h2>

        <div className="grid gap-5 md:grid-cols-3">

          <Link
            href="/dashboard/add-item"
            className="group flex items-center gap-4 rounded-2xl border border-orange-100 bg-white p-5 transition hover:border-orange-300 hover:shadow-md"
          >
            <div className="rounded-xl bg-orange-50 p-3 text-[#F77F00]">
              <Plus size={25} />
            </div>

            <div>
              <h3 className="font-semibold text-[#252525]">
                Add Menu Item
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Add a new pizza to your shop.
              </p>
            </div>
          </Link>

          <Link
            href="/dashboard/my-items"
            className="group flex items-center gap-4 rounded-2xl border border-orange-100 bg-white p-5 transition hover:border-orange-300 hover:shadow-md"
          >
            <div className="rounded-xl bg-orange-50 p-3 text-[#F77F00]">
              <Package size={25} />
            </div>

            <div>
              <h3 className="font-semibold text-[#252525]">
                Manage Menu
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Update your pizza items.
              </p>
            </div>
          </Link>

          <Link
            href="/dashboard/orders"
            className="group flex items-center gap-4 rounded-2xl border border-orange-100 bg-white p-5 transition hover:border-orange-300 hover:shadow-md"
          >
            <div className="rounded-xl bg-orange-50 p-3 text-[#F77F00]">
              <ShoppingBag size={25} />
            </div>

            <div>
              <h3 className="font-semibold text-[#252525]">
                Manage Orders
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                View customer orders.
              </p>
            </div>
          </Link>

        </div>
      </section>

      {/* Recent Orders */}
      <section className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm md:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-[#252525]">
              Recent Orders
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Keep track of your latest customer orders.
            </p>
          </div>

          <Link
            href="/dashboard/orders"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#F77F00] hover:text-orange-700"
          >
            View All
            <ArrowUpRight size={17} />
          </Link>
        </div>

        {loading ? (
          <div className="py-10 text-center text-gray-500">
            Loading recent orders...
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="rounded-xl bg-gray-50 py-10 text-center">
            <ShoppingBag
              size={35}
              className="mx-auto text-gray-300"
            />

            <p className="mt-3 font-medium text-gray-600">
              No orders received yet.
            </p>

            <p className="mt-1 text-sm text-gray-400">
              Your customer orders will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order._id}
                className="flex flex-col gap-4 rounded-xl border border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-[#252525]">
                    {order.pizzaName}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Customer ID: {order.customerId} · Order #
                    {order._id.slice(-6).toUpperCase()}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    {formatDate(order.createdAt)} · Quantity:{" "}
                    {order.quantity}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <p className="font-bold text-[#252525]">
                    ৳{order.totalPrice}
                  </p>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                      order.status
                    )}`}
                  >
                    {formatStatus(order.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}