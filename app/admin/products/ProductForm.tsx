"use client";

import { useState } from "react";

import type {
  Product,
  ProductInput,
} from "../../components/product/product.type"

import type { Category } from "../../features/category/category.types";

interface ProductFormProps {
  editingProduct: Product | null;
  categories: Category[];
  onSubmit: (data: ProductInput) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function ProductForm({
  editingProduct,
  categories,
  onSubmit,
  onCancel,
  isSubmitting,
}: ProductFormProps) {
  const [name, setName] = useState(
    editingProduct?.name ?? ""
  );

  const [description, setDescription] = useState(
    editingProduct?.description ?? ""
  );

  const [slug, setSlug] = useState(
    editingProduct?.slug ?? ""
  );

  const [price, setPrice] = useState(
    editingProduct?.price ?? ""
  );

  const [categoryId, setCategoryId] = useState(
    editingProduct?.categoryId
      ? String(editingProduct.categoryId)
      : ""
  );

  const [isActive, setIsActive] = useState(
    editingProduct?.isActive ?? true
  );

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const data: ProductInput = {
      name,
      description,
      slug,
      price: Number(price),
      categoryId: categoryId
        ? Number(categoryId)
        : null,
      isActive,
    };

    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>
        {editingProduct
          ? "Edit Product"
          : "Add Product"}
      </h2>

      {/* Name */}

      <div>
        <label>Product Name</label>

        <input
          type="text"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          placeholder="Enter product name"
          required
        />
      </div>

      {/* Description */}

      <div>
        <label>Description</label>

        <textarea
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          placeholder="Enter product description"
          required
        />
      </div>

      {/* Slug */}

      <div>
        <label>Slug</label>

        <input
          type="text"
          value={slug}
          onChange={(e) =>
            setSlug(e.target.value)
          }
          placeholder="product-slug"
          required
        />
      </div>

      {/* Price */}

      <div>
        <label>Price</label>

        <input
          type="number"
          value={price}
          onChange={(e) =>
            setPrice(e.target.value)
          }
          placeholder="Enter price"
          min="0"
          step="0.01"
          required
        />
      </div>

      {/* Category */}

      <div>
        <label>Category</label>

        <select
          value={categoryId}
          onChange={(e) =>
            setCategoryId(e.target.value)
          }
        >
          <option value="">
            Select category
          </option>

          {categories.map((category) => (
            <option
              key={category.id}
              value={category.id}
            >
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Active */}

      <div>
        <label>
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) =>
              setIsActive(e.target.checked)
            }
          />

          Active
        </label>
      </div>

      {/* Buttons */}

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Saving..."
            : editingProduct
              ? "Update Product"
              : "Create Product"}
        </button>

        {editingProduct && (
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