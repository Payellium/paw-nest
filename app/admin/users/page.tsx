
"use client";

import { useEffect, useMemo, useState } from "react";

type UserRole = "user" | "admin";

interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  image?: string;
  phone?: string;
  location?: string;
  createdAt?: string;
}

type RoleFilter = "All" | "Admin" | "User";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("All");

  // Fetch users from the admin API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/admin/users");
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load users.");
        }

        setUsers(data.users || []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading users."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Summary counts
  const totalUsers = users.length;
  const adminCount = users.filter(
    (user) => user.role === "admin"
  ).length;
  const regularUserCount = users.filter(
    (user) => user.role === "user"
  ).length;

  // Search and role filtering
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchTerm = search.toLowerCase().trim();

      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm);

      const matchesRole =
        roleFilter === "All" ||
        (roleFilter === "Admin" && user.role === "admin") ||
        (roleFilter === "User" && user.role === "user");

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  // Format registration date
  const formatDate = (date?: string) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-8">

      {/* Page Heading */}
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#7C3AED] via-[#8B5CF6] to-[#A78BFA] p-7 text-white shadow-xl sm:p-10">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white">
            🐾 User Management
          </span>

          <h2 className="mt-5 text-3xl font-extrabold sm:text-4xl">
            Registered Users
          </h2>

          <p className="mt-3 text-base leading-7 text-violet-100 sm:text-lg">
            View and keep track of everyone who has joined
            the PawNest community. Manage your community
            with care.
          </p>
        </div>

        <div className="pointer-events-none absolute -right-8 -top-10 text-[180px] opacity-10">
          🐱
        </div>
      </section>

      {/* Summary Cards */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">

        <div className="rounded-2xl border border-violet-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-semibold text-slate-500">
                Total Users
              </p>
              <h3 className="mt-3 text-4xl font-extrabold text-[#292044]">
                {loading ? "..." : totalUsers}
              </h3>
            </div>

            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-3xl">
              👥
            </span>
          </div>
          <p className="mt-4 text-sm font-medium text-slate-500">
            All registered accounts
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-semibold text-slate-500">
                Administrators
              </p>
              <h3 className="mt-3 text-4xl font-extrabold text-emerald-700">
                {loading ? "..." : adminCount}
              </h3>
            </div>

            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-3xl">
              🛡️
            </span>
          </div>
          <p className="mt-4 text-sm font-medium text-slate-500">
            Admin accounts
          </p>
        </div>

        <div className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-semibold text-slate-500">
                Regular Users
              </p>
              <h3 className="mt-3 text-4xl font-extrabold text-sky-700">
                {loading ? "..." : regularUserCount}
              </h3>
            </div>

            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-3xl">
              🐾
            </span>
          </div>
          <p className="mt-4 text-sm font-medium text-slate-500">
            Community members
          </p>
        </div>
      </section>

      {/* Users List */}
      <section className="overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-sm">

        {/* Section Header */}
        <div className="border-b border-slate-100 p-6 sm:p-8">
          <div>
            <h3 className="text-2xl font-extrabold text-[#292044] sm:text-3xl">
              All Registered Users
            </h3>

            <p className="mt-2 text-base text-slate-500">
              Browse and search PawNest community members.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div className="relative w-full lg:max-w-md">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">
                🔍
              </span>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email..."
                className="h-14 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-base text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {(["All", "Admin", "User"] as RoleFilter[]).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setRoleFilter(role)}
                  className={`rounded-xl px-5 py-3 text-base font-bold transition ${
                    roleFilter === role
                      ? "bg-violet-600 text-white shadow-md shadow-violet-200"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:bg-violet-50"
                  }`}
                >
                  {role === "All" ? "All Users" : role === "Admin" ? "Admins" : "Users"}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-5 text-sm font-medium text-slate-500">
            Showing {filteredUsers.length} of {totalUsers} users
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex min-h-64 flex-col items-center justify-center gap-4 p-8">
            <span className="h-12 w-12 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
            <p className="text-base font-semibold text-slate-500">
              Loading registered users...
            </p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="p-8 text-center">
            <p className="text-lg font-bold text-red-600">
              {error}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Please refresh the page and try again.
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredUsers.length === 0 && (
          <div className="flex min-h-64 flex-col items-center justify-center p-8 text-center">
            <span className="text-6xl">🐱</span>
            <h4 className="mt-4 text-xl font-bold text-[#292044]">
              No users found
            </h4>
            <p className="mt-2 text-base text-slate-500">
              Try changing your search or role filter.
            </p>
          </div>
        )}

        {/* Users Table */}
        {!loading && !error && filteredUsers.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left">
              <thead className="bg-violet-50">
                <tr className="text-sm font-bold uppercase tracking-wide text-violet-800">
                  <th className="px-6 py-5">User</th>
                  <th className="px-6 py-5">Contact</th>
                  <th className="px-6 py-5">Location</th>
                  <th className="px-6 py-5">Role</th>
                  <th className="px-6 py-5">Joined</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="transition hover:bg-violet-50/50"
                  >
                    {/* User */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.name}
                            className="h-12 w-12 rounded-full border border-violet-100 object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-violet-100 text-lg font-extrabold text-violet-700">
                            {user.name?.charAt(0).toUpperCase() || "U"}
                          </div>
                        )}

                        <div>
                          <p className="font-bold text-[#292044]">
                            {user.name}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            ID: {user._id.slice(-8)}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-6 py-5">
                      <p className="text-sm font-medium text-slate-700">
                        {user.email}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {user.phone || "No phone provided"}
                      </p>
                    </td>

                    {/* Location */}
                    <td className="px-6 py-5">
                      <span className="text-sm text-slate-600">
                        {user.location || "Not provided"}
                      </span>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex rounded-full px-4 py-2 text-sm font-bold ${
                          user.role === "admin"
                            ? "bg-violet-100 text-violet-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {user.role === "admin" ? "Admin" : "User"}
                      </span>
                    </td>

                    {/* Joined */}
                    <td className="px-6 py-5">
                      <span className="text-sm font-medium text-slate-600">
                        {formatDate(user.createdAt)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Read-only Notice */}
      <div className="flex items-start gap-3 rounded-2xl border border-violet-100 bg-violet-50 p-5">
        <span className="text-2xl">🔒</span>
        <div>
          <h4 className="font-bold text-[#292044]">
            Read-only User Management
          </h4>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            User information is displayed for administrative
            monitoring only. Account roles and personal details
            cannot be modified from this page.
          </p>
        </div>
      </div>

    </div>
  );
}
