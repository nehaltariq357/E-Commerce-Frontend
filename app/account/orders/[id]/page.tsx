"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cancelOrder, getOrderById } from "../../../features/order/order.api";
import {
  setSelectedOrder,
  setOrderLoading,
} from "../../../features/order/orderSlice";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";

const STATUS_META: Record<string, { label: string; badgeClass: string; dotClass: string }> = {
  PENDING: { label: "Pending", badgeClass: "bg-amber-50 text-amber-700 ring-amber-600/20", dotClass: "bg-amber-500" },
  PROCESSING: { label: "Processing", badgeClass: "bg-blue-50 text-blue-700 ring-blue-600/20", dotClass: "bg-blue-500" },
  SHIPPED: { label: "Shipped", badgeClass: "bg-violet-50 text-violet-700 ring-violet-600/20", dotClass: "bg-violet-500" },
  DELIVERED: { label: "Delivered", badgeClass: "bg-emerald-50 text-emerald-700 ring-emerald-600/20", dotClass: "bg-emerald-500" },
  CANCELLED: { label: "Cancelled", badgeClass: "bg-red-50 text-red-700 ring-red-600/20", dotClass: "bg-red-500" },
};

function AlertIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
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

function OrderDetailsSkeleton() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="h-4 w-24 animate-pulse rounded bg-zinc-100" />
          <div className="mt-3 h-8 w-40 animate-pulse rounded bg-zinc-100" />
        </div>
        <div className="h-8 w-24 animate-pulse rounded-full bg-zinc-100" />
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 p-6 md:col-span-2">
          <div className="h-5 w-28 animate-pulse rounded bg-zinc-100" />
          <div className="mt-5 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded bg-zinc-100" />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="h-32 animate-pulse rounded-xl bg-zinc-100" />
          <div className="h-28 animate-pulse rounded-xl bg-zinc-100" />
        </div>
      </div>
    </main>
  );
}

export default function OrderDetails() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const order = useAppSelector((state) => state.order.selectedOrder);
  const isLoading = useAppSelector((state) => state.order.isLoading);
  const [isCancelling, setIsCanceling] = useState(false);
  const [error, setError] = useState("");
  const orderId = Number(params.id);

  useEffect(() => {
    const loadOrder = async () => {
      if (Number.isNaN(orderId)) {
        setError("Invalid order ID");
        return;
      }
      try {
        dispatch(setOrderLoading(true));
        const response = await getOrderById(orderId);
        dispatch(setSelectedOrder(response.data));
      } catch (error) {
        console.error("Failed to load order: ", error);
        setError(
          error instanceof Error ? error.message : "Failed to load order",
        );
      } finally {
        dispatch(setOrderLoading(false));
      }
    };
    loadOrder();
  }, [orderId, dispatch]);

  const handleCancelOrder = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?",
    );
    if (!confirmed) return;

    try {
      setError("");
      setIsCanceling(true);
      const response: any = await cancelOrder(orderId);
      dispatch(setSelectedOrder(response.data));
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error ? error.message : "Failed to cancel order",
      );
    } finally {
      setIsCanceling(false);
    }
  };

  if (isLoading) {
    return <OrderDetailsSkeleton />;
  }

  if (error && !order) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mx-auto flex max-w-md flex-col items-center rounded-xl border border-red-200 bg-red-50 px-6 py-10 text-center">
          <AlertIcon />
          <p className="mt-3 text-sm text-red-700">{error}</p>
        </div>
        <Link
          href="/account/orders"
          className="mt-6 inline-block rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-zinc-800"
        >
          Back to Orders
        </Link>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mx-auto flex max-w-md flex-col items-center rounded-xl border border-dashed border-zinc-200 px-6 py-10 text-center">
          <p className="text-sm text-zinc-500">Order not found.</p>
        </div>
      </main>
    );
  }

  const canCancel =
    order.status !== "PENDING" &&
    order.status !== "CANCELLED" &&
    order.status !== "DELIVERED";

  const statusMeta = STATUS_META[order.status];

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8 flex flex-wrap items-center justify-between gap-4"
      >
        <div>
          <Link
            href="/account/orders"
            className="text-sm text-zinc-500 transition-colors hover:text-zinc-700 hover:underline"
          >
            ← Back to Orders
          </Link>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
            Order #{order.id}
          </h1>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium ring-1 ring-inset ${
            statusMeta?.badgeClass ?? "bg-zinc-100 text-zinc-700 ring-zinc-600/10"
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${statusMeta?.dotClass ?? "bg-zinc-400"}`} />
          {statusMeta?.label ?? order.status}
        </span>
      </motion.div>

      {error && (
        <p className="mb-6 flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
          <AlertIcon />
          {error}
        </p>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {/* Order Items */}
        <section className="md:col-span-2">
          <div className="rounded-xl border border-zinc-200 bg-white p-6">
            <h2 className="mb-5 text-base font-semibold text-zinc-900">Order Items</h2>
            <div className="space-y-5">
              {order.orderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between gap-4 border-b border-zinc-100 pb-5 last:border-b-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium text-zinc-900">{item.productName}</p>
                    <p className="mt-1 text-sm text-zinc-500">
                      Quantity: {item.quantity}
                    </p>
                    {item.variantSize && (
                      <p className="text-sm text-zinc-500">Size: {item.variantSize}</p>
                    )}
                    {item.variantColor && (
                      <p className="text-sm text-zinc-500">Color: {item.variantColor}</p>
                    )}
                  </div>
                  <p className="font-medium text-zinc-900">
                    ${(Number(item.price) * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 border-t border-zinc-100 pt-5">
              <div className="flex justify-between text-lg font-semibold text-zinc-900">
                <span>Total</span>
                <span>${Number(order.totalAmount).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Side Information */}
        <section className="space-y-6">
          {/* Address */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6">
            <h2 className="mb-4 text-sm font-semibold text-zinc-900">Delivery Address</h2>
            {order.address ? (
              <div className="text-sm text-zinc-600">
                <p className="font-medium text-zinc-900">{order.address.fullName}</p>
                <p>{order.address.phone}</p>
                <p className="mt-2">{order.address.addressLine}</p>
                <p>
                  {order.address.city}
                  {order.address.state ? `, ${order.address.state}` : ""}
                </p>
                <p>
                  {order.address.postalCode}, {order.address.country}
                </p>
              </div>
            ) : (
              <p className="text-sm text-zinc-500">Address unavailable</p>
            )}
          </div>

          {/* Payment */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6">
            <h2 className="mb-4 text-sm font-semibold text-zinc-900">Payment</h2>
            {order.payments ? (
              <div className="space-y-2 text-sm text-zinc-600">
                <p>
                  Method: <span className="font-medium text-zinc-900">{order.payments.method}</span>
                </p>
                <p>
                  Status: <span className="font-medium text-zinc-900">{order.payments.status}</span>
                </p>
                <p>Amount: ${Number(order.payments.amount).toFixed(2)}</p>
              </div>
            ) : (
              <p className="text-sm text-zinc-500">Payment information unavailable</p>
            )}
          </div>

          {/* Cancel */}
          {canCancel && (
            <button
              type="button"
              onClick={handleCancelOrder}
              disabled={isCancelling}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-red-300 px-5 py-3 text-sm font-medium text-red-600 transition-colors duration-150 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isCancelling && <SpinnerIcon />}
              {isCancelling ? "Cancelling..." : "Cancel Order"}
            </button>
          )}
        </section>
      </div>
    </main>
  );
}