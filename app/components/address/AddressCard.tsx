"use client";
import type { Address } from "../../features/address/address.types";

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (addressId: number) => void;
  onSetDefault: (addressId: number) => void;
}

export const AddressCard = ({
  address,
  onDelete,
  onEdit,
  onSetDefault,
}: AddressCardProps) => {
  return (
    <div className="rounded-lg border p-5">
      {" "}
      <div className="flex items-start justify-between gap-4">
        {" "}
        <div>
          {" "}
          <h3 className="font-semibold"> {address.fullName} </h3>{" "}
          <p className="text-sm text-gray-600"> {address.phone} </p>{" "}
        </div>{" "}
        {address.isDefault && (
          <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
            {" "}
            Default{" "}
          </span>
        )}{" "}
      </div>{" "}
      <div className="mt-4 text-sm text-gray-700">
        {" "}
        <p>{address.addressLine}</p>{" "}
        <p>
          {" "}
          {address.city} {address.state ? `, ${address.state}` : ""}{" "}
        </p>{" "}
        <p>
          {" "}
          {address.postalCode}, {address.country}{" "}
        </p>{" "}
      </div>{" "}
      <div className="mt-5 flex flex-wrap gap-2">
        {" "}
        <button
          type="button"
          onClick={() => onEdit(address)}
          className="rounded-md border px-4 py-2 text-sm"
        >
          {" "}
          Edit{" "}
        </button>{" "}
        <button
          type="button"
          onClick={() => onDelete(address.id)}
          className="rounded-md border px-4 py-2 text-sm text-red-600"
        >
          {" "}
          Delete{" "}
        </button>{" "}
        {!address.isDefault && (
          <button
            type="button"
            onClick={() => onSetDefault(address.id)}
            className="rounded-md bg-black px-4 py-2 text-sm text-white"
          >
            {" "}
            Set Default{" "}
          </button>
        )}{" "}
      </div>{" "}
    </div>
  );
};
