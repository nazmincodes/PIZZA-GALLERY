"use client";

import Link from "next/link";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Pizza,
  MapPin,
  CalendarDays,
  Plus,
  TrendingUp,
} from "lucide-react";

type CustomerDashboardProps = {
  name: string;
};

const stats = [
  {
    title: "Total Orders",
    value: "12",
    icon: ShoppingBag,
    color: "bg-orange-100 text-orange-600",
  },
  {
    title: "Pending Orders",
    value: "02",
    icon: Clock,
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    title: "Accepted Orders",
    value: "08",
    icon: CheckCircle2,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Rejected Orders",
    value: "02",
    icon: XCircle,
    color: "bg-red-100 text-red-500",
  },
];

const recentOrders = [
  {
    id: "PH-1001",
    name: "Pepperoni Feast",
    date: "Nov 18, 2026",
    price: 650,
    status: "Accepted",
    color: "bg-green-100 text-green-700",
  },
  {
    id: "PH-1002",
    name: "Italian Margherita",
    date: "Nov 17, 2026",
    price: 450,
    status: "Pending",
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    id: "PH-1003",
    name: "BBQ Chicken Pizza",
    date: "Nov 15, 2026",
    price: 680,
    status: "Rejected",
    color: "bg-red-100 text-red-600",
  },
];

export default function CustomerDashboard({
  name,
}: CustomerDashboardProps) {
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
          <div className="mb-5">
            <h2 className="text-xl font-bold text-[#252525]">
              Order Overview
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              A quick look at your ordering activity.
            </p>
          </div>

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
                        {stat.value}
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

          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex flex-col justify-between gap-4 rounded-xl border border-gray-100 p-4 transition hover:border-orange-200 sm:flex-row sm:items-center"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                    <Pizza size={24} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-[#252525]">
                      {order.name}
                    </h3>

                    <p className="mt-1 text-xs text-gray-400">
                      Order ID: {order.id}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <CalendarDays size={13} />
                        {order.date}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${order.color}`}
                  >
                    {order.status}
                  </span>

                  <p className="font-bold text-[#252525]">
                    ৳{order.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
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