"use client";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../features/cart/cart.api";
import {
  updateCartItemState,
  removeFromCart,
  clearCartState,
} from "../features/cart/cartSlice";

export const CartPage = () => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart.cart);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // handle quantity

  const handleQuantityChange = async (cartItemId: number, quantity: number) => {
    if (quantity < 1) return;
    try {
      setLoading(true);
      setError("");
      const response = await updateCartItem(cartItemId, { quantity });
      dispatch(updateCartItemState(response.data));
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update quantity",
      );
    } finally {
      setLoading(false);
    }
  };

  // remove item

  const handleRemoveItem = async (cartItemId: number) => {
    try {
      setLoading(true);
      setError("");
      await removeCartItem(cartItemId);
      dispatch(removeFromCart(cartItemId));
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to remove item",
      );
    } finally {
      setLoading(false);
    }
  };

  // clear cart

  const handleClearCart = async () => {
    try {
      setLoading(true);
      setError("");
      await clearCart();
      dispatch(clearCartState());
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to clear cart");
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.cartItems.length === 0) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-10">
        {" "}
        <h1 className="text-3xl font-bold"> Your Cart </h1>{" "}
        <p className="mt-6 text-gray-500"> Your cart is empty. </p>{" "}
      </main>
    );
  }

  const totalPrice = cart.cartItems.reduce(
    (total, item) => total + item.quantity * Number(item.product.price),
    0,
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      {" "}
      <div className="flex items-center justify-between">
        {" "}
        <h1 className="text-3xl font-bold"> Your Cart </h1>{" "}
        <button
          type="button"
          onClick={handleClearCart}
          disabled={loading}
          className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-100 disabled:opacity-50"
        >
          {" "}
          Clear Cart{" "}
        </button>{" "}
      </div>{" "}
      {error && <p className="mt-4 text-red-500"> {error} </p>}{" "}
      <div className="mt-8 space-y-4">
        {" "}
        {cart.cartItems.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            {" "}
            {/* Product Info */}{" "}
            <div>
              {" "}
              <h2 className="font-semibold"> {item.product.name} </h2>{" "}
              <p className="mt-1 text-sm text-gray-500">
                {" "}
                ${item.product.price}{" "}
              </p>{" "}
              {item.variant && (
                <div className="mt-2 text-sm text-gray-500">
                  {" "}
                  {item.variant.size && (
                    <span> Size: {item.variant.size} </span>
                  )}{" "}
                  {item.variant.color && (
                    <span className="ml-3"> Color: {item.variant.color} </span>
                  )}{" "}
                </div>
              )}{" "}
            </div>{" "}
            {/* Quantity */}{" "}
            <div className="flex items-center gap-3">
              {" "}
              <button
                type="button"
                disabled={isLoading || item.quantity <= 1}
                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                className="h-9 w-9 rounded border hover:bg-gray-100 disabled:opacity-50"
              >
                {" "}
                -{" "}
              </button>{" "}
              <span className="min-w-6 text-center">
                {" "}
                {item.quantity}{" "}
              </span>{" "}
              <button
                type="button"
                disabled={loading}
                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                className="h-9 w-9 rounded border hover:bg-gray-100 disabled:opacity-50"
              >
                {" "}
                +{" "}
              </button>{" "}
            </div>{" "}
            {/* Item Total */}{" "}
            <p className="font-semibold">
              {" "}
              $ {(Number(item.product.price) * item.quantity).toFixed(2)}{" "}
            </p>{" "}
            {/* Remove */}{" "}
            <button
              type="button"
              disabled={loading}
              onClick={() => handleRemoveItem(item.id)}
              className="text-sm text-red-500 hover:underline disabled:opacity-50"
            >
              {" "}
              Remove{" "}
            </button>{" "}
          </div>
        ))}{" "}
      </div>{" "}
      {/* Cart Summary */}{" "}
      <div className="mt-10 flex justify-end">
        {" "}
        <div className="w-full rounded-xl border p-6 sm:w-96">
          {" "}
          <h2 className="text-xl font-semibold"> Cart Summary </h2>{" "}
          <div className="mt-4 flex justify-between">
            {" "}
            <span>Total</span>{" "}
            <span className="font-bold"> ${totalPrice.toFixed(2)} </span>{" "}
          </div>{" "}
          <button
            type="button"
            className="mt-6 w-full rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800"
          >
            {" "}
            Checkout{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
    </main>
  );
};
