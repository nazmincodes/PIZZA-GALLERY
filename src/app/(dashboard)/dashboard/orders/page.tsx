"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Package,
  CheckCircle,
  XCircle,
  Clock,
  Search,
} from "lucide-react";
import { toast } from "sonner";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/api";

type OrderStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "preparing"
  | "ready"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

type Order = {
  _id: string;
  customerId: string;
  pizzaName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  deliveryDate: string;
  deliveryAddress: string;
  message?: string;
  status: OrderStatus;
  createdAt: string;
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
};

const statusLabels: Record<OrderStatus, string> = {
  pending: "Pending",
  accepted: "Accepted",
  rejected: "Rejected",
  preparing: "Preparing",
  ready: "Ready",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const result = await apiRequest("/api/orders/vendor-orders");

      setOrders(result.orders || []);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (
    orderId: string,
    newStatus: "accepted" | "rejected"
  ) => {
    try {
      setUpdatingId(orderId);

      const result = await apiRequest(
        `/api/orders/${orderId}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({ status: newStatus }),
        }
      );

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order._id === orderId
            ? { ...order, status: newStatus }
            : order
        )
      );

      toast.success(
        result.message ||
          `Order ${newStatus} successfully!`
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update order."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const customerName =
      order.customer?.name || order.customerName || "";

    const matchesSearch =
      customerName.toLowerCase().includes(search.toLowerCase()) ||
      order.pizzaName.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || order.status === filter;

    return matchesSearch && matchesFilter;
  });

  const pendingCount = orders.filter(
    (order) => order.status === "pending"
  ).length;

  const acceptedCount = orders.filter(
    (order) => order.status === "accepted"
  ).length;

  const rejectedCount = orders.filter(
    (order) => order.status === "rejected"
  ).length;

  const statistics = [
    {
      label: "Total Orders",
      value: orders.length,
      color: "text-[#252525]",
      icon: Package,
    },
    {
      label: "Pending",
      value: pendingCount,
      color: "text-amber-600",
      icon: Clock,
    },
    {
      label: "Accepted",
      value: acceptedCount,
      color: "text-green-600",
      icon: CheckCircle,
    },
    {
      label: "Rejected",
      value: rejectedCount,
      color: "text-red-600",
      icon: XCircle,
    },
  ];

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#FFF8F0]">
        <section className="mx-auto max-w-6xl px-5 py-12">
          <div className="mb-8">
            <Link
              href="/dashboard"
              className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#F77F00]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>

            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#F77F00]">
              Vendor Dashboard
            </p>

            <h1 className="text-3xl font-bold text-[#252525]">
              Customer Orders
            </h1>

            <p className="mt-2 text-gray-500">
              Manage your incoming orders and keep your customers happy.
            </p>
          </div>

          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statistics.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      {stat.label}
                    </p>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>

                  <h2 className={`mt-3 text-3xl font-bold ${stat.color}`}>
                    {stat.value}
                  </h2>
                </div>
              );
            })}
          </div>

          <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-orange-100 bg-white p-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

              <Input
                placeholder="Search customer or pizza..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-md border border-input bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#F77F00]"
            >
              <option value="All">All Orders</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {loading ? (
            <div className="rounded-2xl bg-white py-16 text-center text-gray-500">
              Loading orders...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-orange-200 bg-white py-16 text-center">
              <Package className="mx-auto mb-4 h-12 w-12 text-orange-300" />

              <h3 className="text-xl font-semibold text-[#252525]">
                No Orders Found
              </h3>

              <p className="mt-2 text-gray-500">
                No orders match your search or selected filter.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {filteredOrders.map((order) => {
                const customerName =
                  order.customer?.name ||
                  order.customerName ||
                  "Customer";

                const customerEmail =
                  order.customer?.email ||
                  order.customerEmail ||
                  "Not available";

                return (
                  <div
                    key={order._id}
                    className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6"
                  >
                    <div className="mb-5 flex flex-col justify-between gap-3 border-b border-orange-100 pb-4 sm:flex-row sm:items-center">
                      <div>
                        <p className="text-sm text-gray-400">
                          Order #{order._id.slice(-8)}
                        </p>

                        <h2 className="mt-1 text-xl font-bold text-[#252525]">
                          {order.pizzaName}
                        </h2>
                      </div>

                      <Badge
                        className={`w-fit text-white ${
                          order.status === "accepted" ||
                          order.status === "delivered"
                            ? "bg-green-600"
                            : order.status === "pending"
                              ? "bg-amber-500"
                              : order.status === "rejected" ||
                                  order.status === "cancelled"
                                ? "bg-red-500"
                                : "bg-blue-600"
                        }`}
                      >
                        {statusLabels[order.status]}
                      </Badge>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                          Customer Information
                        </p>

                        <h3 className="mt-2 font-semibold text-[#252525]">
                          {customerName}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          {customerEmail}
                        </p>

                        {order.customer?.phone ||
                        order.customerPhone ? (
                          <p className="mt-1 text-sm text-gray-500">
                            Phone:{" "}
                            {order.customer?.phone ||
                              order.customerPhone}
                          </p>
                        ) : null}

                        <p className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                          <MapPin className="h-4 w-4 text-[#F77F00]" />
                          {order.deliveryAddress}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                          Delivery Information
                        </p>

                        <p className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                          <CalendarDays className="h-4 w-4 text-[#F77F00]" />
                          Delivery:{" "}
                          {new Date(
                            order.deliveryDate
                          ).toLocaleDateString()}
                        </p>

                        <p className="mt-2 text-sm text-gray-500">
                          Ordered:{" "}
                          {new Date(
                            order.createdAt
                          ).toLocaleDateString()}
                        </p>

                        <p className="mt-2 text-sm text-gray-500">
                          Quantity: {order.quantity}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 rounded-xl bg-orange-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Customer Message
                      </p>

                      <p className="mt-2 text-sm text-gray-700">
                        {order.message || "No additional message."}
                      </p>
                    </div>

                    <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                      <p className="text-xl font-bold text-[#252525]">
                        Total: ৳{order.totalPrice}
                      </p>

                      {order.status === "pending" ? (
                        <div className="flex gap-3">
                          <Button
                            disabled={updatingId === order._id}
                            onClick={() =>
                              handleStatusChange(
                                order._id,
                                "accepted"
                              )
                            }
                            className="bg-green-600 text-white hover:bg-green-700"
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Accept
                          </Button>

                          <Button
                            disabled={updatingId === order._id}
                            onClick={() =>
                              handleStatusChange(
                                order._id,
                                "rejected"
                              )
                            }
                            variant="destructive"
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <p className="text-sm font-medium text-gray-400">
                          Decision already submitted
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}