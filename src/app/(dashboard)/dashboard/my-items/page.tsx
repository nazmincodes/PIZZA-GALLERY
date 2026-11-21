"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Plus,
    Pencil,
    Trash2,
    MapPin,
    Search,
    Pizza,
    Power,
    X,
    Save,
} from "lucide-react";
import { toast } from "sonner";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/api";

type MenuItem = {
    _id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    location: string;
    restaurantName: string;
    image: string;
    status: "pending" | "approved" | "rejected";
    isActive: boolean;
    isFeatured: boolean;
    createdAt: string;
};

type EditForm = {
    name: string;
    description: string;
    category: string;
    price: string;
    image: string;
};

const emptyForm: EditForm = {
    name: "",
    description: "",
    category: "",
    price: "",
    image: "",
};

export default function MyItemsPage() {
    const [items, setItems] = useState<MenuItem[]>([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
    const [editForm, setEditForm] = useState<EditForm>(emptyForm);
    const [saving, setSaving] = useState(false);

    // Fetch Vendor Items
    const fetchMyItems = async () => {
        try {
            setLoading(true);

            const response = await apiRequest("/api/menu/my-items");

            setItems(response.menuItems || []);
        } catch (error) {
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
        fetchMyItems();
    }, []);

    // Open Edit Modal
    const handleEdit = (item: MenuItem) => {
        setEditingItem(item);

        setEditForm({
            name: item.name,
            description: item.description,
            category: item.category,
            price: String(item.price),
            image: item.image,
        });
    };

    // Save Edited Item
    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!editingItem) return;

        const price = Number(editForm.price);

        if (
            !editForm.name.trim() ||
            !editForm.description.trim() ||
            !editForm.category.trim() ||
            !Number.isFinite(price) ||
            price <= 0 ||
            !editForm.image.trim()
        ) {
            toast.error("Please provide valid information in every field.");
            return;
        }

        try {
            setSaving(true);

            await apiRequest(`/api/menu/${editingItem._id}`, {
                method: "PATCH",
                body: JSON.stringify({
                    name: editForm.name.trim(),
                    description: editForm.description.trim(),
                    category: editForm.category.trim(),
                    price,
                    image: editForm.image.trim(),
                }),
            });

            setItems((previousItems) =>
                previousItems.map((item) =>
                    item._id === editingItem._id
                        ? {
                              ...item,
                              ...editForm,
                              price,
                              status: "pending",
                          }
                        : item
                )
            );

            toast.success(
                "Pizza updated! It is now waiting for admin approval."
            );

            setEditingItem(null);
            setEditForm(emptyForm);
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to update pizza."
            );
        } finally {
            setSaving(false);
        }
    };

    // Activate / Deactivate
    const handleToggleAvailability = async (item: MenuItem) => {
        if (item.status !== "approved") {
            toast.error("Only approved items can be activated or deactivated.");
            return;
        }

        try {
            setUpdatingId(item._id);

            const newStatus = !item.isActive;

            await apiRequest(
                `/api/menu/${item._id}/availability`,
                {
                    method: "PATCH",
                    body: JSON.stringify({
                        isActive: newStatus,
                    }),
                }
            );

            setItems((previousItems) =>
                previousItems.map((previousItem) =>
                    previousItem._id === item._id
                        ? { ...previousItem, isActive: newStatus }
                        : previousItem
                )
            );

            toast.success(
                newStatus
                    ? "Pizza activated successfully!"
                    : "Pizza deactivated successfully!"
            );
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to update availability."
            );
        } finally {
            setUpdatingId(null);
        }
    };

    // Delete Item
    const handleDelete = async (id: string) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this pizza?"
        );

        if (!confirmed) return;

        try {
            await apiRequest(`/api/menu/${id}`, {
                method: "DELETE",
            });

            setItems((previousItems) =>
                previousItems.filter((item) => item._id !== id)
            );

            toast.success("Pizza deleted successfully!");
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to delete pizza."
            );
        }
    };

    const filteredItems = items.filter((item) => {
        const matchesSearch = item.name
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchesFilter =
            filter === "All" || item.status === filter;

        return matchesSearch && matchesFilter;
    });

    const approvedCount = items.filter(
        (item) => item.status === "approved"
    ).length;

    const pendingCount = items.filter(
        (item) => item.status === "pending"
    ).length;

    const activeCount = items.filter(
        (item) => item.isActive
    ).length;

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-[#FFF8F0]">
                <section className="mx-auto max-w-6xl px-5 py-12">

                    {/* Header */}
                    <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                        <div>
                            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#F77F00]">
                                Vendor Dashboard
                            </p>

                            <h1 className="text-3xl font-bold text-[#252525]">
                                My Pizza Items
                            </h1>

                            <p className="mt-2 text-gray-500">
                                Manage your menu items and track their approval status.
                            </p>
                        </div>

                        <Link
                            href="/dashboard/add-item"
                            className="inline-flex items-center rounded-md bg-[#F77F00] px-4 py-2 text-sm font-medium text-white hover:bg-[#e66f00]"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add New Item
                        </Link>
                    </div>

                    {/* Statistics */}
                    <div className="mb-8 grid gap-4 sm:grid-cols-4">
                        {[
                            { label: "Total Items", value: items.length, color: "text-[#252525]" },
                            { label: "Approved", value: approvedCount, color: "text-green-600" },
                            { label: "Pending", value: pendingCount, color: "text-amber-600" },
                            { label: "Active Items", value: activeCount, color: "text-blue-600" },
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm"
                            >
                                <p className="text-sm text-gray-500">{stat.label}</p>

                                <h2 className={`mt-2 text-3xl font-bold ${stat.color}`}>
                                    {stat.value}
                                </h2>
                            </div>
                        ))}
                    </div>

                    {/* Search and Filter */}
                    <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-orange-100 bg-white p-4 sm:flex-row">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                            <Input
                                placeholder="Search pizza by name..."
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
                            <option value="All">All Items</option>
                            <option value="approved">Approved</option>
                            <option value="pending">Pending</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>

                    {/* Items */}
                    {loading ? (
                        <div className="py-20 text-center text-gray-500">
                            Loading your pizza items...
                        </div>
                    ) : filteredItems.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-orange-200 bg-white py-16 text-center">
                            <Pizza className="mx-auto mb-4 h-12 w-12 text-orange-300" />

                            <h3 className="text-xl font-semibold text-[#252525]">
                                No Pizza Items Found
                            </h3>

                            <p className="mt-2 text-gray-500">
                                Try another search or add a new pizza to your menu.
                            </p>

                            <Link
                                href="/dashboard/add-item"
                                className="mt-5 inline-flex rounded-md bg-[#F77F00] px-4 py-2 text-sm font-medium text-white hover:bg-[#e66f00]"
                            >
                                Add New Item
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {filteredItems.map((item) => (
                                <div
                                    key={item._id}
                                    className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                                >
                                    <div className="relative h-52">
                                        {item.image ? (
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="h-full w-full object-cover"
                                                onError={() => {
                                                    setItems((previousItems) =>
                                                        previousItems.map((previousItem) =>
                                                            previousItem._id === item._id
                                                                ? { ...previousItem, image: "" }
                                                                : previousItem
                                                        )
                                                    );
                                                }}
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center bg-orange-50">
                                                <Pizza className="h-16 w-16 text-orange-300" />
                                            </div>
                                        )}

                                        <Badge
                                            className={`absolute right-3 top-3 ${
                                                item.status === "approved"
                                                    ? "bg-green-600"
                                                    : item.status === "pending"
                                                    ? "bg-amber-500"
                                                    : "bg-red-500"
                                            } text-white`}
                                        >
                                            {item.status}
                                        </Badge>

                                        <Badge
                                            className={`absolute left-3 top-3 ${
                                                item.isActive
                                                    ? "bg-blue-600"
                                                    : "bg-gray-600"
                                            } text-white`}
                                        >
                                            {item.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                    </div>

                                    <div className="p-5">
                                        <p className="text-sm font-medium text-[#F77F00]">
                                            {item.category}
                                        </p>

                                        <h3 className="mt-1 text-xl font-bold text-[#252525]">
                                            {item.name}
                                        </h3>

                                        <p className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                                            <MapPin className="h-4 w-4" />
                                            {item.location || item.restaurantName}
                                        </p>

                                        <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                                            {item.description}
                                        </p>

                                        <div className="mt-4 flex items-center justify-between border-t border-orange-100 pt-4">
                                            <p className="text-xl font-bold text-[#252525]">
                                                ৳{item.price}
                                            </p>

                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    title="Edit item"
                                                    onClick={() => handleEdit(item)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>

                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    title={item.isActive ? "Deactivate item" : "Activate item"}
                                                    disabled={
                                                        item.status !== "approved" ||
                                                        updatingId === item._id
                                                    }
                                                    onClick={() => handleToggleAvailability(item)}
                                                    className={
                                                        item.isActive
                                                            ? "text-amber-600 hover:bg-amber-50"
                                                            : "text-green-600 hover:bg-green-50"
                                                    }
                                                >
                                                    <Power className="h-4 w-4" />
                                                </Button>

                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    title="Delete item"
                                                    className="text-red-500 hover:bg-red-50 hover:text-red-600"
                                                    onClick={() => handleDelete(item._id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>

            {/* Edit Modal */}
            {editingItem && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/60 p-4">
                    <div className="my-8 w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-[#252525]">
                                    Edit Pizza
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Update your menu item information.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setEditingItem(null)}
                                className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
                            >
                                <X size={22} />
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Pizza Name
                                </label>
                                <Input
                                    value={editForm.name}
                                    onChange={(e) =>
                                        setEditForm({ ...editForm, name: e.target.value })
                                    }
                                    required
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Description
                                </label>
                                <textarea
                                    value={editForm.description}
                                    onChange={(e) =>
                                        setEditForm({
                                            ...editForm,
                                            description: e.target.value,
                                        })
                                    }
                                    required
                                    rows={3}
                                    className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#F77F00]"
                                />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Category
                                    </label>
                                    <Input
                                        value={editForm.category}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                category: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Price (৳)
                                    </label>
                                    <Input
                                        type="number"
                                        min="1"
                                        value={editForm.price}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                price: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Pizza Image URL
                                </label>
                                <Input
                                    type="url"
                                    value={editForm.image}
                                    onChange={(e) =>
                                        setEditForm({
                                            ...editForm,
                                            image: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>

                            {editForm.image && (
                                <img
                                    src={editForm.image}
                                    alt="Pizza preview"
                                    className="h-40 w-full rounded-xl object-cover"
                                />
                            )}

                            <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                                Updating an approved pizza will send it back for admin approval.
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setEditingItem(null)}
                                    disabled={saving}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="submit"
                                    disabled={saving}
                                    className="bg-[#F77F00] hover:bg-[#e66f00]"
                                >
                                    <Save className="mr-2 h-4 w-4" />
                                    {saving ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
}