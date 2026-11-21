
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Pizza,
    UserRound,
    Mail,
    LockKeyhole,
    Camera,
    Eye,
    EyeOff,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { toast } from "sonner";
type AccountRole = "customer" | "vendor";

export default function SignUpPage() {
    const router = useRouter();

    const [data, setData] = useState<{
        name: string;
        email: string;
        password: string;
        role: AccountRole;
    }>({
        name: "",
        email: "",
        password: "",
        role: "customer",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        if (name === "role") {
            if (value !== "customer" && value !== "vendor") return;

            setData((previousData) => ({
                ...previousData,
                role: value,
            }));
            return;
        }

        if (name === "name") {
            setData((previousData) => ({
                ...previousData,
                name: value,
            }));
        }

        if (name === "email") {
            setData((previousData) => ({
                ...previousData,
                email: value,
            }));
        }

        if (name === "password") {
            setData((previousData) => ({
                ...previousData,
                password: value,
            }));
        }
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) {
            setImageFile(null);
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            toast.error("Image must be smaller than 2MB.");
            event.target.value = "";
            return;
        }

        setImageFile(file);
    };

    const uploadImage = async (file: File) => {
        const formData = new FormData();
        formData.append("image", file);

        const res = await fetch(
            `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
            { method: "POST", body: formData }
        );

        const result = await res.json();

        if (!result.success) {
            throw new Error("Image upload failed");
        }

        return result.data.url as string;
    };
    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (data.password.length < 8) {
            toast.error("Password must be at least 8 characters long.");
            return;
        }

        if (!/[A-Z]/.test(data.password) || !/[a-z]/.test(data.password)) {
            toast.error("Password must contain uppercase and lowercase letters.");
            return;
        }

        setLoading(true);
        try {
            let imageUrl: string | undefined;

            if (imageFile) {
                imageUrl = await uploadImage(imageFile);
            }


            const { error } = await authClient.signUp.email({
                name: data.name,
                email: data.email,
                password: data.password,
                accountType: data.role,
                image: imageUrl,
                callbackURL: "/dashboard",
            });
            // বাকি অংশ আগের মতোই থাকবে

            if (error) {
                toast.error(error.message || "Registration failed");
                return;
            }

            toast.success("Account created successfully!");

            router.push("/dashboard");
            router.refresh();
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        try {
            await authClient.signIn.social({
                provider: "google",
                callbackURL: "/dashboard",
            });
        } catch {
            toast.error("Google signup failed");
        }
    };

    return (
        <>
            <Navbar />

            <main className="flex-1 bg-[#FFF8F0] px-4 py-12 sm:py-16">
                <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl shadow-orange-100/60 lg:grid lg:grid-cols-2">

                    {/* Left Side */}
                    <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-orange-500 to-orange-700 p-10 text-white lg:flex">
                        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border-[40px] border-white/10" />
                        <div className="absolute -bottom-24 -left-20 h-80 w-80 rounded-full border-[45px] border-white/10" />

                        <Link href="/" className="relative z-10 flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-orange-600">
                                <Pizza size={28} />
                            </div>

                            <span className="text-2xl font-bold">PizzaHub</span>
                        </Link>

                        <div className="relative z-10">
                            <p className="mb-4 text-sm font-semibold uppercase tracking-[3px] text-orange-100">
                                Welcome to PizzaHub
                            </p>

                            <h1 className="text-4xl font-bold leading-tight xl:text-5xl">
                                Great Pizza.
                                <br />
                                Great Moments.
                                <br />
                                One Account.
                            </h1>

                            <p className="mt-6 max-w-sm leading-8 text-orange-50">
                                Discover local pizza shops, explore amazing flavors, and enjoy
                                a delicious ordering experience.
                            </p>
                        </div>

                        <p className="relative z-10 text-sm text-orange-100">
                            Join our growing pizza community.
                        </p>
                    </div>

                    {/* Right Side */}
                    <div className="p-6 sm:p-10 lg:p-12">
                        <div className="mb-8">
                            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-orange-600">
                                Create Your Account
                            </p>

                            <h2 className="text-3xl font-bold text-[#252525]">
                                Get Started!
                            </h2>

                            <p className="mt-2 text-sm text-gray-500">
                                Join PizzaHub and discover your favorite pizza.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* Full Name */}
                            <div>
                                <label htmlFor="name" className="mb-2 block text-sm font-semibold text-gray-700">
                                    Full Name
                                </label>

                                <div className="relative">
                                    <UserRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={19} />

                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        value={data.name}
                                        accept="image/*"
                                        onChange={handleChange}
                                        placeholder="Enter your full name"
                                        required
                                        className="h-12 w-full rounded-xl border border-gray-200 bg-[#FFF8F0] pl-12 pr-4 text-sm text-gray-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="mb-2 block text-sm font-semibold text-gray-700">
                                    Email Address
                                </label>

                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={19} />

                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={data.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email"
                                        required
                                        className="h-12 w-full rounded-xl border border-gray-200 bg-[#FFF8F0] pl-12 pr-4 text-sm text-gray-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="mb-2 block text-sm font-semibold text-gray-700">
                                    Password
                                </label>

                                <div className="relative">
                                    <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={19} />

                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        value={data.password}
                                        onChange={handleChange}
                                        placeholder="Create a password"
                                        minLength={8}
                                        required
                                        className="h-12 w-full rounded-xl border border-gray-200 bg-[#FFF8F0] pl-12 pr-12 text-sm text-gray-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500"
                                    >
                                        {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                                    </button>
                                </div>

                                <p className="mt-2 text-xs text-gray-400">
                                    Use at least 8 characters with uppercase and lowercase letters.
                                </p>
                            </div>

                            {/* Profile Image */}
                            <div>
                                <label htmlFor="profileImage" className="mb-2 block text-sm font-semibold text-gray-700">
                                    Profile Image <span className="font-normal text-gray-400">(Optional)</span>
                                </label>

                                <div className="flex items-center gap-3 rounded-xl border border-dashed border-gray-300 bg-[#FFF8F0] p-3">
                                    <Camera className="text-orange-500" size={21} />

                                    <input
                                        id="profileImage"
                                        type="file"
                                        onChange={handleImageChange}
                                        className="w-full text-sm text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-orange-100 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-orange-700"
                                    />
                                </div>
                            </div>

                            {/* Account Type */}
                            <div>
                                <p className="mb-3 text-sm font-semibold text-gray-700">
                                    Choose Account Type
                                </p>

                                <div className="grid grid-cols-2 gap-3">
                                    <label className={`cursor-pointer rounded-xl border p-4 transition ${data.role === "customer"
                                        ? "border-orange-500 bg-orange-50"
                                        : "border-gray-200 hover:border-orange-300"
                                        }`}>
                                        <input
                                            type="radio"
                                            name="role"
                                            value="customer"
                                            checked={data.role === "customer"}
                                            onChange={handleChange}
                                            className="accent-orange-500"
                                        />

                                        <span className="ml-2 text-sm font-semibold text-gray-800">
                                            Customer
                                        </span>

                                        <p className="mt-2 text-xs text-gray-500">
                                            Order delicious pizzas.
                                        </p>
                                    </label>

                                    <label className={`cursor-pointer rounded-xl border p-4 transition ${data.role === "vendor"
                                        ? "border-orange-500 bg-orange-50"
                                        : "border-gray-200 hover:border-orange-300"
                                        }`}>
                                        <input
                                            type="radio"
                                            name="role"
                                            value="vendor"
                                            checked={data.role === "vendor"}
                                            onChange={handleChange}
                                            className="accent-orange-500"
                                        />

                                        <span className="ml-2 text-sm font-semibold text-gray-800">
                                            Vendor
                                        </span>

                                        <p className="mt-2 text-xs text-gray-500">
                                            Manage your pizza shop.
                                        </p>
                                    </label>
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex h-12 w-full items-center justify-center rounded-xl bg-orange-500 text-sm font-semibold text-white shadow-lg shadow-orange-100 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? "Creating Account..." : "Create Account"}
                            </button>

                            {/* Google Signup */}
                            <button
                                type="button"
                                onClick={handleGoogleSignup}
                                className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                            >
                                <span className="text-lg font-bold text-blue-600">G</span>
                                Continue with Google
                            </button>
                        </form>

                        <p className="mt-7 text-center text-sm text-gray-500">
                            Already have an account?{" "}
                            <Link href="/sign-in" className="font-semibold text-orange-600 hover:text-orange-700">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}
