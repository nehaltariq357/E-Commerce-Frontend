import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { Cart, CartItem } from "./cart.types";

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
}

const initialState: CartState = {
  cart: null,
  isLoading: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // add product to cart
    setCart: (state, action: PayloadAction<Cart>) => {
      state.cart = action.payload;
    },

    // set cart loading
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // add product to cart
    addCartItem: (state, action: PayloadAction<CartItem>) => {
      if (!state.cart) return; // if cart is null, return
      state.cart.cartItems.push(action.payload);
    },

    // update cart items
    updateCartItemState: (state, action: PayloadAction<CartItem>) => {
      if (!state.cart) return;

      const index = state.cart.cartItems.findIndex(
        (item) => item.id === action.payload.id,
      );

      if (index !== -1) {
        state.cart.cartItems[index] = action.payload;
      }
    },

    // remove product from cart
    removeFromCart: (state, action: PayloadAction<number>) => {
      if (!state.cart) return;

      state.cart.cartItems = state.cart.cartItems.filter(
        (item) => item.id !== action.payload,
      );
    },
    // clear cart state

    clearCartState: (state) => {
      if (!state.cart) return;
      state.cart.cartItems = [];
    },
    // clear cart
    clearCart: (state) => {
      state.cart = null;
    },
  },
});

export const {
  addCartItem,
  clearCartState,
  removeFromCart,
  updateCartItemState,
  setLoading,
  clearCart,
  setCart
} = cartSlice.actions; // for components
export default cartSlice.reducer; // for store
