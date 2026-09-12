
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  getAdminOrdersById,
  upateAdminOrderStatus,
} from "../../../features/admin-order/admin-order.api";

import {
  setSelectedAdminOrder,
  updateAdminOrderState,
} from "../../../features/admin-order/admin-orderSlice";

import type {
  AdminOrder,
  OrderStatus,
} from "../../../features/admin-order/admin-order.types";

import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { OrderItem } from "@/app/features/order/order.types";

const statuses: OrderStatus[] = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const orderId = Number(params.id);

  const order = useAppSelector(
    (state) => state.adminOrder.selectedOrder
  );

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response: any = await getAdminOrdersById(orderId);

        dispatch(setSelectedAdminOrder(response.data));
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

  const handleStatusChange = async (
    status: OrderStatus
  ) => {
    if (!order) return;

    try {
      setIsUpdating(true);
      setError("");

      const response: any = await upateAdminOrderStatus(
        order.id,
        status
      );

      // Update selected order
      dispatch(setSelectedAdminOrder(response.data));

      // Update order in admin orders list
      dispatch(updateAdminOrderState(response.data));
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

  if (isLoading) {
    return (
      <div className="p-6">
        <p>Loading order...</p>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="p-6">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6">
        <p>Order not found.</p>
      </div>
    );
  }

  const isLocked =
    order.status === "DELIVERED" ||
    order.status === "CANCELLED";

  return (
    <div className="mx-auto max-w-5xl p-6">

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Order #{order.id}
          </h1>

          <p className="text-gray-500">
            Order details and management
          </p>
        </div>

        <button
          onClick={() => router.back()}
          className="rounded-md border px-4 py-2"
        >
          Back
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-red-600">
          {error}
        </div>
      )}

      {/* Customer */}
      <div className="mb-6 rounded-lg border p-5">
        <h2 className="mb-4 text-lg font-semibold">
          Customer
        </h2>

        <p>
          <strong>Name:</strong> {order.user.name}
        </p>

        <p>
          <strong>Email:</strong> {order.user.email}
        </p>
      </div>

      {/* Address */}
      {order.address && (
        <div className="mb-6 rounded-lg border p-5">
          <h2 className="mb-4 text-lg font-semibold">
            Delivery Address
          </h2>

          <p>{order.address.fullName}</p>
          <p>{order.address.phone}</p>
          <p>{order.address.addressLine}</p>
          <p>
            {order.address.city},{" "}
            {order.address.state}
          </p>
          <p>
            {order.address.postalCode},{" "}
            {order.address.country}
          </p>
        </div>
      )}

      {/* Products */}
      <div className="mb-6 rounded-lg border p-5">
        <h2 className="mb-4 text-lg font-semibold">
          Order Items
        </h2>

        <div className="space-y-4">
          {order.orderItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b pb-4 last:border-b-0"
            >
              <div>
                <p className="font-medium">
                  {item.productName}
                </p>

                {item.variant && (
                  <p className="text-sm text-gray-500">
                    {item.variant.size &&
                      `Size: ${item.variant.size} `}
                    {item.variant.color &&
                      `Color: ${item.variant.color}`}
                  </p>
                )}

                <p className="text-sm text-gray-500">
                  Quantity: {item.quantity}
                </p>
              </div>

              <p className="font-medium">
                ${item.price}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Payment */}
      {order.payments && (
        <div className="mb-6 rounded-lg border p-5">
          <h2 className="mb-4 text-lg font-semibold">
            Payment
          </h2>

          <p>
            <strong>Method:</strong>{" "}
            {order.payments.method}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            {order.payments.status}
          </p>
        </div>
      )}

      {/* Status */}
      <div className="mb-6 rounded-lg border p-5">
        <h2 className="mb-4 text-lg font-semibold">
          Order Status
        </h2>

        <div className="flex flex-wrap gap-2">
          {statuses.map((status) => {
            const isCurrent = order.status === status;

            return (
              <button
                key={status}
                disabled={isUpdating || isLocked}
                onClick={() => handleStatusChange(status)}
                className={`rounded-md px-4 py-2 text-sm ${
                  isCurrent
                    ? "bg-black text-white"
                    : "border"
                } ${
                  isUpdating || isLocked
                    ? "cursor-not-allowed opacity-50"
                    : ""
                }`}
              >
                {status}
              </button>
            );
          })}
        </div>
      </div>

      {/* Total */}
      <div className="rounded-lg border p-5">
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>${order.totalAmount}</span>
        </div>
      </div>

    </div>
  );
}


