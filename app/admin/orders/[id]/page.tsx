"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import {
  getAdminOrdersById,
  upateAdminOrderStatus,
} from "../../../features/admin-order/admin-order.api";

import {
  setSelectedAdminOrder,
  updateAdminOrderState,
} from "../../../features/admin-order/admin-orderSlice";

import type {
  OrderStatus,
  PaymentStatus,
} from "../../../features/admin-order/admin-order.types";

import { useAppDispatch, useAppSelector } from "../../../store/hooks";

// ==================================
// All possible statuses
// ==================================

const statuses: OrderStatus[] = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

// linear progression used for the tracking timeline (cancellation is a
// separate terminal state, handled on its own rather than as a timeline step)
const timelineStatuses = statuses.filter(
  (status) => status !== "CANCELLED"
);

// ==================================
// Get allowed next statuses
// ==================================

const getAllowedStatuses = (
  currentStatus: OrderStatus
): OrderStatus[] => {
  switch (currentStatus) {
    case "PENDING":
      return ["PROCESSING", "CANCELLED"];

    case "PROCESSING":
      return ["SHIPPED", "CANCELLED"];

    case "SHIPPED":
      return ["DELIVERED"];

    case "DELIVERED":
      return [];

    case "CANCELLED":
      return [];

    default:
      return [];
  }
};

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

const PAYMENT_STATUS_META: Record<
  PaymentStatus,
  { label: string; badgeClass: string }
> = {
  PENDING: { label: "Pending", badgeClass: "bg-amber-50 text-amber-700 ring-amber-600/20" },
  COMPLETED: { label: "Completed", badgeClass: "bg-emerald-50 text-emerald-700 ring-emerald-600/20" },
  FAILED: { label: "Failed", badgeClass: "bg-red-50 text-red-700 ring-red-600/20" },
  REFUNDED: { label: "Refunded", badgeClass: "bg-zinc-100 text-zinc-700 ring-zinc-600/10" },
};

function ArrowLeftIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
function MapPinIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  );
}
function PackageIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-8.25 4.5-8.25-4.5M20.25 7.5l-8.25-4.5-8.25 4.5M20.25 7.5v9l-8.25 4.5m0-9L3.75 7.5m8.25 4.5v9M3.75 7.5v9l8.25 4.5" />
    </svg>
  );
}
function CreditCardIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
    </svg>
  );
}
function TruckIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.25h5.379a2.25 2.25 0 011.591.659l2.379 2.379a2.25 2.25 0 01.659 1.591v6.621a1.125 1.125 0 01-1.125 1.125H14.25M4.5 14.25h9M4.5 14.25v-6.75a1.125 1.125 0 011.125-1.125h6.75a1.125 1.125 0 011.125 1.125v6.75" />
    </svg>
  );
}
function AlertIcon() {
  return (
    <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.008M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
function XIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}
function SpinnerIcon() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

function Card({
  title,
  icon,
  children,
  className = "",
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-shadow duration-200 sm:p-6 ${className}`}
    >
      <h2 className="mb-4 flex items-center gap-2 text-[13px] font-semibold text-zinc-500">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-50 text-zinc-400">
          {icon}
        </span>
        {title}
      </h2>
      {children}
    </div>
  );
}

function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-2xl bg-zinc-100 ${className}`} />
  );
}

function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="space-y-2.5">
          <div className="h-7 w-44 animate-pulse rounded-md bg-zinc-100" />
          <div className="h-4 w-56 animate-pulse rounded-md bg-zinc-100" />
        </div>
        <div className="h-9 w-24 animate-pulse rounded-lg bg-zinc-100" />
      </div>
      <div className="grid items-start gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <SkeletonBlock className="h-56" />
          <SkeletonBlock className="h-36" />
        </div>
        <div className="space-y-6">
          <SkeletonBlock className="h-28" />
          <SkeletonBlock className="h-40" />
          <SkeletonBlock className="h-52" />
          <SkeletonBlock className="h-20" />
        </div>
      </div>
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

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const orderId = Number(params.id);

  // ==================================
  // Get selected order from Redux
  // ==================================

  const order = useAppSelector(
    (state) => state.adminOrder.selectedOrder
  );

  // ==================================
  // Local states
  // ==================================

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");

  // ==================================
  // Fetch single order
  // ==================================

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response: any =
          await getAdminOrdersById(orderId);

        dispatch(
          setSelectedAdminOrder(response.data)
        );
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch order"
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (!Number.isNaN(orderId)) {
      fetchOrder();
    }
  }, [orderId, dispatch]);

  // ==================================
  // Update order status
  // ==================================

  const handleStatusChange = async (
    status: OrderStatus
  ) => {
    if (!order) return;

    try {
      setIsUpdating(true);
      setError("");

      const response: any =
        await upateAdminOrderStatus(
          order.id,
          status
        );

      // Update selected order
      dispatch(
        setSelectedAdminOrder(response.data)
      );

      // Update order in admin orders list
      dispatch(
        updateAdminOrderState(response.data)
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update order status"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  // ==================================
  // Loading
  // ==================================

  if (isLoading) {
    return <DetailSkeleton />;
  }

  // ==================================
  // Error without order
  // ==================================

  if (error && !order) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 px-6 py-16 text-center"
        >
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
            <AlertIcon />
          </div>
          <h3 className="text-base font-semibold text-zinc-900">Couldn&apos;t load order</h3>
          <p className="mt-1.5 max-w-sm text-sm text-zinc-500">{error}</p>
          <button
            onClick={() => router.back()}
            className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white transition-colors duration-150 hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2"
          >
            Go back
          </button>
        </motion.div>
      </div>
    );
  }

  // ==================================
  // Order not found
  // ==================================

  if (!order) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 px-6 py-16 text-center">
          <h3 className="text-base font-semibold text-zinc-900">Order not found</h3>
          <button
            onClick={() => router.back()}
            className="mt-6 inline-flex h-10 items-center justify-center rounded-lg border border-zinc-300 px-4 text-sm font-medium text-zinc-700 transition-colors duration-150 hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  // ==================================
  // Check if order is locked
  // ==================================

  const isLocked =
    order.status === "DELIVERED" ||
    order.status === "CANCELLED";

  // ==================================
  // Get allowed next statuses
  // ==================================

  const allowedStatuses =
    getAllowedStatuses(order.status);

  const currentStepIndex = timelineStatuses.indexOf(order.status);
  const customerInitial = order.user.name?.charAt(0).toUpperCase() || "?";

  // ==================================
  // Render
  // ==================================

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">

      {/* Header */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={fadeUp}
        className="mb-6 flex items-center justify-between gap-3"
      >
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
              Order #{order.id}
            </h1>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${ORDER_STATUS_META[order.status].badgeClass}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${ORDER_STATUS_META[order.status].dotClass}`} />
              {ORDER_STATUS_META[order.status].label}
            </span>
          </div>

          <p className="mt-1 text-sm text-zinc-500">
            Order details and management
          </p>
        </div>

        <button
          onClick={() => router.back()}
          className="inline-flex h-9 flex-shrink-0 items-center gap-1.5 rounded-lg border border-zinc-300 px-4 text-sm font-medium text-zinc-700 transition-colors duration-150 hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2"
        >
          <ArrowLeftIcon />
          Back
        </button>
      </motion.div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-start gap-2.5 overflow-hidden rounded-xl border border-red-200 bg-red-50 px-4 py-3"
          >
            <span className="mt-0.5 text-red-500"><AlertIcon /></span>
            <p className="flex-1 text-sm font-medium text-red-700">{error}</p>
            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss"
              className="text-red-400 transition-colors hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-1 rounded"
            >
              <XIcon />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid items-start gap-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Order Items */}
          <motion.div initial="hidden" animate="show" variants={fadeUp} custom={0.05}>
            <Card title="Order items" icon={<PackageIcon />}>
              <div className="divide-y divide-zinc-100">
                {order.orderItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium text-zinc-900">
                        {item.productName}
                      </p>

                      {item.variant && (item.variant.size || item.variant.color) && (
                        <p className="mt-0.5 text-sm text-zinc-500">
                          {item.variant.size && `Size: ${item.variant.size} `}
                          {item.variant.color && `Color: ${item.variant.color}`}
                        </p>
                      )}

                      <p className="mt-0.5 text-sm text-zinc-500">
                        Quantity: {item.quantity}
                      </p>
                    </div>

                    <p className="flex-shrink-0 font-medium text-zinc-900">
                      ${item.price}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Delivery Address */}
          {order.address && (
            <motion.div initial="hidden" animate="show" variants={fadeUp} custom={0.1}>
              <Card title="Delivery address" icon={<MapPinIcon />}>
                <div className="space-y-1 text-sm text-zinc-700">
                  <p className="font-medium text-zinc-900">{order.address.fullName}</p>
                  <p className="text-zinc-500">{order.address.phone}</p>
                  <p>{order.address.addressLine}</p>
                  <p>
                    {order.address.city}
                    {order.address.state ? `, ${order.address.state}` : ""}
                  </p>
                  <p>
                    {order.address.postalCode}, {order.address.country}
                  </p>
                </div>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6 lg:sticky lg:top-6">
          {/* Customer */}
          <motion.div initial="hidden" animate="show" variants={fadeUp} custom={0.1}>
            <Card title="Customer" icon={<UserIcon />}>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white">
                  {customerInitial}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-medium text-zinc-900">{order.user.name}</p>
                  <p className="truncate text-sm text-zinc-500">{order.user.email}</p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Payment */}
          {order.payments && (
            <motion.div initial="hidden" animate="show" variants={fadeUp} custom={0.15}>
              <Card title="Payment" icon={<CreditCardIcon />}>
                <div className="space-y-2.5 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">Method</span>
                    <span className="font-medium text-zinc-900">{order.payments.method}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">Status</span>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${PAYMENT_STATUS_META[order.payments.status]?.badgeClass ?? "bg-zinc-100 text-zinc-700 ring-zinc-600/10"
                        }`}
                    >
                      {PAYMENT_STATUS_META[order.payments.status]?.label ?? order.payments.status}
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Order Status */}
          <motion.div initial="hidden" animate="show" variants={fadeUp} custom={0.2}>
            <Card title="Order status" icon={<TruckIcon />}>
              {order.status === "CANCELLED" ? (
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ring-1 ring-inset ${ORDER_STATUS_META.CANCELLED.badgeClass}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${ORDER_STATUS_META.CANCELLED.dotClass}`} />
                  {ORDER_STATUS_META.CANCELLED.label}
                </span>
              ) : (
                <div className="flex items-start justify-between">
                  {timelineStatuses.map((status, index) => {
                    const isDone = index <= currentStepIndex;
                    const isLast = index === timelineStatuses.length - 1;
                    return (
                      <div key={status} className="relative flex flex-1 flex-col items-center">
                        {!isLast && (
                          <div
                            className={`absolute left-1/2 top-3 h-0.5 w-full transition-colors duration-300 ${index < currentStepIndex ? "bg-zinc-900" : "bg-zinc-200"
                              }`}
                          />
                        )}
                        <div
                          className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold transition-colors duration-300 ${isDone ? "bg-zinc-900 text-white" : "bg-zinc-200 text-zinc-500"
                            }`}
                        >
                          {isDone ? <CheckIcon /> : index + 1}
                        </div>
                        <span className="mt-2 text-center text-xs leading-tight text-zinc-600">
                          {ORDER_STATUS_META[status].label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {allowedStatuses.length > 0 && (
                <div className="mt-5 border-t border-zinc-100 pt-4">
                  <p className="mb-2.5 text-xs font-medium text-zinc-400">
                    Move to
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {allowedStatuses.map((status) => (
                      <button
                        key={status}
                        disabled={isUpdating}
                        onClick={() => handleStatusChange(status)}
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-zinc-300 px-3.5 text-sm font-medium text-zinc-700 transition-all duration-150 hover:border-zinc-400 hover:bg-zinc-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2"
                      >
                        {isUpdating && <SpinnerIcon />}
                        {ORDER_STATUS_META[status].label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {isLocked && (
                <p className="mt-4 text-sm text-zinc-500">
                  This order can no longer be updated.
                </p>
              )}
            </Card>
          </motion.div>

          {/* Total */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            custom={0.25}
            className="rounded-2xl border border-zinc-900 bg-zinc-900 p-5 text-white shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">Total</span>
              <span className="text-xl font-semibold tracking-tight">
                ${order.totalAmount}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}