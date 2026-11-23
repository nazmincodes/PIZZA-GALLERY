import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

import CustomerDashboard from "@/components/dashboard/CustomerDashboard";
import VendorDashboard from "@/components/dashboard/VendorDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
export const instant = false;

export default async function DashboardPage() {
  let session;

  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch (error) {
    console.error("DASHBOARD getSession ERROR:", error);
    throw error;
  }

  // Redirect if user is not logged in
  if (!session) {
    redirect("/sign-in");
  }

  const user = session.user;
  const role = user.role;

  // নিচের return অংশ আগের মতোই থাকবে
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#FFF8F0]">
        <div className="mx-auto max-w-6xl px-6 py-10">

          {/* Customer Dashboard */}
          {role === "customer" && (
            <CustomerDashboard name={user.name} />
          )}

          {/* Vendor Dashboard */}
          {role === "vendor" && (
            <VendorDashboard name={user.name} />
          )}

          {/* Admin Dashboard */}
          {role === "admin" && (
            <AdminDashboard name={user.name} />
          )}

          {/* Unauthorized Role */}
          {role !== "customer" &&
            role !== "vendor" &&
            role !== "admin" && (
              <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
                <h1 className="text-2xl font-bold text-red-600">
                  Access Denied
                </h1>

                <p className="mt-3 text-gray-500">
                  You do not have permission to access this dashboard.
                </p>
              </div>
            )}

        </div>
      </main>

      <Footer />
    </>
  );
}