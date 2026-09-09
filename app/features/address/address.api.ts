import {
  Address,
  CreatedAddressInput,
  UpdatedAddressInput,
} from "./address.types";
import { api } from "../../lib/api";

interface AddressesResponse {
  success: boolean;
  message: string;
  data: Address[];
}
interface AddressResponse {
  success: boolean;
  message: string;
  data: Address;
}
interface MessageResponse {
  success: boolean;
  message: string;
}
// get all address of a user logged in
export const getAddress = async () => {
  return api<AddressesResponse>("/addresses");
};

// get single address
export const getAddressById = async (addressId: number) => {
  return api<AddressResponse>(`/addresses/${addressId}`);
};

// create address

export const createAddress = async (data: CreatedAddressInput) => {
  return api<AddressResponse>(`/addresses`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// update address

export const updateAddress = async (
  addressId: number,
  data: UpdatedAddressInput,
) => {
  return api<AddressResponse>(`/addresses/${addressId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// delete address

export const deleteAddress = async (addressId: number) => {
  return api<MessageResponse>(`/addresses/${addressId}`, {
    method: "DELETE",
  });
};
