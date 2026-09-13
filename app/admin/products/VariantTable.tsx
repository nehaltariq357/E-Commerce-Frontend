"use client";

import type { ProductVariant } from "../../components/product/product.type";

interface VariantTableProps {
  variants: ProductVariant[];
  isLoading: boolean;
  onEdit: (variant: ProductVariant) => void;
  onDelete: (variantId: number) => Promise<void>;
}


export default function VariantTable({
  variants,
  isLoading,
  onEdit,
  onDelete,
}: VariantTableProps) {
  if (isLoading) {
    return <p>Loading variants...</p>;
  }

  if (variants.length === 0) {
    return <p>No variants found.</p>;
  }

  return (
    <div>
      <h3>Product Variants</h3>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Size</th>
            <th>Color</th>
            <th>Stock</th>
            <th>SKU</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {variants.map((variant) => (
            <tr key={variant.id}>
              <td>{variant.id}</td>

              <td>
                {variant.size ?? "N/A"}
              </td>

              <td>
                {variant.color ?? "N/A"}
              </td>

              <td>{variant.stock}</td>

              <td>{variant.sku}</td>

              <td>
                <button
                  type="button"
                  onClick={() =>
                    onEdit(variant)
                  }
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onDelete(variant.id)
                  }
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}