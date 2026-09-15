"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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

const inputClass =
  "h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:text-zinc-400";

const labelClass = "mb-1.5 block text-sm font-medium text-zinc-800";

function SpinnerIcon() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  );
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

  // Keep the form in sync when `editingProduct` changes after mount —
  // e.g. switching from creating a new product to editing an existing
  // one, or from editing one product straight to another. useState's
  // initial value only applies on first render, so without this the
  // fields would keep showing whichever product was selected first.
  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setDescription(editingProduct.description ?? "");
      setSlug(editingProduct.slug);
      setPrice(editingProduct.price ?? "");
      setCategoryId(
        editingProduct.categoryId
          ? String(editingProduct.categoryId)
          : ""
      );
      setIsActive(editingProduct.isActive);
    } else {
      setName("");
      setDescription("");
      setSlug("");
      setPrice("");
      setCategoryId("");
      setIsActive(true);
    }
  }, [editingProduct]);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
      setName("");
      setDescription("");
      setSlug("");
      setPrice("");
      setCategoryId("");
      setIsActive(true);

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
    <motion.form
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* Name + Price */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="product-name" className={labelClass}>Product Name</label>
          <input
            id="product-name"
            type="text"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            placeholder="Enter product name"
            required
            disabled={isSubmitting}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="product-price" className={labelClass}>Price</label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-zinc-400">
              Rs.
            </span>
            <input
              id="product-price"
              type="number"
              value={price}
              onChange={(e) =>
                setPrice(e.target.value)
              }
              placeholder="0.00"
              min="0"
              step="0.01"
              required
              disabled={isSubmitting}
              className={`${inputClass} pl-9`}
            />
          </div>
        </div>
      </div>

      {/* Slug + Category */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="product-slug" className={labelClass}>Slug</label>
          <input
            id="product-slug"
            type="text"
            value={slug}
            onChange={(e) =>
              setSlug(e.target.value)
            }
            placeholder="product-slug"
            required
            disabled={isSubmitting}
            className={inputClass}
          />
          <p className="mt-1.5 text-xs text-zinc-400">Used in the product URL.</p>
        </div>

        <div>
          <label htmlFor="product-category" className={labelClass}>Category</label>
          <div className="relative">
            <select
              id="product-category"
              value={categoryId}
              onChange={(e) =>
                setCategoryId(e.target.value)
              }
              disabled={isSubmitting}
              className={`${inputClass} appearance-none pr-9`}
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
            <ChevronIcon />
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="product-description" className={labelClass}>Description</label>
        <textarea
          id="product-description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          placeholder="Enter product description"
          required
          rows={4}
          disabled={isSubmitting}
          className={`${inputClass} h-auto resize-y py-2`}
        />
      </div>

      {/* Active toggle */}
      <label className="flex w-fit cursor-pointer items-center gap-3">
        <span className="relative inline-flex h-6 w-11 flex-shrink-0 items-center">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) =>
              setIsActive(e.target.checked)
            }
            disabled={isSubmitting}
            className="peer sr-only"
          />
          <span className="absolute inset-0 rounded-full bg-zinc-200 transition-colors duration-200 peer-checked:bg-zinc-900 peer-disabled:opacity-50" />
          <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 peer-checked:translate-x-5" />
        </span>
        <span className="text-sm font-medium text-zinc-800">
          {isActive ? "Active" : "Inactive"}
        </span>
      </label>

      {/* Buttons */}
      <div className="flex items-center gap-3 border-t border-zinc-100 pt-5">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-zinc-900 px-5 text-sm font-medium text-white transition-all duration-150 hover:bg-zinc-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2"
        >
          {isSubmitting && <SpinnerIcon />}
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
            className="inline-flex h-10 items-center justify-center rounded-lg bg-zinc-100 px-5 text-sm font-medium text-zinc-900 transition-colors duration-150 hover:bg-zinc-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2"
          >
            Cancel
          </button>
        )}
      </div>
    </motion.form>
  );
}