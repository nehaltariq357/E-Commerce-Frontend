"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { getMyOrders } from "../../features/order/order.api";
import { setOrders, setOrderLoading } from "../../features/order/orderSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

function PackageIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-8.25 4.5L3.75 7.5M20.25 7.5l-8.25-4.5L3.75 7.5M20.25 7.5v9l-8.25 4.5m-8.25-4.5v-9m8.25 13.5v-9" />
    </svg>
  );
}
function ChevronRightIcon() {
  return (
    <svg className="h-4 w-4 shrink-0 text-zinc-300 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  );
}

function statusStyles(status: string) {
  const normalized = status?.toLowerCase() ?? "";
  if (["delivered", "completed", "fulfilled"].includes(normalized)) {
    return { badge: "bg-emerald-50 text-emerald-700 ring-emerald-600/20", dot: "bg-emerald-500" };
  }
  if (["cancelled", "canceled", "failed", "refunded"].includes(normalized)) {
    return { badge: "bg-red-50 text-red-700 ring-red-600/20", dot: "bg-red-500" };
  }
  if (["shipped", "processing", "confirmed"].includes(normalized)) {
    return { badge: "bg-blue-50 text-blue-700 ring-blue-600/20", dot: "bg-blue-500" };
  }
  return { badge: "bg-zinc-100 text-zinc-600 ring-zinc-500/10", dot: "bg-zinc-400" };
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(amount);
}

function OrderCardSkeleton() {
  return (
    <div className="rounded-2xl border border-zinc-200 p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="h-11 w-11 shrink-0 animate-pulse rounded-xl bg-zinc-100" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-28 animate-pulse rounded bg-zinc-200" />
          <div className="h-3 w-20 animate-pulse rounded bg-zinc-100" />
        </div>
        <div className="h-6 w-20 animate-pulse rounded-full bg-zinc-100" />
      </div>
      <div className="mt-5 flex flex-wrap justify-between gap-4 border-t border-zinc-100 pt-4">
        <div className="h-3 w-16 animate-pulse rounded bg-zinc-100" />
        <div className="h-4 w-14 animate-pulse rounded bg-zinc-200" />
      </div>
    </div>
  );
}

const FILTERS = ["All", "Processing", "Shipped", "Delivered", "Cancelled"] as const;
type FilterKey = (typeof FILTERS)[number];

function matchesFilter(status: string, filter: FilterKey) {
  if (filter === "All") return true;
  const normalized = status?.toLowerCase() ?? "";
  if (filter === "Processing") return ["processing", "confirmed", "pending"].includes(normalized);
  if (filter === "Shipped") return ["shipped"].includes(normalized);
  if (filter === "Delivered") return ["delivered", "completed", "fulfilled"].includes(normalized);
  if (filter === "Cancelled") return ["cancelled", "canceled", "failed", "refunded"].includes(normalized);
  return true;
}

export default function Orders() {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.order.orders);
  const isLoading = useAppSelector((state) => state.order.isLoading);
  const [activeFilter, setActiveFilter] = useState<FilterKey>("All");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        dispatch(setOrderLoading(true));
        const response = await getMyOrders();
        dispatch(setOrders(response.data));
      } catch (error) {
        console.error("Failed to load orders:", error);
      } finally {
        dispatch(setOrderLoading(false));
      }
    };

    loadOrders();
  }, [dispatch]);

  const filteredOrders = useMemo(
    () => orders.filter((order) => matchesFilter(order.status, activeFilter)),
    [orders, activeFilter],
  );

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8 flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
            My Orders
          </h1>
          <p className="mt-1.5 text-sm text-zinc-500">
            Track and review your past purchases
          </p>
        </div>
        {!isLoading && orders.length > 0 && (
          <p className="text-sm text-zinc-400">
            {orders.length} {orders.length === 1 ? "order" : "orders"} total
          </p>
        )}
      </motion.div>

      {!isLoading && orders.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="mb-6 flex flex-wrap gap-2"
        >
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`relative rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 ${
                  isActive
                    ? "text-white"
                    : "text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="active-filter-pill"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    className="absolute inset-0 rounded-full bg-zinc-900"
                  />
                )}
                {!isActive && (
                  <span className="absolute inset-0 rounded-full bg-zinc-100" />
                )}
                <span className="relative">{filter}</span>
              </button>
            );
          })}
        </motion.div>
      )}

      {isLoading ? (
        <div className="space-y-4">
          <OrderCardSkeleton />
          <OrderCardSkeleton />
          <OrderCardSkeleton />
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/40 px-6 py-20 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">
            <PackageIcon />
          </div>
          <p className="text-sm font-medium text-zinc-700">No orders yet</p>
          <p className="mt-1 text-sm text-zinc-500">
            You haven&apos;t placed any orders yet.
          </p>
          <Link
            href="/products"
            className="mt-5 inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
          >
            Start Shopping
          </Link>
        </div>
      ) : filteredOrders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/40 px-6 py-16 text-center"
        >
          <p className="text-sm font-medium text-zinc-700">No orders match this filter</p>
          <p className="mt-1 text-sm text-zinc-500">Try a different status above.</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {filteredOrders.map((order, index) => {
              const status = statusStyles(order.status);
              return (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="group block rounded-2xl border border-zinc-200 p-5 transition-all duration-150 hover:border-zinc-300 hover:shadow-sm sm:p-6"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500">
                          <PackageIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="font-semibold text-zinc-900">Order #{order.id}</h2>
                            <ChevronRightIcon />
                          </div>
                          <p className="mt-0.5 text-sm text-zinc-500">
                            {new Date(order.createdAt).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium capitalize ring-1 ring-inset ${status.badge}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                        {order.status}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-zinc-100 pt-4">
                      <p className="text-sm text-zinc-500">
                        {order.orderItems.length}{" "}
                        {order.orderItems.length === 1 ? "item" : "items"}
                      </p>
                      <p className="font-semibold text-zinc-900">
                        {formatCurrency(Number(order.totalAmount))}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </main>
  );
}