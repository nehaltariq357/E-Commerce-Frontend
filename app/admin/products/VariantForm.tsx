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
    <form onSubmit={handleSubmit}>
      <h3>
        {editingVariant
          ? "Edit Variant"
          : "Add Variant"}
      </h3>

      {/* Size */}

      <div>
        <label>Size</label>

        <input
          type="text"
          value={size}
          onChange={(e) =>
            setSize(e.target.value)
          }
          placeholder="e.g. M, L, XL"
        />
      </div>

      {/* Color */}

      <div>
        <label>Color</label>

        <input
          type="text"
          value={color}
          onChange={(e) =>
            setColor(e.target.value)
          }
          placeholder="e.g. Black"
        />
      </div>

      {/* Stock */}

      <div>
        <label>Stock</label>

        <input
          type="number"
          value={stock}
          onChange={(e) =>
            setStock(e.target.value)
          }
          min="0"
          required
        />
      </div>

      {/* SKU */}

      <div>
        <label>SKU</label>

        <input
          type="text"
          value={sku}
          onChange={(e) =>
            setSku(e.target.value)
          }
          placeholder="e.g. TSHIRT-BLK-M"
          required
        />
      </div>

      {/* Buttons */}

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
        >
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
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}