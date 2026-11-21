import Link from "next/link";

export default function NotFound() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-[#FFF8F0] px-4 text-center">
            <h1 className="mb-3 text-6xl font-extrabold text-[#F77F00]">404</h1>
            <h2 className="mb-3 text-2xl font-bold text-[#252525]">
                Page Not Found
            </h2>
            <p className="mb-6 text-gray-500">
                The page you are looking for does not exist.
            </p>
            <Link
                href="/"
                className="rounded-xl bg-[#F77F00] px-6 py-3 text-sm font-bold text-white hover:bg-orange-600"
            >
                Go Home
            </Link>
        </main>
    );
}