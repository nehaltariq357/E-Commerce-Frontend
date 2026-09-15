"use client";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { useRouter } from "next/navigation";
import { createOrder } from "../features/order/order.api";
import { addOrder } from "../features/order/orderSlice";
import { clearCartState } from "../features/cart/cartSlice";
import { getAddress } from "../features/address/address.api";
import { setAddresses } from "../features/address/addressSlice";

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
function MapPinIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  );
}
function CheckCircleIcon({ className = "h-4 w-4 shrink-0" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
    </svg>
  );
}
function EmptyCartIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.87-4.694 2.226-7.152a1.1 1.1 0 00-1.088-1.257H5.386M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
    </svg>
  );
}
function LockIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  );
}
function PackageIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-8.25 4.5L3.75 7.5M20.25 7.5l-8.25-4.5L3.75 7.5M20.25 7.5v9l-8.25 4.5m-8.25-4.5v-9m8.25 13.5v-9" />
    </svg>
  );
}
function ReceiptIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 3h6m-7.5 6.75h9a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 004.5 6v13.5a2.25 2.25 0 002.25 2.25z" />
    </svg>
  );
}

function AddressCardSkeleton() {
  return (
    <div className="rounded-2xl border border-zinc-200 p-5">
      <div className="flex gap-4">
        <div className="mt-1 h-5 w-5 shrink-0 animate-pulse rounded-full bg-zinc-200" />
        <div className="flex-1 space-y-2.5">
          <div className="h-4 w-36 animate-pulse rounded bg-zinc-200" />
          <div className="h-3 w-24 animate-pulse rounded bg-zinc-100" />
          <div className="mt-3 h-3 w-full max-w-xs animate-pulse rounded bg-zinc-100" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-zinc-100" />
        </div>
      </div>
    </div>
  );
}

const checkoutSteps = ["Cart", "Delivery", "Review"];

export default function CheckoutPage() {
  const cart = useAppSelector((state) => state.cart.cart);
  const addresses = useAppSelector((state) => state.address.addresses);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);

  useEffect(() => {
    const loadAddresses = async () => {
      try {
        setIsLoadingAddresses(true);
        const response = await getAddress();
        dispatch(setAddresses(response.data));
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load addresses",
        );
      } finally {
        setIsLoadingAddresses(false);
      }
    };

    loadAddresses();
  }, [dispatch]);

  // set default address
  useEffect(() => {
    const defaultAddress = addresses.find((address) => address.isDefault);
    if (defaultAddress) {
      setSelectedAddressId(defaultAddress.id);
    } else if (addresses.length > 0) {
      setSelectedAddressId(addresses[0].id);
    } else {
      setSelectedAddressId(null);
    }
  }, [addresses]);

  // total
  const total =
    cart?.cartItems.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0,
    ) ?? 0;

  if (!cart || cart.cartItems.length === 0) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
          Checkout
        </h1>
        <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/40 px-6 py-20 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">
            <EmptyCartIcon />
          </div>
          <p className="text-sm font-medium text-zinc-700">Your cart is empty</p>
          <p className="mt-1 text-sm text-zinc-500">Add items to your cart before checking out.</p>
        </div>
      </main>
    );
  }

  // handle place order
  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      setError("Please select a delivery address");
      return;
    }

    try {
      setError("");
      setIsSubmitting(true);
      const response: any = await createOrder({ addressId: selectedAddressId });
      // add newly created order to redux

      dispatch(addOrder(response.data));

      // clear cart
      dispatch(clearCartState());

      // go to order page
      router.push(`/account/orders/${response.data.id}`);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to place order",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
          Checkout
        </h1>
        <p className="mt-1.5 text-sm text-zinc-500">Securely complete your order</p>

        <ol className="mt-5 flex items-center gap-2 text-xs font-medium text-zinc-400 sm:text-sm">
          {checkoutSteps.map((step, index) => (
            <li key={step} className="flex items-center gap-2">
              <span className={index === 1 ? "text-zinc-900" : ""}>{step}</span>
              {index < checkoutSteps.length - 1 && (
                <span className="text-zinc-300">&rarr;</span>
              )}
            </li>
          ))}
        </ol>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
        {/* Addresses */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="min-w-0"
        >
          <h2 className="mb-4 text-base font-semibold text-zinc-900">
            Delivery Address
          </h2>

          {isLoadingAddresses ? (
            <div className="space-y-3">
              <AddressCardSkeleton />
              <AddressCardSkeleton />
            </div>
          ) : addresses.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 px-6 py-14 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">
                <MapPinIcon />
              </div>
              <p className="text-sm font-medium text-zinc-700">No saved addresses</p>
              <p className="mt-1 max-w-xs text-sm text-zinc-500">
                You don&apos;t have any saved addresses yet. Add one to continue with delivery.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {addresses.map((address, index) => {
                const isSelected = selectedAddressId === address.id;

                return (
                  <motion.label
                    key={address.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: index * 0.05 }}
                    className={`relative block cursor-pointer rounded-2xl border p-5 transition-all duration-150 ${
                      isSelected
                        ? "border-zinc-900 bg-zinc-50/60 ring-1 ring-zinc-900"
                        : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/40"
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute right-4 top-4 text-zinc-900">
                        <CheckCircleIcon className="h-5 w-5" />
                      </span>
                    )}

                    <div className="flex gap-3.5 pr-6">
                      <span className="relative mt-1 flex h-4.5 w-4.5 shrink-0 items-center justify-center">
                        <input
                          type="radio"
                          name="address"
                          value={address.id}
                          checked={isSelected}
                          onChange={() => setSelectedAddressId(address.id)}
                          className="peer sr-only"
                        />
                        <span
                          aria-hidden="true"
                          className={`h-4.5 w-4.5 rounded-full border transition-colors duration-150 ${
                            isSelected
                              ? "border-zinc-900 bg-zinc-900"
                              : "border-zinc-300 bg-white peer-focus-visible:ring-2 peer-focus-visible:ring-zinc-400 peer-focus-visible:ring-offset-2"
                          }`}
                        />
                        {isSelected && (
                          <span
                            aria-hidden="true"
                            className="absolute h-1.5 w-1.5 rounded-full bg-white"
                          />
                        )}
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-zinc-900">{address.fullName}</p>
                          {address.isDefault && (
                            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-zinc-500">{address.phone}</p>
                        <p className="mt-2 text-sm leading-relaxed text-zinc-700">
                          {address.addressLine}
                          <br />
                          {address.city}
                          {address.state ? `, ${address.state}` : ""} {address.postalCode}
                          <br />
                          {address.country}
                        </p>
                      </div>
                    </div>
                  </motion.label>
                );
              })}
            </div>
          )}
        </motion.section>

        {/* Order Summary */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="lg:sticky lg:top-10"
        >
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-base font-semibold text-zinc-900">Order Summary</h2>

            <div className="mt-4 max-h-64 space-y-4 overflow-y-auto pr-1">
              {cart.cartItems.map((item) => (
                <div key={item.id} className="flex justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-zinc-900">{item.product.name}</p>
                    <p className="text-sm text-zinc-500">Qty {item.quantity}</p>
                  </div>
                  <p className="shrink-0 font-medium text-zinc-900">
                    ${(Number(item.product.price) * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="my-5 border-t border-zinc-100" />

            <div className="space-y-2">
              <div className="flex justify-between text-sm text-zinc-500">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-zinc-100 pt-3 text-lg font-semibold text-zinc-900">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-1.5 overflow-hidden rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
                >
                  <AlertIcon />
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              type="button"
              onClick={handlePlaceOrder}
              disabled={selectedAddressId === null || isSubmitting}
              whileHover={selectedAddressId !== null && !isSubmitting ? { scale: 1.01 } : undefined}
              whileTap={selectedAddressId !== null && !isSubmitting ? { scale: 0.98 } : undefined}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 py-3.5 font-medium text-white transition-colors duration-150 hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting && <SpinnerIcon />}
              {isSubmitting ? "Placing order..." : "Place Order"}
            </motion.button>

            <div className="mt-5 space-y-2 border-t border-zinc-100 pt-4">
              <p className="flex items-center gap-2 text-xs text-zinc-500">
                <LockIcon />
                Secure checkout
              </p>
              <p className="flex items-center gap-2 text-xs text-zinc-500">
                <ReceiptIcon />
                Order confirmation sent after purchase
              </p>
              <p className="flex items-center gap-2 text-xs text-zinc-500">
                <PackageIcon />
                Orders are processed promptly
              </p>
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
}