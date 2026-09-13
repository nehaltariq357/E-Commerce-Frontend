"use client";

import { useEffect, useState } from "react";

import type {
  Category,
  CategoryInput,
} from "../../../features/category/category.types";

interface CategoryFormProps {
  editingCategory: Category | null;
  onSubmit: (data: CategoryInput) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function CategoryForm({
  editingCategory,
  onSubmit,
  onCancel,
  isSubmitting,
}: CategoryFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name);
      setDescription(editingCategory.description ?? "");
      setIsActive(editingCategory.isActive);
    } else {
      setName("");
      setDescription("");
      setIsActive(true);
    }
  }, [editingCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      return;
    }

    const data: CategoryInput = {
      name: name.trim(),
      description: description.trim(),
      isActive,
    };

    await onSubmit(data);
  };

  return (
    <div className="rounded-lg border p-6">

      <h2 className="mb-4 text-xl font-semibold">
        {editingCategory
          ? "Update Category"
          : "Create Category"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* NAME */}

        <div>
          <label className="mb-1 block text-sm font-medium">
            Category Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter category name"
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        {/* DESCRIPTION */}

        <div>
          <label className="mb-1 block text-sm font-medium">
            Description
          </label>

          <textarea
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            placeholder="Enter category description"
            rows={3}
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        {/* ACTIVE */}

        <div className="flex items-center gap-2">

          <input
            id="category-active"
            type="checkbox"
            checked={isActive}
            onChange={(e) =>
              setIsActive(e.target.checked)
            }
          />

          <label htmlFor="category-active">
            Active
          </label>

        </div>

        {/* BUTTONS */}

        <div className="flex gap-3">

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-black px-5 py-2 text-white disabled:opacity-50"
          >
            {isSubmitting
              ? "Saving..."
              : editingCategory
                ? "Update Category"
                : "Create Category"}
          </button>

          {editingCategory && (
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
    </div>
  );
}