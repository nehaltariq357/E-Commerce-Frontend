"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getMyOrders } from "../../features/order/order.api";
import { setOrders, setOrderLoading } from "../../features/order/orderSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

export const OrderPage = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.order.orders);
  const isLoading = useAppSelector((state) => state.order.isLoading);

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
  if (isLoading) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-10">
        {" "}
        <p>Loading orders...</p>{" "}
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      {" "}
      <h1 className="mb-8 text-3xl font-bold"> My Orders </h1>{" "}
      {orders.length === 0 ? (
        <div className="rounded-lg border p-8 text-center">
          {" "}
          <p className="text-gray-600">
            {" "}
            You haven't placed any orders yet.{" "}
          </p>{" "}
          <Link
            href="/products"
            className="mt-4 inline-block rounded-md bg-black px-5 py-2 text-white"
          >
            {" "}
            Start Shopping{" "}
          </Link>{" "}
        </div>
      ) : (
        <div className="space-y-4">
          {" "}
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/account/orders/${order.id}`}
              className="block rounded-lg border p-5 transition hover:shadow-md"
            >
              {" "}
              <div className="flex flex-wrap items-center justify-between gap-4">
                {" "}
                <div>
                  {" "}
                  <h2 className="font-semibold"> Order #{order.id} </h2>{" "}
                  <p className="mt-1 text-sm text-gray-500">
                    {" "}
                    {new Date(order.createdAt).toLocaleDateString()}{" "}
                  </p>{" "}
                </div>{" "}
                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
                  {" "}
                  {order.status}{" "}
                </span>{" "}
              </div>{" "}
              <div className="mt-4 flex flex-wrap justify-between gap-4">
                {" "}
                <p className="text-sm text-gray-600">
                  {" "}
                  {order.orderItems.length}{" "}
                  {order.orderItems.length === 1 ? "item" : "items"}{" "}
                </p>{" "}
                <p className="font-semibold">
                  {" "}
                  ${Number(order.totalAmount).toFixed(2)}{" "}
                </p>{" "}
              </div>{" "}
            </Link>
          ))}{" "}
        </div>
      )}{" "}
    </main>
  );
};
