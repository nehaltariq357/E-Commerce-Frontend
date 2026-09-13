import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "./product.type";

interface ProductState {
  products: Product[];
}

const initialState: ProductState = {
  products: [],
};

const productSlice = createSlice({
  name: "product",

  initialState,

  reducers: {
    // set all products
    setProducts: (
      state,
      action: PayloadAction<Product[]>
    ) => {
      state.products = action.payload;
    },

    // add new product
    addProduct: (
      state,
      action: PayloadAction<Product>
    ) => {
      state.products.push(action.payload);
    },

    // update existing product
    updateProduct: (
      state,
      action: PayloadAction<Product>
    ) => {
      const index = state.products.findIndex(
        (product) =>
          product.id === action.payload.id
      );

      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },

    // remove product
    removeProduct: (
      state,
      action: PayloadAction<number>
    ) => {
      state.products = state.products.filter(
        (product) =>
          product.id !== action.payload
      );
    },
  },
});

export const {
  setProducts,
  addProduct,
  updateProduct,
  removeProduct,
} = productSlice.actions;

export default productSlice.reducer;