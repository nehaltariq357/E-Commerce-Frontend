import { api } from "../../lib/api";

import {
  AddToCartInput,
  Cart,
  CartItem,
  UpdateCartItemInput,
} from "./cart.types";
interface CartResponse {
  success: boolean;
  message: string;
  data: Cart;
}
interface CartItemResponse {
  success: boolean;
  message: string;
  data: CartItem;
}
interface MessageResponse {
  success: boolean;
  message: string;
}

// add product to cart

export const addToCart = async (data: AddToCartInput) => {
  return api<CartItemResponse>(`/cart/items`, {
    method: "POST",
    body: data,
  });
};

//update cart item quantity

export const updateCartItem = async (
  cartItemId: number,
  data: UpdateCartItemInput,
) => {
  return api<CartItemResponse>(`/cart/items/${cartItemId}`, {
    method: "PUT",
    body: data,
  });
};

// remove cart item

export const removeCartItem = async (cartItemId: number) => {
  return api<MessageResponse>(`/cart/items/${cartItemId}`, {
    method: "DELETE",
  });
};

//clear cart

export const clearCart = async () => {
  return api<MessageResponse>(`/cart`, {
    method: "DELETE",
  });
};
