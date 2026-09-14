
"use client";

import { useEffect, useState } from "react";

import { getDashboardStats } from "../features/admin-dashboard/admin-dashboard.api";

import type {
  DashboardStats,
} from "../features/admin-dashboard/admin-dashboard.types";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await getDashboardStats();

        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);

        setError("Failed to load dashboard statistics");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6">
        <p>No dashboard data found.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Admin Dashboard
        </h1>

        <p className="mt-1 text-gray-500">
          Manage your e-commerce store
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {/* Users */}
        <div className="rounded-lg border bg-white p-6">
          <p className="text-sm text-gray-500">
            Total Users
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {stats.totalUsers}
          </h2>
        </div>

        {/* Products */}
        <div className="rounded-lg border bg-white p-6">
          <p className="text-sm text-gray-500">
            Products
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {stats.totalProducts}
          </h2>
        </div>

        {/* Categories */}
        <div className="rounded-lg border bg-white p-6">
          <p className="text-sm text-gray-500">
            Categories
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {stats.totalCategories}
          </h2>
        </div>

        {/* Orders */}
        <div className="rounded-lg border bg-white p-6">
          <p className="text-sm text-gray-500">
            Total Orders
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {stats.totalOrders}
          </h2>
        </div>

      </div>

      {/* Revenue */}
      <div className="mt-6 rounded-lg border bg-white p-6">
        <p className="text-sm text-gray-500">
          Total Revenue
        </p>

        <h2 className="mt-2 text-3xl font-bold">
          Rs. {Number(stats.totalRevenue).toLocaleString()}
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Revenue from delivered orders
        </p>
      </div>

      {/* Order Status */}
      <div className="mt-6">
        <h2 className="mb-4 text-xl font-semibold">
          Order Status
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

          {/* Pending */}
          <div className="rounded-lg border bg-white p-5">
            <p className="text-sm text-gray-500">
              Pending
            </p>

            <h3 className="mt-2 text-2xl font-bold">
              {stats.orders.pending}
            </h3>
          </div>

          {/* Processing */}
          <div className="rounded-lg border bg-white p-5">
            <p className="text-sm text-gray-500">
              Processing
            </p>

            <h3 className="mt-2 text-2xl font-bold">
              {stats.orders.processing}
            </h3>
          </div>

          {/* Shipped */}
          <div className="rounded-lg border bg-white p-5">
            <p className="text-sm text-gray-500">
              Shipped
            </p>

            <h3 className="mt-2 text-2xl font-bold">
              {stats.orders.shipped}
            </h3>
          </div>

          {/* Delivered */}
          <div className="rounded-lg border bg-white p-5">
            <p className="text-sm text-gray-500">
              Delivered
            </p>

            <h3 className="mt-2 text-2xl font-bold">
              {stats.orders.delivered}
            </h3>
          </div>

          {/* Cancelled */}
          <div className="rounded-lg border bg-white p-5">
            <p className="text-sm text-gray-500">
              Cancelled
            </p>

            <h3 className="mt-2 text-2xl font-bold">
              {stats.orders.cancelled}
            </h3>
          </div>

        </div>
      </div>
    </div>
  );
}

