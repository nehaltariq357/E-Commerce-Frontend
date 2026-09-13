
"use client";

import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "../../store/hooks";

import {
  createAddress,
  deleteAddress,
  getAddress,
  updateAddress,
} from "../../features/address/address.api";

import {
  setAddresses,
  updateAddressState,
  removeAddressState,
} from "../../features/address/addressSlice";

import type {
  Address,
  CreatedAddressInput,
  UpdatedAddressInput,
} from "../../features/address/address.types";

import { AddressCard } from "./AddressCard";
import { AddressForm } from "./AddressForm";

export const AddressManagement = () => {
  const dispatch = useAppDispatch();

  const addresses = useAppSelector(
    (state) => state.address.addresses
  );

  const [showForm, setShowForm] = useState(false);

  const [editingAddress, setEditingAddress] =
    useState<Address | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get all addresses
  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const response = await getAddress();

        dispatch(setAddresses(response.data));
      } catch (error) {
        console.error("Failed to load addresses:", error);
      }
    };

    loadAddresses();
  }, [dispatch]);

  // Create / Update address
  const handleSubmit = async (
    data: CreatedAddressInput | UpdatedAddressInput
  ) => {
    try {
      setIsSubmitting(true);

      if (editingAddress) {
        // Update
        const response = await updateAddress(
          editingAddress.id,
          data as UpdatedAddressInput
        );

        dispatch(updateAddressState(response.data));
      } else {
        // Create
        await createAddress(
          data as CreatedAddressInput
        );

        // Refresh addresses
        const response = await getAddress();

        dispatch(setAddresses(response.data));
      }

      setShowForm(false);
      setEditingAddress(null);
    } catch (error) {
      console.error("Failed to save address:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit address
  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  // Delete address
  const handleDelete = async (addressId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (!confirmed) return;

    try {
      await deleteAddress(addressId);

      dispatch(removeAddressState(addressId));
    } catch (error) {
      console.error("Failed to delete address:", error);
    }
  };

  // Set default address
  const handleSetDefault = async (addressId: number) => {
    try {
      const response = await updateAddress(
        addressId,
        { isDefault: true }
      );

      // Refresh all addresses because
      // previous default address also changes
      const addressesResponse = await getAddress();

      dispatch(setAddresses(addressesResponse.data));

      console.log("Default address:", response.data);
    } catch (error) {
      console.error(
        "Failed to set default address:",
        error
      );
    }
  };

  // Cancel form
  const handleCancel = () => {
    setShowForm(false);
    setEditingAddress(null);
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            My Addresses
          </h1>

          <p className="mt-1 text-gray-600">
            Manage your delivery addresses.
          </p>
        </div>

        {!showForm && (
          <button
            type="button"
            onClick={() => {
              setEditingAddress(null);
              setShowForm(true);
            }}
            className="rounded-md bg-black px-5 py-3 text-white"
          >
            Add Address
          </button>
        )}
      </div>

      {/* Address Form */}
      {showForm && (
        <div className="mb-8">
          <AddressForm
            address={editingAddress}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        </div>
      )}

      {/* Address List */}
      {addresses.length === 0 && !showForm ? (
        <div className="rounded-lg border p-8 text-center">
          <p className="text-gray-600">
            You don't have any saved addresses.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSetDefault={handleSetDefault}
            />
          ))}
        </div>
      )}
    </div>
  );
};

