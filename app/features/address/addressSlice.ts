import { createSlice } from "@reduxjs/toolkit";
import { Address } from "./address.types";
import { PayloadAction } from "@reduxjs/toolkit";

interface AddressState {
  addresses: Address[];
  isLoading: boolean;
}

const initialState: AddressState = {
  addresses: [],
  isLoading: false,
};

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    // set all addresses
    setAddresses: (state, action: PayloadAction<Address[]>) => {
      state.addresses = action.payload;
    },
    // set address loading
    setAddressLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    // add newly created address

    addAddressState: (state, action: PayloadAction<Address>) => {
      state.addresses.push(action.payload);
    },

    // update existing address
    updateAddressState: (state, action: PayloadAction<Address>) => {
      const i = state.addresses.findIndex(
        (address) => address.id === action.payload.id,
      );

      if (i !== -1) {
        state.addresses[i] = action.payload;
      }
    },
    // remove address
    removeAddressState: (state, action: PayloadAction<number>) => {
      state.addresses = state.addresses.filter(
        (address) => address.id !== action.payload,
      );
    },

    // clear all address
    clearAddressState: (state) => {
      state.addresses = [];
    },
  },
});

export const {
  addAddressState,
  clearAddressState,
  removeAddressState,
  setAddressLoading,
  setAddresses,
  updateAddressState,
} = addressSlice.actions;
export default addressSlice.reducer;
