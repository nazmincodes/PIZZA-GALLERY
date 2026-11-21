"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Users,
  Store,
  UserRound,
  ShieldCheck,
  Ban,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import { apiRequest } from "@/lib/api";

type UserRole = "customer" | "vendor";
type UserStatus = "Active" | "Blocked";

type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  joinedDate: string;
};

type ApiUser = {
  id: string;
  name?: string;
  email: string;
  role?: string;
  status?: string;
  joinedDate?: string;
};

type UsersResponse = {
  success: boolean;
  users: ApiUser[];
};

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Load users
  useEffect(() => {
    let isMounted = true;

    const loadUsers = async () => {
      try {
        const result = (await apiRequest(
          "/api/admin/users"
        )) as UsersResponse;

        const formattedUsers: User[] = (result.users || []).map(
          (user): User => ({
            id: user.id,
            name: user.name || "Unknown User",
            email: user.email,
            role: user.role === "vendor" ? "vendor" : "customer",
            status: user.status === "Blocked" ? "Blocked" : "Active",
            joinedDate: user.joinedDate
              ? new Date(user.joinedDate).toLocaleDateString()
              : "N/A",
          })
        );

        if (isMounted) {
          setUsers(formattedUsers);
        }
      } catch (error) {
        if (isMounted) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to load users."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  // Block / Unblock user
  const handleStatusChange = async (user: User) => {
    const banned = user.status === "Active";

    try {
      setUpdatingId(user.id);

      await apiRequest(`/api/admin/users/${user.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ banned }),
      });

      setUsers((previousUsers) =>
        previousUsers.map((item) =>
          item.id === user.id
            ? {
                ...item,
                status: banned ? "Blocked" : "Active",
              }
            : item
        )
      );

      toast.success(
        banned
          ? "User blocked successfully!"
          : "User unblocked successfully!"
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update user status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const totalUsers = users.length;

  const totalCustomers = users.filter(
    (user) => user.role === "customer"
  ).length;

  const totalVendors = users.filter(
    (user) => user.role === "vendor"
  ).length;

  const blockedUsers = users.filter(
    (user) => user.status === "Blocked"
  ).length;

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      activeFilter === "All" ||
      user.role === activeFilter.toLowerCase() ||
      user.status === activeFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#FFF8F0]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <p className="mb-2 text-sm font-semibold text-[#F77F00]">
              ADMIN DASHBOARD
            </p>

            <h1 className="text-3xl font-bold text-[#252525] md:text-4xl">
              Manage Users
            </h1>

            <p className="mt-2 text-gray-500">
              Manage customers, vendors and their account status.
            </p>
          </div>

          {/* Statistics */}
          <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">Total Users</p>
                <Users className="text-[#F77F00]" />
              </div>
              <h2 className="mt-4 text-3xl font-bold text-[#252525]">
                {totalUsers}
              </h2>
            </div>

            <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">Customers</p>
                <UserRound className="text-blue-500" />
              </div>
              <h2 className="mt-4 text-3xl font-bold text-[#252525]">
                {totalCustomers}
              </h2>
            </div>

            <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">Vendors</p>
                <Store className="text-green-500" />
              </div>
              <h2 className="mt-4 text-3xl font-bold text-[#252525]">
                {totalVendors}
              </h2>
            </div>

            <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">Blocked Users</p>
                <Ban className="text-red-500" />
              </div>
              <h2 className="mt-4 text-3xl font-bold text-[#252525]">
                {blockedUsers}
              </h2>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="mb-6 rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:max-w-md">
                <Search
                  size={19}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <Input
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-11 pl-10"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {["All", "Customer", "Vendor", "Active", "Blocked"].map(
                  (filter) => (
                    <Button
                      key={filter}
                      size="sm"
                      variant={
                        activeFilter === filter ? "default" : "outline"
                      }
                      onClick={() => setActiveFilter(filter)}
                      className={
                        activeFilter === filter
                          ? "bg-[#F77F00] hover:bg-[#e66f00]"
                          : ""
                      }
                    >
                      {filter}
                    </Button>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm">
            <div className="border-b border-orange-100 px-6 py-5">
              <h2 className="text-lg font-bold text-[#252525]">
                Registered Users
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {filteredUsers.length} users found
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] text-left">
                <thead className="bg-orange-50 text-sm text-gray-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">User</th>
                    <th className="px-6 py-4 font-semibold">User ID</th>
                    <th className="px-6 py-4 font-semibold">Role</th>
                    <th className="px-6 py-4 font-semibold">Joined Date</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 text-right font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-16 text-center">
                        Loading users...
                      </td>
                    </tr>
                  ) : filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="transition hover:bg-orange-50/50"
                      >
                        <td className="px-6 py-4">
                          <p className="font-semibold text-[#252525]">
                            {user.name}
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            {user.email}
                          </p>
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-500">
                          {user.id}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              user.role === "vendor"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-500">
                          {user.joinedDate}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              user.status === "Active"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={updatingId === user.id}
                            onClick={() => handleStatusChange(user)}
                            className={
                              user.status === "Active"
                                ? "border-red-200 text-red-600 hover:bg-red-50"
                                : "border-green-200 text-green-600 hover:bg-green-50"
                            }
                          >
                            {updatingId === user.id ? (
                              "Updating..."
                            ) : user.status === "Active" ? (
                              <>
                                <Ban size={15} className="mr-1" />
                                Block
                              </>
                            ) : (
                              <>
                                <CheckCircle size={15} className="mr-1" />
                                Unblock
                              </>
                            )}
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-16 text-center">
                        <ShieldCheck
                          size={42}
                          className="mx-auto mb-3 text-[#F77F00]"
                        />

                        <h3 className="font-bold text-[#252525]">
                          No Users Found
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          Try changing your search or filter.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}