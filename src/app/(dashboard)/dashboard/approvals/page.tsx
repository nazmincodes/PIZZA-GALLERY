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
  MapPin,
  Loader2,
  Store,
  Phone,
  RefreshCw,
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

type Vendor = {
  _id: string;
  userId: string;
  restaurantName: string;
  description: string;
  location: string;
  phone: string;
  logo: string;
  status: ItemStatus;
  subscriptionPlan: string;
  subscriptionStatus: string;
  createdAt?: string;
};

const statusStyles: Record<ItemStatus, string> = {
  Pending: "bg-yellow-100 text-yellow-700",
  Approved: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
};

export default function ApprovalsPage() {
  const [activeSection, setActiveSection] = useState<"vendors" | "menu">(
    "vendors"
  );

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const [vendorLoading, setVendorLoading] = useState(true);
  const [menuLoading, setMenuLoading] = useState(true);

  const [processingId, setProcessingId] = useState<string | null>(null);

  // Load pending vendors
  const fetchVendors = async () => {
    try {
      setVendorLoading(true);

      const response = await apiRequest("/api/admin/vendors/pending");

      const vendorList = response.vendors || [];

      setVendors(
        vendorList.map((vendor: any) => ({
          ...vendor,
          _id: String(vendor._id),
          status:
            vendor.status === "approved"
              ? "Approved"
              : vendor.status === "rejected"
                ? "Rejected"
                : "Pending",
        }))
      );
    } catch (error) {
      console.error("Fetch vendors error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load vendors."
      );
    } finally {
      setVendorLoading(false);
    }
  };

  // Load pending menu items
  const fetchMenuItems = async () => {
    try {
      setMenuLoading(true);

      const response = await apiRequest("/api/admin/menu/all");

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
      setMenuLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
    fetchMenuItems();
  }, []);

  // Vendor statistics
  const totalVendors = vendors.length;

  const pendingVendors = vendors.filter(
    (vendor) => vendor.status === "Pending"
  ).length;

  // Menu statistics
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

  // Approve or reject vendor
  const handleVendorStatusChange = async (
    id: string,
    newStatus: "Approved" | "Rejected"
  ) => {
    if (processingId) return;

    try {
      setProcessingId(`vendor-${id}`);

      const status =
        newStatus === "Approved" ? "approved" : "rejected";

      const response = await apiRequest(
        `/api/admin/vendors/${id}/status`,
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
          response.message || "Vendor status update failed."
        );
      }

      toast.success(
        newStatus === "Approved"
          ? "Vendor approved successfully!"
          : "Vendor rejected successfully!"
      );

      await fetchVendors();
    } catch (error) {
      console.error("Vendor approval error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update vendor status."
      );
    } finally {
      setProcessingId(null);
    }
  };

  // Approve or reject menu item
  const handleMenuStatusChange = async (
    id: string,
    newStatus: ItemStatus
  ) => {
    if (processingId) return;

    try {
      setProcessingId(`menu-${id}`);

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
          response.message || "Menu status update failed."
        );
      }

      toast.success(
        newStatus === "Approved"
          ? "Pizza approved successfully!"
          : "Pizza rejected successfully!"
      );

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

  // Search and filter vendors
  const filteredVendors = vendors.filter((vendor) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      vendor.restaurantName?.toLowerCase().includes(searchText) ||
      vendor.location?.toLowerCase().includes(searchText) ||
      vendor.phone?.toLowerCase().includes(searchText) ||
      vendor._id.toLowerCase().includes(searchText);

    const matchesFilter =
      activeFilter === "All" || vendor.status === activeFilter;

    return matchesSearch && matchesFilter;
  });

  // Search and filter menu items
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

  const loading =
    activeSection === "vendors" ? vendorLoading : menuLoading;

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
              Approval Management
            </h1>

            <p className="mt-2 text-gray-500">
              Review vendor registrations and pizza menu submissions.
            </p>
          </div>

          {/* Section Tabs */}
          <div className="mb-8 flex flex-wrap gap-3">
            <Button
              onClick={() => {
                setActiveSection("vendors");
                setSearch("");
                setActiveFilter("All");
              }}
              className={
                activeSection === "vendors"
                  ? "bg-[#F77F00] text-white hover:bg-[#e66f00]"
                  : "border border-orange-200 bg-white text-gray-700 hover:bg-orange-50"
              }
            >
              <Store size={17} className="mr-2" />
              Vendor Approvals
              <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                {vendorLoading ? "..." : pendingVendors}
              </span>
            </Button>

            <Button
              onClick={() => {
                setActiveSection("menu");
                setSearch("");
                setActiveFilter("All");
              }}
              className={
                activeSection === "menu"
                  ? "bg-[#F77F00] text-white hover:bg-[#e66f00]"
                  : "border border-orange-200 bg-white text-gray-700 hover:bg-orange-50"
              }
            >
              <Pizza size={17} className="mr-2" />
              Menu Approvals
              <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                {menuLoading ? "..." : pendingItems}
              </span>
            </Button>
          </div>

          {/* Vendor Section */}
          {activeSection === "vendors" && (
            <>
              {/* Vendor Header */}
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold text-[#252525]">
                    Vendor Approvals
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Review restaurant registration requests.
                  </p>
                </div>

                <Button
                  variant="outline"
                  onClick={fetchVendors}
                  disabled={vendorLoading}
                  className="border-orange-200"
                >
                  <RefreshCw
                    size={16}
                    className={`mr-2 ${vendorLoading ? "animate-spin" : ""}`}
                  />
                  Refresh
                </Button>
              </div>

              {/* Vendor Statistics */}
              <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      Pending Vendors
                    </p>
                    <Clock className="text-yellow-500" />
                  </div>

                  <h2 className="mt-4 text-3xl font-bold text-[#252525]">
                    {vendorLoading ? "..." : pendingVendors}
                  </h2>
                </div>

                <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      Total Requests
                    </p>
                    <Store className="text-[#F77F00]" />
                  </div>

                  <h2 className="mt-4 text-3xl font-bold text-[#252525]">
                    {vendorLoading ? "..." : totalVendors}
                  </h2>
                </div>
              </div>

              {/* Vendor Search */}
              <div className="mb-6 rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
                <div className="relative w-full md:max-w-md">
                  <Search
                    size={19}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <Input
                    placeholder="Search restaurant, phone or vendor ID..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-11 pl-10"
                  />
                </div>
              </div>

              {/* Vendor List */}
              <div className="space-y-5">
                {vendorLoading ? (
                  <div className="flex justify-center rounded-2xl bg-white py-16">
                    <Loader2
                      className="animate-spin text-[#F77F00]"
                      size={35}
                    />
                  </div>
                ) : filteredVendors.length > 0 ? (
                  filteredVendors.map((vendor) => (
                    <div
                      key={vendor._id}
                      className="overflow-hidden rounded-2xl border border-orange-100 bg-white p-5 shadow-sm transition hover:shadow-md"
                    >
                      <div className="flex flex-col gap-5 md:flex-row">

                        {/* Restaurant Logo */}
                        <div className="relative flex h-40 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-orange-50 md:w-40">
                          {vendor.logo ? (
                            <Image
                              src={vendor.logo}
                              alt={vendor.restaurantName}
                              fill
                              unoptimized
                              sizes="160px"
                              className="object-cover"
                            />
                          ) : (
                            <Store
                              size={45}
                              className="text-orange-300"
                            />
                          )}
                        </div>

                        {/* Vendor Details */}
                        <div className="flex-1">
                          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p className="text-xs font-medium text-gray-400">
                                VENDOR ID: {vendor._id}
                              </p>

                              <h3 className="mt-1 text-xl font-bold text-[#252525]">
                                {vendor.restaurantName}
                              </h3>
                            </div>

                            <span
                              className={`rounded-full px-4 py-1.5 text-xs font-semibold ${statusStyles[vendor.status]}`}
                            >
                              {vendor.status}
                            </span>
                          </div>

                          <p className="mb-4 text-sm leading-6 text-gray-500">
                            {vendor.description || "No description provided."}
                          </p>

                          <div className="space-y-2 text-sm text-gray-500">
                            <p className="flex items-center gap-2">
                              <MapPin
                                size={16}
                                className="shrink-0 text-[#F77F00]"
                              />
                              {vendor.location || "Location unavailable"}
                            </p>

                            <p className="flex items-center gap-2">
                              <Phone
                                size={16}
                                className="shrink-0 text-[#F77F00]"
                              />
                              {vendor.phone || "Phone unavailable"}
                            </p>

                            <p>
                              Plan:{" "}
                              <span className="font-semibold capitalize text-[#252525]">
                                {vendor.subscriptionPlan || "free"}
                              </span>
                            </p>
                          </div>

                          {/* Actions */}
                          {vendor.status === "Pending" && (
                            <div className="mt-5 flex flex-wrap gap-2 border-t border-gray-100 pt-4">
                              <Button
                                size="sm"
                                disabled={processingId !== null}
                                onClick={() =>
                                  handleVendorStatusChange(
                                    vendor._id,
                                    "Approved"
                                  )
                                }
                                className="bg-green-600 hover:bg-green-700"
                              >
                                {processingId === `vendor-${vendor._id}` ? (
                                  <Loader2
                                    size={15}
                                    className="mr-1 animate-spin"
                                  />
                                ) : (
                                  <CheckCircle
                                    size={15}
                                    className="mr-1"
                                  />
                                )}
                                Approve Vendor
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                disabled={processingId !== null}
                                onClick={() =>
                                  handleVendorStatusChange(
                                    vendor._id,
                                    "Rejected"
                                  )
                                }
                                className="border-red-200 text-red-600 hover:bg-red-50"
                              >
                                <XCircle size={15} className="mr-1" />
                                Reject Vendor
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-orange-200 bg-white px-5 py-16 text-center">
                    <Store
                      size={48}
                      className="mx-auto mb-4 text-[#F77F00]"
                    />

                    <h3 className="text-xl font-bold text-[#252525]">
                      No Pending Vendors
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                      There are no vendor registration requests to review.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Menu Section */}
          {activeSection === "menu" && (
            <>
              {/* Menu Header */}
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold text-[#252525]">
                    Menu Approvals
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Review pizza items submitted by vendors.
                  </p>
                </div>

                <Button
                  variant="outline"
                  onClick={fetchMenuItems}
                  disabled={menuLoading}
                  className="border-orange-200"
                >
                  <RefreshCw
                    size={16}
                    className={`mr-2 ${menuLoading ? "animate-spin" : ""}`}
                  />
                  Refresh
                </Button>
              </div>

              {/* Menu Statistics */}
              <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">Total Items</p>
                    <Pizza className="text-[#F77F00]" />
                  </div>

                  <h2 className="mt-4 text-3xl font-bold text-[#252525]">
                    {menuLoading ? "..." : totalItems}
                  </h2>
                </div>

                <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">Pending</p>
                    <Clock className="text-yellow-500" />
                  </div>

                  <h2 className="mt-4 text-3xl font-bold text-[#252525]">
                    {menuLoading ? "..." : pendingItems}
                  </h2>
                </div>

                <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">Approved</p>
                    <CheckCircle className="text-green-500" />
                  </div>

                  <h2 className="mt-4 text-3xl font-bold text-[#252525]">
                    {menuLoading ? "..." : approvedItems}
                  </h2>
                </div>

                <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">Rejected</p>
                    <XCircle className="text-red-500" />
                  </div>

                  <h2 className="mt-4 text-3xl font-bold text-[#252525]">
                    {menuLoading ? "..." : rejectedItems}
                  </h2>
                </div>
              </div>

              {/* Menu Search and Filters */}
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
                {menuLoading ? (
                  <div className="flex justify-center rounded-2xl bg-white py-16">
                    <Loader2
                      className="animate-spin text-[#F77F00]"
                      size={35}
                    />
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
                                <Pizza
                                  size={45}
                                  className="text-orange-300"
                                />
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
                                <MapPin
                                  size={15}
                                  className="text-[#F77F00]"
                                />
                                {item.location || "Location unavailable"}
                              </p>
                            </div>

                            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-4">
                              <p className="text-xl font-bold text-[#F77F00]">
                                ৳{item.price?.toLocaleString() ?? 0}
                              </p>

                              <div className="flex flex-wrap gap-2">
                                {item.status !== "Approved" && (
                                  <Button
                                    size="sm"
                                    disabled={processingId !== null}
                                    onClick={() =>
                                      handleMenuStatusChange(item._id, "Approved")
                                    }
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    {processingId === `menu-${item._id}` ? (
                                      <Loader2 size={15} className="mr-1 animate-spin" />
                                    ) : (
                                      <CheckCircle size={15} className="mr-1" />
                                    )}
                                    Approve
                                  </Button>
                                )}

                                {item.status !== "Rejected" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={processingId !== null}
                                    onClick={() =>
                                      handleMenuStatusChange(item._id, "Rejected")
                                    }
                                    className="border-red-200 text-red-600 hover:bg-red-50"
                                  >
                                    <XCircle size={15} className="mr-1" />
                                    Reject
                                  </Button>
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
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}