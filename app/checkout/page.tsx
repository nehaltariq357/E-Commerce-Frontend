"use client";
import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import {useRouter} from "next/navigation"
import{createOrder} from "../features/order/order.api"
import {addOrder} from "../features/order/orderSlice"
import {clearCartState} from "../features/cart/cartSlice"

export const CheckoutPage = () => {
  const cart = useAppSelector((state) => state.cart.cart);
  const addresses = useAppSelector((state) => state.address.addresses);
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // default address
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);

  useEffect(() => {
    const defaultAddress = addresses.find((address)=>address.isDefault)
    if(defaultAddress){
        setSelectedAddressId(defaultAddress.id)
    }else if(addresses.length > 0){
        setSelectedAddressId(addresses[0].id)
    }else{
        setSelectedAddressId(null)
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
      <main className="mx-auto max-w-5xl px-6 py-10">
        {" "}
        <h1 className="text-3xl font-bold"> Checkout </h1>{" "}
        <p className="mt-4 text-gray-600"> Your cart is empty. </p>{" "}
      </main>
    );
  }

  // handle place order
  const handlePlaceOrder = async () => {
        if(!selectedAddressId){
            setError("Please select a delivery address")
            return
        }

        try{
            setError("")
            setIsSubmitting(true)
            const response:any = await createOrder({addressId:selectedAddressId})
            // add newly created order to redux
           ;
            dispatch(addOrder(response.data))

            // clear cart
            dispatch(clearCartState())

            // go to order page
            router.push(`/orders/${response.data.id}`)
        }catch(error){
            setError(
                error instanceof Error ? error.message : "Failed to place order",
            )
        }finally{
            setIsSubmitting(false)
        }
  }
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      {" "}
      <h1 className="mb-8 text-3xl font-bold"> Checkout </h1>{" "}
      <div className="grid gap-8 md:grid-cols-2">
        {" "}
        {/* Addresses */}{" "}
        <section>
          {" "}
          <h2 className="mb-4 text-xl font-semibold">
            {" "}
            Delivery Address{" "}
          </h2>{" "}
          {addresses.length === 0 ? (
            <p className="text-gray-600">
              {" "}
              You don't have any saved addresses.{" "}
            </p>
          ) : (
            <div className="space-y-4">
              {" "}
              {addresses.map((address) => (
                <label
                  key={address.id}
                  className={`block cursor-pointer rounded-lg border p-5 ${selectedAddressId === address.id ? "border-black" : "border-gray-200"}`}
                >
                  {" "}
                  <div className="flex gap-3">
                    {" "}
                    <input
                      type="radio"
                      name="address"
                      value={address.id}
                      checked={selectedAddressId === address.id}
                      onChange={() => setSelectedAddressId(address.id)}
                    />{" "}
                    <div>
                      {" "}
                      <p className="font-semibold"> {address.fullName} </p>{" "}
                      <p className="text-sm text-gray-600"> {address.phone} </p>{" "}
                      <p className="mt-2 text-sm"> {address.addressLine} </p>{" "}
                      <p className="text-sm">
                        {" "}
                        {address.city}{" "}
                        {address.state ? `, ${address.state}` : ""}{" "}
                      </p>{" "}
                      <p className="text-sm">
                        {" "}
                        {address.postalCode}, {address.country}{" "}
                      </p>{" "}
                      {address.isDefault && (
                        <span className="mt-2 inline-block rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                          {" "}
                          Default{" "}
                        </span>
                      )}{" "}
                    </div>{" "}
                  </div>{" "}
                </label>
              ))}{" "}
            </div>
          )}{" "}
        </section>{" "}
        {/* Order Summary */}{" "}
        <section>
          {" "}
          <h2 className="mb-4 text-xl font-semibold"> Order Summary </h2>{" "}
          <div className="rounded-lg border p-5">
            {" "}
            <div className="space-y-4">
              {" "}
              {cart.cartItems.map((item) => (
                <div key={item.id} className="flex justify-between gap-4">
                  {" "}
                  <div>
                    {" "}
                    <p className="font-medium"> {item.product.name} </p>{" "}
                    <p className="text-sm text-gray-500">
                      {" "}
                      Quantity: {item.quantity}{" "}
                    </p>{" "}
                  </div>{" "}
                  <p className="font-medium">
                    {" "}
                    ${" "}
                    {(Number(item.product.price) * item.quantity).toFixed(
                      2,
                    )}{" "}
                  </p>{" "}
                </div>
              ))}{" "}
            </div>{" "}
            <div className="my-5 border-t" />{" "}
            <div className="flex justify-between text-lg font-bold">
              {" "}
              <span>Total</span> <span>${total.toFixed(2)}</span>{" "}
            </div>{" "}
            {error && <p className="mt-4 text-red-500">{error}</p>}{" "}
            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={selectedAddressId === null || isSubmitting} 
              className="mt-6 w-full rounded-md bg-black px-5 py-3 text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {" "}
              {isSubmitting ? "Placing order..." : "Place Order"}
            </button>{" "}
          </div>{" "}
        </section>{" "}
      </div>{" "}
    </main>
  );
};
