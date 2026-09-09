
"use client";

import { useEffect, useState } from "react";

import type {
  Address,
CreatedAddressInput,
UpdatedAddressInput
} from "../../features/address/address.types";

interface AddressFormProps {
  address?: Address | null;
  onSubmit: (
    data: CreatedAddressInput | UpdatedAddressInput
  ) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

interface FormState {
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

const emptyForm: FormState = {
  fullName: "",
  phone: "",
  addressLine: "",
  city: "",
  state: "",
  postalCode: "",
  country: "Pakistan",
  isDefault: false,
};

export const AddressForm = ({
  address,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: AddressFormProps) =>{
  const [form, setForm] =
    useState<FormState>(emptyForm);

  const [error, setError] = useState("");


  useEffect(() => {
    if (address) {
      setForm({
        fullName: address.fullName,
        phone: address.phone,
        addressLine: address.addressLine,
        city: address.city,
        state: address.state ?? "",
        postalCode: address.postalCode,
        country: address.country,
        isDefault: address.isDefault,
      });
    } else {
      setForm(emptyForm);
    }
  }, [address]);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };


  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");

    try {
      const data: CreatedAddressInput = {
        fullName: form.fullName,
        phone: form.phone,
        addressLine: form.addressLine,
        city: form.city,
        state: form.state || undefined,
        postalCode: form.postalCode,
        country: form.country,
        isDefault: form.isDefault,
      };

      await onSubmit(data);

    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    }
  };


  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-lg border p-6"
    >
      <h2 className="text-xl font-semibold">
        {address
          ? "Edit Address"
          : "Add New Address"}
      </h2>


      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}


      <div>
        <label
          htmlFor="fullName"
          className="mb-1 block text-sm font-medium"
        >
          Full Name
        </label>

        <input
          id="fullName"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          required
          className="w-full rounded-md border px-3 py-2"
        />
      </div>


      <div>
        <label
          htmlFor="phone"
          className="mb-1 block text-sm font-medium"
        >
          Phone
        </label>

        <input
          id="phone"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
          className="w-full rounded-md border px-3 py-2"
        />
      </div>


      <div>
        <label
          htmlFor="addressLine"
          className="mb-1 block text-sm font-medium"
        >
          Address
        </label>

        <input
          id="addressLine"
          name="addressLine"
          value={form.addressLine}
          onChange={handleChange}
          required
          className="w-full rounded-md border px-3 py-2"
        />
      </div>


      <div>
        <label
          htmlFor="city"
          className="mb-1 block text-sm font-medium"
        >
          City
        </label>

        <input
          id="city"
          name="city"
          value={form.city}
          onChange={handleChange}
          required
          className="w-full rounded-md border px-3 py-2"
        />
      </div>


      <div>
        <label
          htmlFor="state"
          className="mb-1 block text-sm font-medium"
        >
          State / Province
        </label>

        <input
          id="state"
          name="state"
          value={form.state}
          onChange={handleChange}
          className="w-full rounded-md border px-3 py-2"
        />
      </div>


      <div>
        <label
          htmlFor="postalCode"
          className="mb-1 block text-sm font-medium"
        >
          Postal Code
        </label>

        <input
          id="postalCode"
          name="postalCode"
          value={form.postalCode}
          onChange={handleChange}
          required
          className="w-full rounded-md border px-3 py-2"
        />
      </div>


      <div>
        <label
          htmlFor="country"
          className="mb-1 block text-sm font-medium"
        >
          Country
        </label>

        <input
          id="country"
          name="country"
          value={form.country}
          onChange={handleChange}
          required
          className="w-full rounded-md border px-3 py-2"
        />
      </div>


      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="isDefault"
          checked={form.isDefault}
          onChange={handleChange}
        />

        <span className="text-sm">
          Make this my default address
        </span>
      </label>


      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-black px-5 py-2 text-white disabled:opacity-50"
        >
          {isSubmitting
            ? "Saving..."
            : address
              ? "Update Address"
              : "Add Address"}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border px-5 py-2"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

