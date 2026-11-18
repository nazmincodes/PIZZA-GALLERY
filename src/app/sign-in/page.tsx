"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    Pizza,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function SignInPage() {
    const router = useRouter();

    const [data, setData] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setData({
            ...data,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setLoading(true);

        try {
            const { error } = await authClient.signIn.email({
                email: data.email,
                password: data.password,
                callbackURL: "/dashboard",
            });

            if (error) {
                toast.error(error.message || "Login failed");
                return;
            }

            toast.success("Login successful!");
            router.push("/dashboard");
            router.refresh();

        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await authClient.signIn.social({
                provider: "google",
                callbackURL: "/dashboard",
            });
        } catch {
            toast.error("Google login failed");
        }
    };

    return (
        <>
            <Navbar />

            <main className="flex-1 bg-[#FFF8F0] px-4 py-12 sm:py-16">
                <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl bg-white shadow-xl lg:grid-cols-2">

                    {/* Left Side */}
                    <div className="relative hidden flex-col justify-between overflow-hidden bg-[#252525] p-12 text-white lg:flex">
                        <div>
                            <div className="mb-8 flex items-center gap-3">
                                <div className="rounded-xl bg-orange-500 p-3">
                                    <Pizza size={28} />
                                </div>
                                <span className="text-2xl font-bold">PizzaHub</span>
                            </div>

                            <h1 className="text-4xl font-bold leading-tight">
                                Welcome Back to Your
                                <span className="block text-orange-400">
                                    Favorite Pizza Place!
                                </span>
                            </h1>

                            <p className="mt-5 max-w-md text-gray-300 leading-7">
                                Sign in to discover delicious pizzas, track your orders,
                                and enjoy every slice with PizzaHub.
                            </p>
                        </div>

                        <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6">
                            <p className="text-lg font-semibold text-orange-400">
                                Every Slice Has a Story.
                            </p>
                            <p className="mt-2 text-sm text-gray-300">
                                Your next delicious experience is just one click away.
                            </p>
                        </div>

                        <div className="absolute -bottom-24 -right-20 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl" />
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center justify-center p-6 sm:p-10 lg:p-12">
                        <div className="w-full max-w-md">

                            <div className="mb-8 text-center">
                                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                                    <LockKeyhole size={28} />
                                </div>

                                <h2 className="text-3xl font-bold text-[#252525]">
                                    Welcome Back!
                                </h2>

                                <p className="mt-2 text-sm text-gray-500">
                                    Sign in to continue to your PizzaHub account.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">

                                {/* Email */}
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>

                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="Enter your email"
                                            value={data.email}
                                            onChange={handleChange}
                                            className="h-12 pl-11"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>

                                    <div className="relative">
                                        <LockKeyhole className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                                        <Input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                            value={data.password}
                                            onChange={handleChange}
                                            className="h-12 pl-11 pr-12"
                                            required
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-500"
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Remember Me and Forgot Password */}
                                <div className="flex items-center justify-between text-sm">
                                    <label className="flex cursor-pointer items-center gap-2 text-gray-600">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 accent-orange-500"
                                        />
                                        Remember me
                                    </label>

                                    <Link
                                        href="/forgot-password"
                                        className="font-medium text-orange-600 hover:text-orange-700"
                                    >
                                        Forgot Password?
                                    </Link>
                                </div>

                                {/* Sign In Button */}
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="h-12 w-full bg-orange-500 text-base font-semibold text-white hover:bg-orange-600"
                                >
                                    {loading ? "Signing In..." : "Sign In"}
                                </Button>

                                {/* Google Button */}
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleGoogleLogin}
                                    className="h-12 w-full border-gray-200"
                                >
                                    <span className="mr-2 font-bold text-lg">G</span>
                                    Continue with Google
                                </Button>

                            </form>

                            <p className="mt-7 text-center text-sm text-gray-600">
                                Don't have an account?{" "}
                                <Link
                                    href="/sign-up"
                                    className="font-semibold text-orange-600 hover:text-orange-700"
                                >
                                    Create Account
                                </Link>
                            </p>

                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}