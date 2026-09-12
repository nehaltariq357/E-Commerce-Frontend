
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { getAllAdminOrders } from "../../features/admin-order/admin-order.api";
import {
  setAdminOrders,
  setAdminOrderLoading,
} from "../../features/admin-order/admin-orderSlice"

import { useAppDispatch, useAppSelector } from "../../store/hooks";

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

  if (isLoading) {
    return (
      <div className="p-6">
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Orders Management
        </h1>

        <p className="text-gray-500">
          Manage all customer orders
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-lg border p-6 text-center">
          <p className="text-gray-500">
            No orders found.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-left">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b last:border-b-0"
                >
                  <td className="px-4 py-4 font-medium">
                    #{order.id}
                  </td>

                  <td className="px-4 py-4">
                    <div>
                      <p className="font-medium">
                        {order.user.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        {order.user.email}
                      </p>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    {order.orderItems.length}
                  </td>

                  <td className="px-4 py-4">
                    ${order.totalAmount}
                  </td>

                  <td className="px-4 py-4">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
                      {order.status}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <button
                      onClick={() =>
                        router.push(
                          `/admin/orders/${order.id}`
                        )
                      }
                      className="rounded-md bg-black px-3 py-2 text-sm text-white"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

