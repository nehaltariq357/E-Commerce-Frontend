import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { Category } from "./category.types";

interface CategoryState {
  categories: Category[];
}

const initialState: CategoryState = {
  categories: [],
};

const categorySlice = createSlice({
  name: "category",

  initialState,

  reducers: {
    // set all categories
    setCategories: (
      state,
      action: PayloadAction<Category[]>
    ) => {
      state.categories = action.payload;
    },

    // add new category
    addCategory: (
      state,
      action: PayloadAction<Category>
    ) => {
      state.categories.push(action.payload);
    },

    // update category
    updateCategory: (
      state,
      action: PayloadAction<Category>
    ) => {
      const index = state.categories.findIndex(
        (category) =>
          category.id === action.payload.id
      );

      if (index !== -1) {
        state.categories[index] = action.payload;
      }
    },

    // delete category
    removeCategory: (
      state,
      action: PayloadAction<number>
    ) => {
      state.categories = state.categories.filter(
        (category) =>
          category.id !== action.payload
      );
    },
  },
});

export const {
  setCategories,
  addCategory,
  updateCategory,
  removeCategory,
} = categorySlice.actions;

export default categorySlice.reducer;