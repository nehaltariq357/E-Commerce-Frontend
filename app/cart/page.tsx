"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
import { useRouter } from "next/navigation";

function AlertIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  );
}
function CartIcon() {
  return (
    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.836l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.994-4.706 2.602-7.184.121-.494-.263-.96-.772-.96H6.272M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
    </svg>
  );
}
function MinusIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] as const } },
  exit: { opacity: 0, height: 0, marginBottom: 0, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function CartPage() {
  const router = useRouter();
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
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
          Your Cart
        </h1>

        <div className="mt-10 flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-zinc-50/40 px-6 py-16 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-zinc-400 ring-1 ring-zinc-200">
            <CartIcon />
          </div>
          <h2 className="text-sm font-semibold text-zinc-900">Your cart is empty</h2>
          <p className="mt-1 max-w-sm text-sm text-zinc-500">
            Items you add to your cart will show up here.
          </p>
          <button
            type="button"
            onClick={() => router.push("/products")}
            className="mt-5 inline-flex h-10 items-center justify-center rounded-lg bg-zinc-900 px-5 text-sm font-medium text-white transition-colors duration-150 hover:bg-zinc-800"
          >
            Continue shopping
          </button>
        </div>
      </main>
    );
  }

  const totalPrice = cart.cartItems.reduce(
    (total, item) => total + item.quantity * Number(item.product.price),
    0,
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
          Your Cart
        </h1>
        <button
          type="button"
          onClick={handleClearCart}
          disabled={loading}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors duration-150 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Clear Cart
        </button>
      </div>

      {error && (
        <p className="mt-4 flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
          <AlertIcon />
          {error}
        </p>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          <AnimatePresence initial={false}>
            {cart.cartItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial="hidden"
                animate="show"
                exit="exit"
                variants={itemVariants}
                className="flex flex-col gap-4 overflow-hidden rounded-xl border border-zinc-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                {/* Product Info */}
                <div className="min-w-0">
                  <h2 className="font-semibold text-zinc-900">{item.product.name}</h2>
                  <p className="mt-1 text-sm text-zinc-500">
                    ${Number(item.product.price).toFixed(2)}
                  </p>
                  {item.variant && (
                    <div className="mt-1.5 flex flex-wrap gap-x-3 text-sm text-zinc-500">
                      {item.variant.size && <span>Size: {item.variant.size}</span>}
                      {item.variant.color && <span>Color: {item.variant.color}</span>}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between gap-6 sm:justify-end">
                  {/* Quantity */}
                  <div className="inline-flex h-9 items-stretch overflow-hidden rounded-lg border border-zinc-300">
                    <button
                      type="button"
                      disabled={loading || item.quantity <= 1}
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="flex w-8 items-center justify-center text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Decrease quantity"
                    >
                      <MinusIcon />
                    </button>
                    <span className="flex w-9 items-center justify-center border-x border-zinc-300 text-sm text-zinc-900">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="flex w-8 items-center justify-center text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Increase quantity"
                    >
                      <PlusIcon />
                    </button>
                  </div>

                  {/* Item Total */}
                  <p className="w-16 shrink-0 text-right font-semibold text-zinc-900">
                    ${(Number(item.product.price) * item.quantity).toFixed(2)}
                  </p>

                  {/* Remove */}
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-sm font-medium text-red-500 transition-colors hover:text-red-600 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-zinc-200 bg-white p-6 lg:sticky lg:top-6">
            <h2 className="text-base font-semibold text-zinc-900">Cart Summary</h2>
            <div className="mt-4 flex justify-between text-sm">
              <span className="text-zinc-500">Total</span>
              <span className="font-semibold text-zinc-900">${totalPrice.toFixed(2)}</span>
            </div>
            <button
              type="button"
              onClick={() => router.push("/checkout")}
              className="mt-6 w-full rounded-lg bg-zinc-900 px-6 py-3 font-medium text-white transition-colors duration-150 hover:bg-zinc-800"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}