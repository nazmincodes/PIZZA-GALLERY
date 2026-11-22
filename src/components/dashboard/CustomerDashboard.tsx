"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Pizza,
  CalendarDays,
  Plus,
  TrendingUp,
  RefreshCw,
  Ban,
} from "lucide-react";

import { apiRequest } from "@/lib/api";

type CustomerDashboardProps = {
  name: string;
};

type CustomerOrder = {
  _id: string;
  pizzaName: string;
  quantity: number;
  totalPrice: number;
  status: string;
  createdAt: string;
};

type OrdersResponse = {
  success: boolean;
  total: number;
  orders: CustomerOrder[];
};

export default function CustomerDashboard({
  name,
}: CustomerDashboardProps) {
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelingOrderId, setCancelingOrderId] = useState("");
  const [cancelError, setCancelError] = useState("");

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiRequest("/api/orders/my-orders");
      const data = response as OrdersResponse;

      if (!data.success) {
        throw new Error("Failed to load customer dashboard.");
      }

      setOrders(data.orders ?? []);
      setTotalOrders(data.total ?? data.orders.length);
    } catch (err) {
      console.error("Customer dashboard error:", err);

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

  const handleCancelOrder = async (orderId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) return;

    try {
      setCancelingOrderId(orderId);
      setCancelError("");

      await apiRequest(`/api/orders/${orderId}/cancel`, {
        method: "PATCH",
      });

      await fetchDashboardData();
    } catch (err) {
      console.error("Cancel order error:", err);

      setCancelError(
        err instanceof Error
          ? err.message
          : "Failed to cancel order. Please try again."
      );
    } finally {
      setCancelingOrderId("");
    }
  };

  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  ).length;

  const acceptedOrders = orders.filter(
    (order) => order.status === "accepted"
  ).length;

  const rejectedOrders = orders.filter(
    (order) => order.status === "rejected"
  ).length;

  const stats = [
    {
      title: "Total Orders",
      value: totalOrders,
      icon: ShoppingBag,
      color: "bg-orange-100 text-orange-600",
    },
    {
      title: "Pending Orders",
      value: pendingOrders,
      icon: Clock,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      title: "Accepted Orders",
      value: acceptedOrders,
      icon: CheckCircle2,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Rejected Orders",
      value: rejectedOrders,
      icon: XCircle,
      color: "bg-red-100 text-red-500",
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
        return "bg-yellow-100 text-yellow-700";

      case "accepted":
      case "delivered":
        return "bg-green-100 text-green-700";

      case "preparing":
      case "ready":
      case "out_for_delivery":
        return "bg-blue-100 text-blue-700";

      case "rejected":
      case "cancelled":
        return "bg-red-100 text-red-600";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <main className="min-h-screen bg-[#FFF8F0] px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Welcome Section */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 to-orange-400 p-8 text-white md:p-10">
          <div className="relative z-10 max-w-2xl">
            <p className="mb-3 text-sm font-medium text-orange-100">
              CUSTOMER DASHBOARD
            </p>

            <h1 className="text-3xl font-bold md:text-4xl">
              Welcome back, {name}!
            </h1>

            <p className="mt-3 max-w-lg text-sm leading-7 text-orange-50 md:text-base">
              Your next favorite pizza is just a few clicks away.
              Explore delicious pizzas and keep track of your orders.
            </p>

            <Link
              href="/menu"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-orange-600 transition hover:bg-orange-50"
            >
              Explore Menu
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className="absolute -right-10 -top-10 hidden h-64 w-64 items-center justify-center rounded-full bg-white/10 md:flex">
            <Pizza size={130} className="rotate-12 text-white/80" />
          </div>

          <div className="absolute -bottom-20 right-40 h-48 w-48 rounded-full bg-white/10" />
        </section>

        {/* Statistics */}
        <section>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-[#252525]">
                Order Overview
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                A quick look at your ordering activity.
              </p>
            </div>

            <button
              onClick={fetchDashboardData}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg border border-orange-200 px-4 py-2 text-sm font-medium text-orange-600 transition hover:bg-orange-50 disabled:opacity-50"
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

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        {stat.title}
                      </p>

                      <h3 className="mt-3 text-3xl font-bold text-[#252525]">
                        {loading ? "..." : stat.value}
                      </h3>
                    </div>

                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}
                    >
                      <Icon size={23} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Recent Orders */}
        <section className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm md:p-8">
          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold text-[#252525]">
                Recent Orders
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Keep track of your latest pizza orders.
              </p>
            </div>

            <Link
              href="/menu"
              className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700"
            >
              Order More
              <ArrowRight size={16} />
            </Link>
          </div>

          {cancelError && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {cancelError}
            </div>
          )}

          {loading ? (
            <div className="py-10 text-center text-gray-500">
              Loading your orders...
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="rounded-xl bg-gray-50 py-10 text-center">
              <ShoppingBag
                size={35}
                className="mx-auto text-gray-300"
              />

              <p className="mt-3 font-medium text-gray-600">
                You haven't placed any orders yet.
              </p>

              <Link
                href="/menu"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600"
              >
                Explore Menu
                <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="flex flex-col justify-between gap-4 rounded-xl border border-gray-100 p-4 transition hover:border-orange-200 sm:flex-row sm:items-center"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                      <Pizza size={24} />
                    </div>

                    <div>
                      <h3 className="font-semibold text-[#252525]">
                        {order.pizzaName}
                      </h3>

                      <p className="mt-1 text-xs text-gray-400">
                        Order ID: {order._id.slice(-8).toUpperCase()}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <CalendarDays size={13} />
                          {formatDate(order.createdAt)}
                        </span>

                        <span>
                          Quantity: {order.quantity}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${getStatusStyle(
                        order.status
                      )}`}
                    >
                      {formatStatus(order.status)}
                    </span>

                    <p className="font-bold text-[#252525]">
                      ৳{order.totalPrice}
                    </p>

                    {order.status === "pending" && (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        disabled={cancelingOrderId === order._id}
                        className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {cancelingOrderId === order._id ? (
                          <>
                            <RefreshCw size={14} className="animate-spin" />
                            Cancelling...
                          </>
                        ) : (
                          <>
                            <Ban size={14} />
                            Cancel Order
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Link
            href="/menu"
            className="group flex items-center justify-between rounded-2xl border border-orange-100 bg-white p-6 transition hover:border-orange-300 hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                <Plus size={24} />
              </div>

              <div>
                <h3 className="font-bold text-[#252525]">
                  Order New Pizza
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Discover your next favorite flavor.
                </p>
              </div>
            </div>

            <ArrowRight
              size={20}
              className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-orange-500"
            />
          </Link>

          <div className="flex items-center justify-between rounded-2xl border border-orange-100 bg-white p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
                <TrendingUp size={24} />
              </div>

              <div>
                <h3 className="font-bold text-[#252525]">
                  PizzaHub Member
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Enjoy delicious moments with us.
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}