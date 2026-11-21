"use client";

import { useEffect, useState, type ReactNode } from "react";
import { apiRequest } from "@/lib/api";

interface Vendor {
    restaurantName: string;
    status: "pending" | "approved" | "rejected";
}

interface ProfileForm {
    restaurantName: string;
    description: string;
    location: string;
    phone: string;
    logo: string;
}

export default function VendorProfileGuard({
    children,
}: {
    children: ReactNode;
}) {
    const [status, setStatus] = useState<
        "loading" | "missing" | "pending" | "approved" | "rejected" | "error"
    >("loading");

    const [vendor, setVendor] = useState<Vendor | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState<ProfileForm>({
        restaurantName: "",
        description: "",
        location: "",
        phone: "",
        logo: "",
    });

    const fetchProfile = async () => {
        try {
            setStatus("loading");

            const response = await apiRequest("/api/vendors/profile");

            const profile = response.vendor as Vendor;

            setVendor(profile);

            if (profile.status === "approved") {
                setStatus("approved");
            } else if (profile.status === "rejected") {
                setStatus("rejected");
            } else {
                setStatus("pending");
            }
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "";

            if (message.includes("Vendor profile not found")) {
                setStatus("missing");
            } else {
                setError(message || "Unable to load vendor profile.");
                setStatus("error");
            }
        }
    };

    useEffect(() => {
        void fetchProfile();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            const response = await apiRequest("/api/vendors/profile", {
                method: "POST",
                body: JSON.stringify(form),
            });

            const profile = response.vendor as Vendor;

            setVendor(profile);
            setStatus(profile.status === "approved" ? "approved" : "pending");
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to create restaurant profile."
            );
        } finally {
            setLoading(false);
        }
    };

    if (status === "loading") {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                Loading restaurant profile...
            </div>
        );
    }

    if (status === "approved") {
        return <>{children}</>;
    }

    if (status === "pending" || status === "rejected") {
        return (
            <div className="mx-auto my-16 max-w-xl rounded-2xl border bg-white p-8 text-center shadow-sm">
                <h2 className="text-2xl font-bold text-gray-800">
                    {status === "pending"
                        ? "Restaurant Approval Pending"
                        : "Restaurant Profile Rejected"}
                </h2>

                <p className="mt-4 text-gray-600">
                    {status === "pending"
                        ? `Your restaurant "${vendor?.restaurantName}" is waiting for admin approval. You can add pizzas after approval.`
                        : "Your restaurant profile was rejected. Please contact the administrator."}
                </p>
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="mx-auto my-16 max-w-xl rounded-2xl bg-white p-8 text-center shadow">
                <p className="text-red-600">{error}</p>

                <button
                    onClick={() => void fetchProfile()}
                    className="mt-5 rounded-lg bg-orange-500 px-5 py-2 text-white"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="mx-auto my-12 max-w-2xl rounded-2xl border border-orange-100 bg-white p-6 shadow-sm md:p-10">
            <h2 className="text-2xl font-bold text-gray-900">
                Set Up Your Restaurant
            </h2>

            <p className="mt-2 text-sm text-gray-500">
                Complete your restaurant information before adding pizzas.
                Your profile will be submitted for admin approval.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Restaurant Name
                    </label>
                    <input
                        required
                        minLength={3}
                        maxLength={100}
                        value={form.restaurantName}
                        onChange={(e) =>
                            setForm({ ...form, restaurantName: e.target.value })
                        }
                        className="w-full rounded-lg border p-3"
                        placeholder="Your restaurant name"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Description
                    </label>
                    <textarea
                        required
                        minLength={20}
                        maxLength={500}
                        rows={4}
                        value={form.description}
                        onChange={(e) =>
                            setForm({ ...form, description: e.target.value })
                        }
                        className="w-full rounded-lg border p-3"
                        placeholder="Describe your restaurant (20-500 characters)"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Location
                    </label>
                    <input
                        required
                        minLength={5}
                        maxLength={200}
                        value={form.location}
                        onChange={(e) =>
                            setForm({ ...form, location: e.target.value })
                        }
                        className="w-full rounded-lg border p-3"
                        placeholder="Restaurant address"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Phone Number
                    </label>
                    <input
                        required
                        value={form.phone}
                        onChange={(e) =>
                            setForm({ ...form, phone: e.target.value })
                        }
                        className="w-full rounded-lg border p-3"
                        placeholder="01XXXXXXXXX"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Restaurant Logo URL
                    </label>
                    <input
                        required
                        type="url"
                        value={form.logo}
                        onChange={(e) =>
                            setForm({ ...form, logo: e.target.value })
                        }
                        className="w-full rounded-lg border p-3"
                        placeholder="https://example.com/logo.png"
                    />
                </div>

                {error && (
                    <p className="text-sm text-red-600">{error}</p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
                >
                    {loading ? "Submitting..." : "Submit Restaurant Profile"}
                </button>
            </form>
        </div>
    );
}