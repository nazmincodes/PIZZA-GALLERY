import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Login না থাকলে Sign In পেজে পাঠাবে
  if (!session) {
    redirect("/sign-in");
  }

  const user = session.user;
  const role = user.role;

  return (
    <main className="min-h-screen bg-[#FFF8F0] p-6 md:p-10">
      <div className="mx-auto max-w-6xl">

        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <p className="text-sm font-medium text-[#F77F00]">
            PizzaHub Dashboard
          </p>

          <h1 className="mt-3 text-3xl font-bold text-[#252525]">
            Welcome, {user.name}!
          </h1>

          {role === "vendor" ? (
            <div className="mt-5">
              <h2 className="text-xl font-semibold text-[#252525]">
                Vendor Dashboard
              </h2>

              <p className="mt-2 text-gray-500">
                Manage your pizza shop, menu items and customer orders.
              </p>
            </div>
          ) : (
            <div className="mt-5">
              <h2 className="text-xl font-semibold text-[#252525]">
                Customer Dashboard
              </h2>

              <p className="mt-2 text-gray-500">
                Explore delicious pizzas and manage your orders.
              </p>
            </div>
          )}

          <div className="mt-8 rounded-xl bg-orange-50 p-5">
            <p className="text-sm text-gray-500">Your Account Role</p>

            <p className="mt-1 text-lg font-bold capitalize text-[#F77F00]">
              {role}
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}