"use client";
import { AddressCard } from "../../components/address/AddressCard";
import { AddressForm } from "../../components/address/AddressForm";
import {
  createAddress,
  updateAddress,
  deleteAddress,
} from "../../features/address/address.api";
import {
  addAddressState,
  updateAddressState,
  removeAddressState,
} from "../../features/address/addressSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  Address,
  CreatedAddressInput,
  UpdatedAddressInput,
} from "../../features/address/address.types";
import { useState } from "react";

export const AddressPage = () => {
  const dispatch = useAppDispatch();
  const addresses = useAppSelector((state) => state.address.addresses);
  const isLoading = useAppSelector((state) => state.address.isLoading);

  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // create / update

  const handleSubmit = async (
    data: CreatedAddressInput | UpdatedAddressInput,
  ) => {
    try {
      setIsSubmitting(true);
      if (editingAddress) {
        // update existing address
        const response = await updateAddress(editingAddress.id, data);

        // *******]

        dispatch(updateAddressState(response.data));
      } else {
        // create new address
        const response = await createAddress(data as CreatedAddressInput);
        dispatch(addAddressState(response.data));
      }
      setShowForm(false);
      setEditingAddress(null);
    } catch (error) {
      console.error("failed to save address:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // edit address
  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  // delete
  const handleDelete = async (addressId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this address?",
    );
    if (!confirmed) return;
    try {
      await deleteAddress(addressId);
      dispatch(removeAddressState(addressId));
    } catch (error) {
      console.error("Failed to delete address:", error);
    }
  };

  // set default
  const handleSetDefault = async (addressId: number) => {
    try {
      /* * Backend automatically makes the * previous default address false. */ await updateAddress(
        addressId,
        { isDefault: true },
      ); /* * Fetching all addresses again would be * the safest approach because another * address also changed. * * We'll handle that in the next * improvement. */
    } catch (error) {
      console.error("Failed to set default address:", error);
    }
  };

  // cancel
  const handleCancel = () => {
    setShowForm(false);
    setEditingAddress(null);
  };

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      {" "}
      <div className="mb-8 flex items-center justify-between">
        {" "}
        <div>
          {" "}
          <h1 className="text-3xl font-bold"> My Addresses </h1>{" "}
          <p className="mt-1 text-gray-600">
            {" "}
            Manage your delivery addresses.{" "}
          </p>{" "}
        </div>{" "}
        <button
          type="button"
          onClick={() => {
            setEditingAddress(null);
            setShowForm(true);
          }}
          className="rounded-md bg-black px-5 py-2 text-white"
        >
          {" "}
          Add Address{" "}
        </button>{" "}
      </div>{" "}
      {showForm && (
        <div className="mb-8">
          {" "}
          <AddressForm
            address={editingAddress}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />{" "}
        </div>
      )}{" "}
      {isLoading ? (
        <p>Loading addresses...</p>
      ) : addresses.length === 0 ? (
        <div className="rounded-lg border p-8 text-center">
          {" "}
          <p className="text-gray-600">
            {" "}
            You don't have any addresses yet.{" "}
          </p>{" "}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {" "}
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSetDefault={handleSetDefault}
            />
          ))}{" "}
        </div>
      )}{" "}
    </main>
  );
};
