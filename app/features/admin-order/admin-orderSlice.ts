import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AdminOrder } from "./admin-order.types";

interface AdminOrderState {
  orders: AdminOrder[];
  selectedOrder: AdminOrder | null;
  isLoading: boolean;
}

const initialState: AdminOrderState = {
  orders: [],
  selectedOrder: null,
  isLoading: false,
};

const adminOrderSlice = createSlice({
  name: "adminOrder",
  initialState,
  reducers: {
    // set all admin orders

    setAdminOrders: (state, action: PayloadAction<AdminOrder[]>) => {
      state.orders = action.payload;
    },

    // add new order

    addAdminOrder: (state, action: PayloadAction<AdminOrder>) => {
      state.orders.push(action.payload);
    },

    // set selected/single order

    setSelectedAdminOrder: (state, action: PayloadAction<AdminOrder>) => {
      state.selectedOrder = action.payload;
    },

    // update order inside orders list

    updateAdminOrderState: (state, action: PayloadAction<AdminOrder>) => {
      const i = state.orders.findIndex(
        (order) => order.id === action.payload.id,
      );
      if (i !== -1) {
        state.orders[i] = action.payload;
      }
    },

    // set admin order loading

    setAdminOrderLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    //clear selected order

    clearSelectedAdminOrder: (state) => {
      state.selectedOrder = null;
    },

    // clear everything

    clearAdminOrders: (state) => {
      ((state.orders = []), (state.selectedOrder = null));
    },
  },
});


export const {
  addAdminOrder,
  clearAdminOrders,
  clearSelectedAdminOrder,
  setAdminOrderLoading,
  setAdminOrders,
  setSelectedAdminOrder,
  updateAdminOrderState,
} = adminOrderSlice.actions;

export default adminOrderSlice.reducer;