"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { getAllAdminOrders } from "../../features/admin-order/admin-order.api";
import {
  setAdminOrders,
  setAdminOrderLoading,
} from "../../features/admin-order/admin-orderSlice"

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import type { OrderStatus } from "../../features/admin-order/admin-order.types";

const ORDER_STATUS_META: Record<
  OrderStatus,
  { label: string; badgeClass: string; dotClass: string }
> = {
  PENDING: {
    label: "Pending",
    badgeClass: "bg-amber-50 text-amber-700 ring-amber-600/20",
    dotClass: "bg-amber-500",
  },
  PROCESSING: {
    label: "Processing",
    badgeClass: "bg-blue-50 text-blue-700 ring-blue-600/20",
    dotClass: "bg-blue-500",
  },
  SHIPPED: {
    label: "Shipped",
    badgeClass: "bg-violet-50 text-violet-700 ring-violet-600/20",
    dotClass: "bg-violet-500",
  },
  DELIVERED: {
    label: "Delivered",
    badgeClass: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    dotClass: "bg-emerald-500",
  },
  CANCELLED: {
    label: "Cancelled",
    badgeClass: "bg-red-50 text-red-700 ring-red-600/20",
    dotClass: "bg-red-500",
  },
};

function PackageIcon() {
  return (
    <svg className="h-4 w-4 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-8.25 4.5-8.25-4.5M20.25 7.5l-8.25-4.5-8.25 4.5M20.25 7.5v9l-8.25 4.5m0-9L3.75 7.5m8.25 4.5v9M3.75 7.5v9l8.25 4.5" />
    </svg>
  );
}
function EyeIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
function ReceiptEmptyIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-2.25-1.5-2.25 1.5-2.25-1.5-2.25 1.5-2.25-1.5-2.25 1.5-2.25-1.5-2.25 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185z" />
    </svg>
  );
}

function OrdersTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200">
      <div className="divide-y divide-zinc-100">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-4">
            <div className="h-4 w-14 animate-pulse rounded bg-zinc-100" />
            <div className="h-9 w-9 flex-shrink-0 animate-pulse rounded-full bg-zinc-100" />
            <div className="h-4 flex-1 animate-pulse rounded bg-zinc-100" />
            <div className="h-4 w-16 animate-pulse rounded bg-zinc-100" />
            <div className="h-6 w-20 animate-pulse rounded-full bg-zinc-100" />
            <div className="h-8 w-16 animate-pulse rounded-lg bg-zinc-100" />
          </div>
        ))}
      </div>
    </div>
  );
}

const rowVariants = {
  hidden: { opacity: 0, y: 6 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, delay: Math.min(i * 0.03, 0.3), ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function AdminOrdersPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { orders, isLoading } = useAppSelector(
    (state) => state.adminOrder
  );

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        dispatch(setAdminOrderLoading(true));

        const response: any = await getAllAdminOrders();

        dispatch(setAdminOrders(response.data));
      } catch (error) {
        console.error("Failed to fetch admin orders:", error);
      } finally {
        dispatch(setAdminOrderLoading(false));
      }
    };

    fetchOrders();
  }, [dispatch]);

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6 flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Orders Management
          </h1>

          <p className="mt-1 text-sm text-zinc-500">
            Manage all customer orders
          </p>
        </div>

        {!isLoading && orders.length > 0 && (
          <p className="hidden text-sm text-zinc-500 sm:block">
            {orders.length} {orders.length === 1 ? "order" : "orders"}
          </p>
        )}
      </div>

      {isLoading ? (
        <OrdersTableSkeleton />
      ) : orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 px-6 py-16 text-center"
        >
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">
            <ReceiptEmptyIcon />
          </div>
          <h3 className="text-base font-semibold text-zinc-900">No orders yet</h3>
          <p className="mt-1.5 max-w-sm text-sm text-zinc-500">
            Orders placed by customers will show up here.
          </p>
        </motion.div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-200">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-zinc-500">Order</th>
                  <th className="px-4 py-3 font-medium text-zinc-500">Customer</th>
                  <th className="px-4 py-3 font-medium text-zinc-500">Items</th>
                  <th className="px-4 py-3 font-medium text-zinc-500">Total</th>
                  <th className="px-4 py-3 font-medium text-zinc-500">Status</th>
                  <th className="px-4 py-3 text-right font-medium text-zinc-500">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-100 bg-white">
                {orders.map((order, i) => {
                  const statusMeta = ORDER_STATUS_META[order.status];
                  const initial = order.user.name?.charAt(0).toUpperCase() || "?";

                  return (
                    <motion.tr
                      key={order.id}
                      custom={i}
                      initial="hidden"
                      animate="show"
                      variants={rowVariants}
                      className="group transition-colors hover:bg-zinc-50/70"
                    >
                      <td className="px-4 py-4 font-medium text-zinc-900">
                        #{order.id}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white">
                            {initial}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-medium text-zinc-900">
                              {order.user.name}
                            </p>
                            <p className="truncate text-xs text-zinc-500">
                              {order.user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-zinc-600">
                        <span className="inline-flex items-center gap-1.5">
                          <PackageIcon />
                          {order.orderItems.length}
                        </span>
                      </td>

                      <td className="px-4 py-4 font-medium text-zinc-900">
                        ${order.totalAmount}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${statusMeta?.badgeClass ?? "bg-zinc-100 text-zinc-700 ring-zinc-600/10"
                            }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${statusMeta?.dotClass ?? "bg-zinc-400"}`} />
                          {statusMeta?.label ?? order.status}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-right">
                        <button
                          onClick={() =>
                            router.push(
                              `/admin/orders/${order.id}`
                            )
                          }
                          className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-zinc-900 px-3 text-sm font-medium text-white opacity-90 transition-all duration-150 group-hover:opacity-100 hover:bg-zinc-800 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2"
                        >
                          <EyeIcon />
                          View
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}