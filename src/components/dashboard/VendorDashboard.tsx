
"use client";

import Link from "next/link";
import {
  Pizza,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Plus,
  ArrowUpRight,
  Store,
  TrendingUp,
  Package,
} from "lucide-react";

type VendorDashboardProps = {
  name: string;
};

const stats = [
  {
    title: "Total Menu Items",
    value: "12",
    icon: Pizza,
    description: "Your listed pizzas",
  },
  {
    title: "Total Orders",
    value: "48",
    icon: ShoppingBag,
    description: "Orders received",
  },
  {
    title: "Pending Orders",
    value: "08",
    icon: Clock,
    description: "Waiting for action",
  },
  {
    title: "Accepted Orders",
    value: "32",
    icon: CheckCircle2,
    description: "Successfully accepted",
  },
];

const recentOrders = [
  {
    id: "PH-2001",
    customer: "Rahim Hasan",
    item: "Pepperoni Feast",
    date: "Nov 19, 2026",
    price: 850,
    status: "Pending",
  },
  {
    id: "PH-2002",
    customer: "Sarah Ahmed",
    item: "Italian Margherita",
    date: "Nov 18, 2026",
    price: 650,
    status: "Accepted",
  },
  {
    id: "PH-2003",
    customer: "Nusrat Jahan",
    item: "BBQ Chicken Pizza",
    date: "Nov 18, 2026",
    price: 950,
    status: "Pending",
  },
];

export default function VendorDashboard({
  name,
}: VendorDashboardProps) {
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

      {/* Statistics */}
      <section>
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-[#252525]">
            Shop Overview
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            A quick overview of your shop performance.
          </p>
        </div>

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
                  {stat.value}
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

        <div className="space-y-4">
          {recentOrders.map((order) => (
            <div
              key={order.id}
              className="flex flex-col gap-4 rounded-xl border border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-semibold text-[#252525]">
                  {order.item}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  {order.customer} · {order.id}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  {order.date}
                </p>
              </div>

              <div className="flex items-center justify-between gap-4 sm:justify-end">
                <p className="font-bold text-[#252525]">
                  ৳{order.price}
                </p>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    order.status === "Pending"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
