import Link from "next/link";
import { Pizza, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
            <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white">
                        <Pizza size={24} />
                    </div>

                    <span className="text-2xl font-bold tracking-tight text-gray-900">
                        Pizza<span className="text-orange-500">Hub</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden items-center gap-8 md:flex">
                    <Link
                        href="/"
                        className="text-sm font-medium text-orange-600 transition hover:text-orange-500"
                    >
                        Home
                    </Link>

                    <Link
                        href="/menu"
                        className="text-sm font-medium text-gray-600 transition hover:text-orange-500"
                    >
                        Browse Menu
                    </Link>
                </div>

                {/* Authentication Buttons */}
                <div className="hidden items-center gap-3 md:flex">
                    <Link
                        href="/sign-in"
                        className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-orange-50 hover:text-orange-600"
                    >
                        Sign In
                    </Link>

                    <Link
                        href="/sign-up"
                        className="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
                    >
                        Get Started
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    aria-label="Open navigation menu"
                >
                    <Menu size={24} />
                </Button>
            </nav>
        </header>
    );
}