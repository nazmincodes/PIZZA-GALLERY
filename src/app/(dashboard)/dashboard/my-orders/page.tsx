"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Ban,
  MapPin,
  CalendarDays,
  ShoppingBag,
  Truck,
  PackageCheck,
} from "lucide-react";
import { toast } from "sonner";
import { apiRequest } from "@/lib/api";

type OrderStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "cancelled"
  | "preparing"
  | "ready"
  | "out_for_delivery"
  | "delivered";

type Order = {
  _id: string;
  pizzaName: string;
  pizzaImage: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  vendorId: string;
  deliveryAddress: string;
  deliveryDate: string;
  createdAt: string;
  status: OrderStatus;
};

const statusStyles: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  accepted: "bg-blue-100 text-blue-700",
  rejected: "bg-red-100 text-red-700",
  cancelled: "bg-gray-100 text-gray-600",
  preparing: "bg-purple-100 text-purple-700",
  ready: "bg-indigo-100 text-indigo-700",
  out_for_delivery: "bg-orange-100 text-orange-700",
  delivered: "bg-green-100 text-green-700",
};

const formatStatus = (status: OrderStatus) =>
  status.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const result = await apiRequest("/api/orders/my-orders");

      setOrders(result.orders || []);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (id: string) => {
    try {
      setCancellingId(id);

      await apiRequest(`/api/orders/${id}/cancel`, {
        method: "PATCH",
      });

      setOrders((previous) =>
        previous.map((order) =>
          order._id === id
            ? { ...order, status: "cancelled" }
            : order
        )
      );

      toast.success("Order cancelled successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to cancel order."
      );
    } finally {
      setCancellingId(null);
    }
  };

  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  ).length;

  const acceptedOrders = orders.filter((order) =>
    ["accepted", "preparing", "ready", "out_for_delivery"].includes(
      order.status
    )
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "delivered"
  ).length;

  const rejectedOrders = orders.filter((order) =>
    ["rejected", "cancelled"].includes(order.status)
  ).length;

  const filters = [
    "All",
    "pending",
    "accepted",
    "preparing",
    "ready",
    "out_for_delivery",
    "delivered",
    "rejected",
    "cancelled",
  ];

  const filteredOrders = orders.filter((order) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      order.pizzaName.toLowerCase().includes(searchText) ||
      order.vendorId.toLowerCase().includes(searchText) ||
      order._id.toLowerCase().includes(searchText);

    const matchesFilter =
      activeFilter === "All" || order.status === activeFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#FFF8F0]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="mb-2 text-sm font-bold tracking-wider text-[#F77F00]">
              CUSTOMER DASHBOARD
            </p>

            <h1 className="text-3xl font-extrabold text-[#252525] md:text-4xl">
              My Orders
            </h1>

            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              Manage your orders and track your pizza deliveries.
            </p>
          </div>

          {/* Statistics */}
          <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
            {[
              { label: "Total Orders", value: orders.length, icon: Package },
              { label: "Pending", value: pendingOrders, icon: Clock },
              { label: "Active", value: acceptedOrders, icon: CheckCircle },
              { label: "Delivered", value: deliveredOrders, icon: PackageCheck },
              { label: "Rejected / Cancelled", value: rejectedOrders, icon: XCircle },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500 sm:text-sm">
                    {item.label}
                  </p>
                  <item.icon size={20} className="text-[#F77F00]" />
                </div>
                <h2 className="mt-4 text-2xl font-bold text-[#252525]">
                  {loading ? "..." : item.value}
                </h2>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="mb-6 rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
            <div className="relative mb-5 w-full md:max-w-md">
              <Search
                size={19}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <Input
                placeholder="Search pizza, vendor ID or order ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <Button
                  key={filter}
                  size="sm"
                  variant={activeFilter === filter ? "default" : "outline"}
                  onClick={() => setActiveFilter(filter)}
                  className={
                    activeFilter === filter
                      ? "bg-[#F77F00] hover:bg-[#e66f00]"
                      : ""
                  }
                >
                  {filter === "All" ? "All" : formatStatus(filter as OrderStatus)}
                </Button>
              ))}
            </div>
          </div>

          {/* Orders */}
          <div className="space-y-5">
            {loading ? (
              <div className="rounded-2xl bg-white py-16 text-center">
                <p className="text-gray-500">Loading your orders...</p>
              </div>
            ) : filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <div
                  key={order._id}
                  className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm"
                >
                  <div className="flex flex-col gap-5 p-5 md:flex-row">
                    <div className="h-48 w-full shrink-0 overflow-hidden rounded-xl md:h-36 md:w-40">
                      <img
                        src={order.pizzaImage}
                        alt={order.pizzaName}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-medium text-gray-400">
                            ORDER ID: {order._id}
                          </p>
                          <h3 className="mt-1 text-xl font-bold text-[#252525]">
                            {order.pizzaName}
                          </h3>
                        </div>

                        <span
                          className={`rounded-full px-4 py-1.5 text-xs font-bold ${statusStyles[order.status]}`}
                        >
                          {formatStatus(order.status)}
                        </span>
                      </div>

                      <p className="mb-3 break-all text-xs text-gray-500">
                        Vendor ID: {order.vendorId}
                      </p>

                      <div className="grid gap-3 text-sm text-gray-500 sm:grid-cols-2">
                        <p className="flex items-start gap-2">
                          <MapPin size={16} className="mt-0.5 shrink-0 text-[#F77F00]" />
                          {order.deliveryAddress}
                        </p>

                        <p className="flex items-center gap-2">
                          <CalendarDays size={16} className="shrink-0 text-[#F77F00]" />
                          Delivery: {new Date(order.deliveryDate).toLocaleDateString()}
                        </p>

                        <p className="flex items-center gap-2">
                          <ShoppingBag size={16} className="shrink-0 text-[#F77F00]" />
                          Quantity: {order.quantity}
                        </p>

                        <p className="flex items-center gap-2">
                          <Truck size={16} className="shrink-0 text-[#F77F00]" />
                          Ordered: {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
                        <div>
                          <p className="text-xs text-gray-400">Total Amount</p>
                          <p className="text-xl font-extrabold text-[#F77F00]">
                            ৳{order.totalPrice}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {order.status === "pending" && (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={cancellingId === order._id}
                              onClick={() => handleCancelOrder(order._id)}
                              className="border-red-200 text-red-600 hover:bg-red-50"
                            >
                              <Ban size={15} className="mr-1" />
                              {cancellingId === order._id
                                ? "Cancelling..."
                                : "Cancel Order"}
                            </Button>
                          )}

                          <Link href="/menu">
                            <Button
                              size="sm"
                              className="bg-[#252525] hover:bg-[#F77F00]"
                            >
                              Order Again
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-orange-200 bg-white px-5 py-16 text-center">
                <Package size={48} className="mx-auto mb-4 text-[#F77F00]" />
                <h3 className="text-xl font-bold text-[#252525]">
                  No Orders Found
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  You haven't placed any matching orders yet.
                </p>
                <Link href="/menu">
                  <Button className="mt-4 bg-[#F77F00] hover:bg-[#e66f00]">
                    Explore Menu
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}