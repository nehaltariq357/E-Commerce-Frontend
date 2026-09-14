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
    return (
      <div className="p-6">
        <p>Loading order...</p>
      </div>
    );
  }

  // ==================================
  // Error without order
  // ==================================

  if (error && !order) {
    return (
      <div className="p-6">
        <p className="text-red-500">
          {error}
        </p>
      </div>
    );
  }

  // ==================================
  // Order not found
  // ==================================

  if (!order) {
    return (
      <div className="p-6">
        <p>Order not found.</p>
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

  // ==================================
  // Render
  // ==================================

  return (
    <div className="mx-auto max-w-5xl p-6">

      {/* ==================================
          Header
      ================================== */}

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
          className="rounded-md border px-4 py-2 hover:bg-gray-50"
        >
          Back
        </button>
      </div>

      {/* ==================================
          Error
      ================================== */}

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-red-600">
          {error}
        </div>
      )}

      {/* ==================================
          Customer
      ================================== */}

      <div className="mb-6 rounded-lg border p-5">
        <h2 className="mb-4 text-lg font-semibold">
          Customer
        </h2>

        <p>
          <strong>Name:</strong>{" "}
          {order.user.name}
        </p>

        <p>
          <strong>Email:</strong>{" "}
          {order.user.email}
        </p>
      </div>

      {/* ==================================
          Delivery Address
      ================================== */}

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

      {/* ==================================
          Order Items
      ================================== */}

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

      {/* ==================================
          Payment
      ================================== */}

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

      {/* ==================================
          Order Status
      ================================== */}

      <div className="mb-6 rounded-lg border p-5">
        <h2 className="mb-4 text-lg font-semibold">
          Order Status
        </h2>

        <div className="flex flex-wrap gap-2">

          {/* Current status */}

          <button
            disabled
            className="cursor-not-allowed rounded-md bg-black px-4 py-2 text-sm text-white opacity-70"
          >
            {order.status}
          </button>

          {/* Allowed next statuses */}

          {allowedStatuses.map((status) => (
            <button
              key={status}
              disabled={isUpdating}
              onClick={() =>
                handleStatusChange(status)
              }
              className={`rounded-md border px-4 py-2 text-sm transition ${
                isUpdating
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-gray-100"
              }`}
            >
              {isUpdating
                ? "Updating..."
                : status}
            </button>
          ))}
        </div>

        {/* Locked message */}

        {isLocked && (
          <p className="mt-3 text-sm text-gray-500">
            This order can no longer be updated.
          </p>
        )}
      </div>

      {/* ==================================
          Total
      ================================== */}

      <div className="rounded-lg border p-5">
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>

          <span>
            ${order.totalAmount}
          </span>
        </div>
      </div>

    </div>
  );
}