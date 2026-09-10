import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Order } from "./order.types";

interface OrderState {
  orders: Order[];
  selectedOrder: Order | null;
  isLoading: boolean;
}

const initialState: OrderState = {
  orders:[],
  selectedOrder: null,
  isLoading: false,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    // set all orders
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
    },

    // add newly created order
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.push(action.payload);
    },

    //set single selected order
    setSelectedOrder: (state, action: PayloadAction<Order>) => {
      state.selectedOrder = action.payload;
    },

    // update loading state

    setOrderLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // clear selected order
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    },

    // clear all order state

    clearOrders: (state) => {
      ((state.orders = []), (state.selectedOrder = null));
    },
  },
});

export const {
  addOrder,
  clearOrders,
  clearSelectedOrder,
  setOrderLoading,
  setOrders,
  setSelectedOrder,
} = orderSlice.actions;
export default orderSlice.reducer;
