"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
    ArrowLeft,
    Pizza,
    Upload,
    DollarSign,
    Loader2,
} from "lucide-react";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import VendorProfileGuard from "@/components/dashboard/VendorProfileGuard";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { apiRequest } from "@/lib/api";

type MenuCategory =
    | "Classic"
    | "Vegetarian"
    | "Meat Lovers"
    | "Specialty";

export default function AddItemPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: "",
        category: "" as MenuCategory | "",
        description: "",
        price: "",
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            toast.error("Image must be smaller than 2MB.");
            e.target.value = "";
            return;
        }

        if (!["image/jpeg", "image/png"].includes(file.type)) {
            toast.error("Only JPG and PNG images are allowed.");
            e.target.value = "";
            return;
        }

        setImageFile(file);
        setPreview(URL.createObjectURL(file));
    };

    const uploadImage = async (file: File): Promise<string> => {
        const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

        if (!apiKey) {
            throw new Error("ImgBB API key is missing.");
        }

        const formData = new FormData();
        formData.append("image", file);

        const response = await fetch(
            `https://api.imgbb.com/1/upload?key=${apiKey}`,
            {
                method: "POST",
                body: formData,
            }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error("Pizza image upload failed.");
        }

        return result.data.url;
    };

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (!imageFile) {
            toast.error("Please upload a pizza image.");
            return;
        }

        if (
            formData.name.trim().length < 3 ||
            formData.description.trim().length < 20 ||
            formData.description.trim().length > 500
        ) {
            toast.error(
                "Name must be at least 3 characters and description must be 20–500 characters."
            );
            return;
        }

        const price = Number(formData.price);

        if (!Number.isFinite(price) || price <= 0 || price > 100000) {
            toast.error("Please enter a valid price.");
            return;
        }

        if (!formData.category) {
            toast.error("Please select a category.");
            return;
        }

        try {
            setLoading(true);

            toast.info("Uploading pizza image...");

            const imageUrl = await uploadImage(imageFile);

            const response = await apiRequest("/api/menu", {
                method: "POST",
                body: JSON.stringify({
                    name: formData.name.trim(),
                    description: formData.description.trim(),
                    price,
                    category: formData.category,
                    image: imageUrl,
                }),
            });

            toast.success(
                response.message || "Pizza submitted successfully!"
            );

            router.push("/dashboard/my-items");
            router.refresh();
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to submit pizza."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />

            <VendorProfileGuard>
                <main className="min-h-screen bg-[#FFF8F0] px-4 py-10 md:px-6">
                    <div className="mx-auto max-w-4xl">
                        <Link
                            href="/dashboard"
                            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-[#F77F00]"
                        >
                            <ArrowLeft size={18} />
                            Back to Dashboard
                        </Link>

                        <div className="mb-8">
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-medium text-[#F77F00]">
                                <Pizza size={17} />
                                Vendor Workspace
                            </div>

                            <h1 className="text-3xl font-bold text-[#252525] md:text-4xl">
                                Add a New Pizza
                            </h1>

                            <p className="mt-3 text-gray-500">
                                Add your delicious pizza to the PizzaHub
                                marketplace. Your submission will be reviewed
                                by an administrator.
                            </p>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-8 rounded-3xl border border-orange-100 bg-white p-6 shadow-sm md:p-10"
                        >
                            <section>
                                <h2 className="mb-6 text-xl font-bold text-[#252525]">
                                    Basic Information
                                </h2>

                                <div className="space-y-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">
                                            Pizza Name *
                                        </Label>

                                        <Input
                                            id="name"
                                            name="name"
                                            placeholder="e.g. Italian Margherita"
                                            value={formData.name}
                                            onChange={handleChange}
                                            minLength={3}
                                            maxLength={80}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="category">
                                            Category *
                                        </Label>

                                        <select
                                            id="category"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            required
                                            className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-[#F77F00]"
                                        >
                                            <option value="">
                                                Select a category
                                            </option>
                                            <option value="Classic">
                                                Classic
                                            </option>
                                            <option value="Vegetarian">
                                                Vegetarian
                                            </option>
                                            <option value="Meat Lovers">
                                                Meat Lovers
                                            </option>
                                            <option value="Specialty">
                                                Specialty
                                            </option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">
                                            Description *
                                        </Label>

                                        <textarea
                                            id="description"
                                            name="description"
                                            placeholder="Describe your delicious pizza..."
                                            value={formData.description}
                                            onChange={handleChange}
                                            minLength={20}
                                            maxLength={500}
                                            required
                                            rows={5}
                                            className="w-full rounded-md border border-input bg-background px-3 py-3 text-sm outline-none focus:border-[#F77F00]"
                                        />

                                        <p className="text-xs text-gray-400">
                                            {formData.description.length}/500
                                            characters
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <div className="h-px bg-gray-100" />

                            <section>
                                <h2 className="mb-6 text-xl font-bold text-[#252525]">
                                    Pricing
                                </h2>

                                <div className="space-y-2">
                                    <Label htmlFor="price">
                                        Price (BDT) *
                                    </Label>

                                    <div className="relative">
                                        <DollarSign
                                            size={18}
                                            className="absolute left-3 top-3 text-gray-400"
                                        />

                                        <Input
                                            id="price"
                                            name="price"
                                            type="number"
                                            min="1"
                                            max="100000"
                                            placeholder="850"
                                            value={formData.price}
                                            onChange={handleChange}
                                            className="pl-10"
                                            required
                                        />
                                    </div>
                                </div>
                            </section>

                            <div className="h-px bg-gray-100" />

                            <section>
                                <h2 className="mb-2 text-xl font-bold text-[#252525]">
                                    Pizza Image
                                </h2>

                                <p className="mb-5 text-sm text-gray-500">
                                    Upload a high-quality image of your pizza.
                                </p>

                                <label
                                    htmlFor="image"
                                    className="flex min-h-52 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50/50 p-6 text-center transition hover:border-[#F77F00]"
                                >
                                    {preview ? (
                                        <img
                                            src={preview}
                                            alt="Pizza preview"
                                            className="max-h-64 w-full rounded-xl object-cover"
                                        />
                                    ) : (
                                        <>
                                            <div className="mb-4 rounded-full bg-orange-100 p-4 text-[#F77F00]">
                                                <Upload size={28} />
                                            </div>

                                            <p className="font-semibold text-[#252525]">
                                                Click to upload pizza image
                                            </p>

                                            <p className="mt-2 text-xs text-gray-400">
                                                PNG or JPG · Maximum 2MB
                                            </p>
                                        </>
                                    )}

                                    <input
                                        id="image"
                                        type="file"
                                        accept="image/png,image/jpeg"
                                        onChange={handleImageChange}
                                        className="hidden"
                                        required
                                    />
                                </label>
                            </section>

                            <div className="flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
                                <Link href="/dashboard">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full sm:w-auto"
                                        disabled={loading}
                                    >
                                        Cancel
                                    </Button>
                                </Link>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#F77F00] text-white hover:bg-orange-600 sm:w-auto"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2
                                                size={18}
                                                className="mr-2 animate-spin"
                                            />
                                            Submitting...
                                        </>
                                    ) : (
                                        "Submit for Approval"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </main>
            </VendorProfileGuard>

            <Footer />
        </>
    );
}