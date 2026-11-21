"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/api";

import {
  Search,
  Pizza,
  Clock,
  CheckCircle,
  XCircle,
  Trash2,
  MapPin,
  Loader2,
} from "lucide-react";

import { toast } from "sonner";

type ItemStatus = "Pending" | "Approved" | "Rejected";

type MenuItem = {
  _id: string;
  name: string;
  vendorName?: string;
  vendor?: string | {
    name?: string;
    shopName?: string;
  };
  category?: string;
  price: number;
  location?: string;
  image?: string;
  status: ItemStatus;
};

const statusStyles: Record<ItemStatus, string> = {
  Pending: "bg-yellow-100 text-yellow-700",
  Approved: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
};

export default function MenuApprovalsPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Load menu items from database
  const fetchMenuItems = async () => {
    try {
      setLoading(true);

      const response = await apiRequest("/api/admin/menu/pending");

      const menuItems = response.menuItems || [];

      setItems(
        menuItems.map((item: any) => ({
          ...item,
          _id: String(item._id),
          status:
            item.status === "approved"
              ? "Approved"
              : item.status === "rejected"
                ? "Rejected"
                : "Pending",
        }))
      );
    } catch (error) {
      console.error("Fetch menu items error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load menu items."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  const loadMenuItems = async () => {
    await fetchMenuItems();
  };

  loadMenuItems();
}, []);

  // Statistics
  const totalItems = items.length;

  const pendingItems = items.filter(
    (item) => item.status === "Pending"
  ).length;

  const approvedItems = items.filter(
    (item) => item.status === "Approved"
  ).length;

  const rejectedItems = items.filter(
    (item) => item.status === "Rejected"
  ).length;

  // Approve or Reject
  const handleStatusChange = async (
    id: string,
    newStatus: ItemStatus
  ) => {
    if (processingId) return;

    try {
      setProcessingId(id);

      const status =
        newStatus === "Approved" ? "approved" : "rejected";

      const response = await apiRequest(
        `/api/admin/menu/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.success) {
        throw new Error(
          response.message || "Status update failed."
        );
      }

      toast.success(
        newStatus === "Approved"
          ? "Pizza approved successfully!"
          : "Pizza rejected successfully!"
      );

      // Reload actual database data
      await fetchMenuItems();
    } catch (error) {
      console.error("Menu approval error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update menu status."
      );
    } finally {
      setProcessingId(null);
    }
  };

  // Search and filter
  const filteredItems = items.filter((item) => {
    const vendorName =
      typeof item.vendor === "string"
        ? item.vendor
        : item.vendor?.shopName ||
          item.vendor?.name ||
          item.vendorName ||
          "";

    const matchesSearch =
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      vendorName.toLowerCase().includes(search.toLowerCase()) ||
      item._id.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      activeFilter === "All" || item.status === activeFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#FFF8F0]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

          {/* Page Header */}
          <div className="mb-8">
            <p className="mb-2 text-sm font-semibold text-[#F77F00]">
              ADMIN DASHBOARD
            </p>

            <h1 className="text-3xl font-bold text-[#252525] md:text-4xl">
              Menu Approvals
            </h1>

            <p className="mt-2 text-gray-500">
              Review and manage pizza items submitted by vendors.
            </p>
          </div>

          {/* Statistics */}
          <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">Total Items</p>
                <Pizza className="text-[#F77F00]" />
              </div>

              <h2 className="mt-4 text-3xl font-bold text-[#252525]">
                {loading ? "..." : totalItems}
              </h2>
            </div>

            <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">Pending</p>
                <Clock className="text-yellow-500" />
              </div>

              <h2 className="mt-4 text-3xl font-bold text-[#252525]">
                {loading ? "..." : pendingItems}
              </h2>
            </div>

            <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">Approved</p>
                <CheckCircle className="text-green-500" />
              </div>

              <h2 className="mt-4 text-3xl font-bold text-[#252525]">
                {loading ? "..." : approvedItems}
              </h2>
            </div>

            <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">Rejected</p>
                <XCircle className="text-red-500" />
              </div>

              <h2 className="mt-4 text-3xl font-bold text-[#252525]">
                {loading ? "..." : rejectedItems}
              </h2>
            </div>

          </div>

          {/* Search and Filters */}
          <div className="mb-6 rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

              <div className="relative w-full md:max-w-md">
                <Search
                  size={19}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <Input
                  placeholder="Search pizza, vendor or item ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-11 pl-10"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {["All", "Pending", "Approved", "Rejected"].map(
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

          {/* Menu Items */}
          <div className="space-y-5">

            {loading ? (
              <div className="flex justify-center rounded-2xl bg-white py-16">
                <Loader2 className="animate-spin text-[#F77F00]" size={35} />
              </div>
            ) : filteredItems.length > 0 ? (
              filteredItems.map((item) => {
                const vendorName =
                  typeof item.vendor === "string"
                    ? item.vendor
                    : item.vendor?.shopName ||
                      item.vendor?.name ||
                      item.vendorName ||
                      "Vendor";

                return (
                  <div
                    key={item._id}
                    className="overflow-hidden rounded-2xl border border-orange-100 bg-white p-5 shadow-sm transition hover:shadow-md"
                  >
                    <div className="flex flex-col gap-5 md:flex-row">

                      {/* Pizza Image */}
                      <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-xl bg-orange-50 md:h-40 md:w-48">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            unoptimized
                            sizes="(max-width: 768px) 100vw, 192px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <Pizza size={45} className="text-orange-300" />
                          </div>
                        )}
                      </div>

                      {/* Item Details */}
                      <div className="flex-1">

                        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-xs font-medium text-gray-400">
                              ITEM ID: {item._id}
                            </p>

                            <h2 className="mt-1 text-xl font-bold text-[#252525]">
                              {item.name}
                            </h2>
                          </div>

                          <span
                            className={`rounded-full px-4 py-1.5 text-xs font-semibold ${statusStyles[item.status]}`}
                          >
                            {item.status}
                          </span>
                        </div>

                        <div className="space-y-2 text-sm text-gray-500">
                          <p>
                            Vendor:{" "}
                            <span className="font-semibold text-[#252525]">
                              {vendorName}
                            </span>
                          </p>

                          <p>
                            Category: {item.category || "Uncategorized"}
                          </p>

                          <p className="flex items-center gap-2">
                            <MapPin size={15} className="text-[#F77F00]" />
                            {item.location || "Location unavailable"}
                          </p>
                        </div>

                        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-4">

                          <p className="text-xl font-bold text-[#F77F00]">
                            ৳{item.price?.toLocaleString() ?? 0}
                          </p>

                          <div className="flex flex-wrap gap-2">

                            {item.status === "Pending" && (
                              <>
                                <Button
                                  size="sm"
                                  disabled={processingId === item._id}
                                  onClick={() =>
                                    handleStatusChange(item._id, "Approved")
                                  }
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  {processingId === item._id ? (
                                    <Loader2 size={15} className="mr-1 animate-spin" />
                                  ) : (
                                    <CheckCircle size={15} className="mr-1" />
                                  )}
                                  Approve
                                </Button>

                                <Button
                                  size="sm"
                                  variant="outline"
                                  disabled={processingId === item._id}
                                  onClick={() =>
                                    handleStatusChange(item._id, "Rejected")
                                  }
                                  className="border-red-200 text-red-600 hover:bg-red-50"
                                >
                                  <XCircle size={15} className="mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}

                          </div>

                        </div>

                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-2xl border border-dashed border-orange-200 bg-white px-5 py-16 text-center">

                <Pizza
                  size={48}
                  className="mx-auto mb-4 text-[#F77F00]"
                />

                <h3 className="text-xl font-bold text-[#252525]">
                  No Menu Items Found
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Try changing your search or filter.
                </p>

              </div>
            )}

          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}