"use client";

import type { Product } from "../../components/product/product.type";

interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (productId: number) => Promise<void>;
  onManageVariants: (product: Product) => void;
}

export default function ProductTable({
  products,
  isLoading,
  onEdit,
  onDelete,
  onManageVariants,
}: ProductTableProps) {
  if (isLoading) {
    return <p>Loading products...</p>;
  }

  if (products.length === 0) {
    return <p>No products found.</p>;
  }

  return (
    <div>
      <h2>Products</h2>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Slug</th>
            <th>Price</th>
            <th>Category</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>

              <td>{product.name}</td>

              <td>{product.slug}</td>

              <td>{product.price}</td>

              <td>
                {product.category?.name ?? "No Category"}
              </td>

              <td>
                {product.isActive
                  ? "Active"
                  : "Inactive"}
              </td>

              <td>
                <button
                  type="button"
                  onClick={() => onEdit(product)}
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onDelete(product.id)
                  }
                >
                  Delete
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onManageVariants(product)
                  }
                >
                  Manage Variants
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}