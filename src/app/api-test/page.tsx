"use client";

import { useState } from "react";
import { apiRequest } from "@/lib/api";

export default function ApiTestPage() {
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);

    const testAPI = async () => {
        try {
            setLoading(true);

            const data = await apiRequest("/api/me");

            setResult(JSON.stringify(data, null, 2));
        } catch (error) {
            setResult(
                error instanceof Error ? error.message : "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[#FFF8F0] p-6">
            <h1 className="text-3xl font-bold text-[#252525]">
                PizzaHub API Test
            </h1>

            <button
                onClick={testAPI}
                disabled={loading}
                className="rounded-lg bg-[#F77F00] px-6 py-3 font-semibold text-white disabled:opacity-50"
            >
                {loading ? "Testing..." : "Test Authentication"}
            </button>

            {result && (
                <pre className="max-w-full overflow-auto rounded-lg bg-white p-5 text-sm shadow">
                    {result}
                </pre>
            )}
        </main>
    );
}