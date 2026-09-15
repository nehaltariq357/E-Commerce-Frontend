"use client";

import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";

import { getDashboardStats } from "../features/admin-dashboard/admin-dashboard.api";
import type { DashboardStats } from "../features/admin-dashboard/admin-dashboard.types";

type OrderStatusKey = keyof DashboardStats["orders"];

const ORDER_STATUS_META: Record<
  OrderStatusKey,
  { label: string; badgeClass: string }
> = {
  pending: { label: "Pending", badgeClass: "bg-amber-50 text-amber-700 ring-amber-600/20" },
  processing: { label: "Processing", badgeClass: "bg-blue-50 text-blue-700 ring-blue-600/20" },
  shipped: { label: "Shipped", badgeClass: "bg-violet-50 text-violet-700 ring-violet-600/20" },
  delivered: { label: "Delivered", badgeClass: "bg-emerald-50 text-emerald-700 ring-emerald-600/20" },
  cancelled: { label: "Cancelled", badgeClass: "bg-red-50 text-red-700 ring-red-600/20" },
};

const ORDER_STATUS_ORDER: OrderStatusKey[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

function UsersIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  );
}
function BoxIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-8.25 4.5-8.25-4.5M20.25 7.5l-8.25-4.5-8.25 4.5M20.25 7.5v9l-8.25 4.5m0-9L3.75 7.5m8.25 4.5v9M3.75 7.5v9l8.25 4.5" />
    </svg>
  );
}
function TagIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
    </svg>
  );
}
function ReceiptIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-2.25-1.5-2.25 1.5-2.25-1.5-2.25 1.5-2.25-1.5-2.25 1.5-2.25-1.5-2.25 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185zM9.75 9h.008v.008H9.75V9zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM14.25 12h.008v.008h-.008V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  );
}
function BanknoteIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
    </svg>
  );
}
function AlertIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.008M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5">
      <div className="mb-3 h-9 w-9 animate-pulse rounded-full bg-zinc-100" />
      <div className="mb-2 h-3 w-20 animate-pulse rounded bg-zinc-100" />
      <div className="h-7 w-14 animate-pulse rounded bg-zinc-100" />
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-500">
        {icon}
      </div>
      <p className="mt-3 text-sm text-zinc-500">{label}</p>
      <h2 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900">{value}</h2>
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardStats = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  return (
    <div>
      {/* Header */}
      <motion.div initial="hidden" animate="show" variants={fadeUp} className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Admin dashboard</h1>
        <p className="mt-1 text-sm text-zinc-500">Manage your e-commerce store</p>
      </motion.div>

      {/* Error state */}
      {error && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 px-6 py-16 text-center"
        >
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
            <AlertIcon />
          </div>
          <h3 className="text-base font-semibold text-zinc-900">Couldn&apos;t load dashboard</h3>
          <p className="mt-1.5 max-w-sm text-sm text-zinc-500">{error}</p>
          <button
            onClick={fetchDashboardStats}
            className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-zinc-100 px-4 text-sm font-medium text-zinc-900 transition-colors duration-150 hover:bg-zinc-200 active:scale-[0.98]"
          >
            Try again
          </button>
        </motion.div>
      )}

      {!error && (
        <>
          {/* Summary cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {isLoading || !stats ? (
              Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
            ) : (
              <>
                <motion.div initial="hidden" animate="show" variants={fadeUp} custom={0.05}>
                  <SummaryCard icon={<UsersIcon />} label="Total users" value={stats.totalUsers} />
                </motion.div>
                <motion.div initial="hidden" animate="show" variants={fadeUp} custom={0.1}>
                  <SummaryCard icon={<BoxIcon />} label="Products" value={stats.totalProducts} />
                </motion.div>
                <motion.div initial="hidden" animate="show" variants={fadeUp} custom={0.15}>
                  <SummaryCard icon={<TagIcon />} label="Categories" value={stats.totalCategories} />
                </motion.div>
                <motion.div initial="hidden" animate="show" variants={fadeUp} custom={0.2}>
                  <SummaryCard icon={<ReceiptIcon />} label="Total orders" value={stats.totalOrders} />
                </motion.div>
              </>
            )}
          </div>

          {/* Revenue */}
          <div className="mt-4">
            {isLoading || !stats ? (
              <div className="h-[136px] animate-pulse rounded-2xl bg-zinc-100" />
            ) : (
              <motion.div
                initial="hidden"
                animate="show"
                variants={fadeUp}
                custom={0.25}
                className="rounded-2xl border border-zinc-900 bg-zinc-900 p-5 text-white shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-zinc-400">Total revenue</p>
                    <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                      Rs. {Number(stats.totalRevenue).toLocaleString()}
                    </h2>
                    <p className="mt-1 text-sm text-zinc-400">Revenue from delivered orders</p>
                  </div>
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">
                    <BanknoteIcon />
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order status */}
          <div className="mt-8">
            <h2 className="mb-4 text-lg font-semibold text-zinc-900">Order status</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {isLoading || !stats ? (
                Array.from({ length: 5 }).map((_, i) => <StatCardSkeleton key={i} />)
              ) : (
                ORDER_STATUS_ORDER.map((key, i) => {
                  const meta = ORDER_STATUS_META[key];
                  return (
                    <motion.div
                      key={key}
                      initial="hidden"
                      animate="show"
                      variants={fadeUp}
                      custom={0.3 + i * 0.05}
                      className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${meta.badgeClass}`}
                      >
                        {meta.label}
                      </span>
                      <h3 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">
                        {stats.orders[key]}
                      </h3>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}