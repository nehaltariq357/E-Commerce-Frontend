"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { cancelOrder, getOrderById } from "../../../features/order/order.api";
import {
  setSelectedOrder,
  setOrderLoading,
} from "../../../features/order/orderSlice";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";

export const OrderDetailPage = () => {
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
    return <div>Loading order...</div>;
  }

  if (error && !order) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-10">
        {" "}
        <p className="text-red-600">{error}</p>{" "}
        <Link
          href="/account/orders"
          className="mt-4 inline-block rounded-md bg-black px-5 py-2 text-white"
        >
          {" "}
          Back to Orders{" "}
        </Link>{" "}
      </main>
    );
  }

  if (!order) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-10">
        {" "}
        <p>Order not found.</p>{" "}
      </main>
    );
  }

  const canCancel =
    order.status !== "PENDING" &&
    order.status !== "CANCELLED" &&
    order.status !== "DELIVERED";

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      {" "}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        {" "}
        <div>
          {" "}
          <Link
            href="/account/orders"
            className="text-sm text-gray-500 hover:underline"
          >
            {" "}
            ← Back to Orders{" "}
          </Link>{" "}
          <h1 className="mt-2 text-3xl font-bold"> Order #{order.id} </h1>{" "}
        </div>{" "}
        <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium">
          {" "}
          {order.status}{" "}
        </span>{" "}
      </div>{" "}
      {error && <p className="mb-6 text-sm text-red-600"> {error} </p>}{" "}
      <div className="grid gap-6 md:grid-cols-3">
        {" "}
        {/* Order Items */}{" "}
        <section className="md:col-span-2">
          {" "}
          <div className="rounded-lg border p-6">
            {" "}
            <h2 className="mb-5 text-xl font-semibold"> Order Items </h2>{" "}
            <div className="space-y-5">
              {" "}
              {order.orderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between gap-4 border-b pb-5 last:border-b-0 last:pb-0"
                >
                  {" "}
                  <div>
                    {" "}
                    <p className="font-medium"> {item.productName} </p>{" "}
                    <p className="mt-1 text-sm text-gray-500">
                      {" "}
                      Quantity: {item.quantity}{" "}
                    </p>{" "}
                    {item.variantSize && (
                      <p className="text-sm text-gray-500">
                        {" "}
                        Size: {item.variantSize}{" "}
                      </p>
                    )}{" "}
                    {item.variantColor && (
                      <p className="text-sm text-gray-500">
                        {" "}
                        Color: {item.variantColor}{" "}
                      </p>
                    )}{" "}
                  </div>{" "}
                  <p className="font-medium">
                    {" "}
                    $ {(Number(item.price) * item.quantity).toFixed(2)}{" "}
                  </p>{" "}
                </div>
              ))}{" "}
            </div>{" "}
            <div className="mt-6 border-t pt-5">
              {" "}
              <div className="flex justify-between text-lg font-bold">
                {" "}
                <span>Total</span>{" "}
                <span> $ {Number(order.totalAmount).toFixed(2)} </span>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </section>{" "}
        {/* Side Information */}{" "}
        <section className="space-y-6">
          {" "}
          {/* Address */}{" "}
          <div className="rounded-lg border p-6">
            {" "}
            <h2 className="mb-4 font-semibold"> Delivery Address </h2>{" "}
            {order.address ? (
              <div className="text-sm text-gray-600">
                {" "}
                <p className="font-medium text-black">
                  {" "}
                  {order.address.fullName}{" "}
                </p>{" "}
                <p> {order.address.phone} </p>{" "}
                <p className="mt-2"> {order.address.addressLine} </p>{" "}
                <p>
                  {" "}
                  {order.address.city}{" "}
                  {order.address.state ? `, ${order.address.state}` : ""}{" "}
                </p>{" "}
                <p>
                  {" "}
                  {order.address.postalCode}, {order.address.country}{" "}
                </p>{" "}
              </div>
            ) : (
              <p className="text-sm text-gray-500"> Address unavailable </p>
            )}{" "}
          </div>{" "}
          {/* Payment */}{" "}
          <div className="rounded-lg border p-6">
            {" "}
            <h2 className="mb-4 font-semibold"> Payment </h2>{" "}
            {order.payment ? (
              <div className="space-y-2 text-sm">
                {" "}
                <p>
                  {" "}
                  Method:{" "}
                  <span className="font-medium">
                    {" "}
                    {order.payment.method}{" "}
                  </span>{" "}
                </p>{" "}
                <p>
                  {" "}
                  Status:{" "}
                  <span className="font-medium">
                    {" "}
                    {order.payment.status}{" "}
                  </span>{" "}
                </p>{" "}
                <p>
                  {" "}
                  Amount: $ {Number(order.payment.amount).toFixed(2)}{" "}
                </p>{" "}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                {" "}
                Payment information unavailable{" "}
              </p>
            )}{" "}
          </div>{" "}
          {/* Cancel */}{" "}
          {canCancel && (
            <button
              type="button"
              onClick={handleCancelOrder}
              disabled={isCancelling}
              className="w-full rounded-md border border-red-500 px-5 py-3 text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {" "}
              {isCancelling ? "Cancelling..." : "Cancel Order"}{" "}
            </button>
          )}{" "}
        </section>{" "}
      </div>{" "}
    </main>
  );
};
