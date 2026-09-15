"use client";

import { useState } from "react";

import type {
  ProductVariant,
  ProductVariantInput,
} from "../../components/product/product.type";

interface VariantFormProps {
  productId: number;
  editingVariant: ProductVariant | null;
  onSubmit: (data: ProductVariantInput) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

function SpinnerIcon() {
  return (
    <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

const inputClasses =
  "block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors duration-150 focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:text-zinc-500";

const labelClasses = "mb-1.5 block text-sm font-medium text-zinc-700";

export default function VariantForm({
  productId,
  editingVariant,
  onSubmit,
  onCancel,
  isSubmitting,
}: VariantFormProps) {
  const [size, setSize] = useState(
    editingVariant?.size ?? ""
  );

  const [color, setColor] = useState(
    editingVariant?.color ?? ""
  );

  const [stock, setStock] = useState(
    editingVariant?.stock.toString() ?? "0"
  );

  const [sku, setSku] = useState(
    editingVariant?.sku ?? ""
  );

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const data: ProductVariantInput = {
      productId,
      size: size || undefined,
      color: color || undefined,
      stock: Number(stock),
      sku,
    };

    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-zinc-900">
        {editingVariant ? "Edit Variant" : "Add Variant"}
      </h3>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Size */}
        <div>
          <label className={labelClasses} htmlFor="variant-size">
            Size
          </label>

          <input
            id="variant-size"
            type="text"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            placeholder="e.g. M, L, XL"
            disabled={isSubmitting}
            className={inputClasses}
          />
        </div>

        {/* Color */}
        <div>
          <label className={labelClasses} htmlFor="variant-color">
            Color
          </label>

          <input
            id="variant-color"
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="e.g. Black"
            disabled={isSubmitting}
            className={inputClasses}
          />
        </div>

        {/* Stock */}
        <div>
          <label className={labelClasses} htmlFor="variant-stock">
            Stock
          </label>

          <input
            id="variant-stock"
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            min="0"
            required
            disabled={isSubmitting}
            className={inputClasses}
          />
        </div>

        {/* SKU */}
        <div>
          <label className={labelClasses} htmlFor="variant-sku">
            SKU
          </label>

          <input
            id="variant-sku"
            type="text"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            placeholder="e.g. TSHIRT-BLK-M"
            required
            disabled={isSubmitting}
            className={inputClasses}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-5 flex items-center gap-2 border-t border-zinc-100 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white transition-colors duration-150 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2"
        >
          {isSubmitting && <SpinnerIcon />}
          {isSubmitting
            ? "Saving..."
            : editingVariant
              ? "Update Variant"
              : "Add Variant"}
        </button>

        {editingVariant && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="inline-flex h-9 items-center justify-center rounded-lg border border-zinc-300 px-4 text-sm font-medium text-zinc-700 transition-colors duration-150 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}