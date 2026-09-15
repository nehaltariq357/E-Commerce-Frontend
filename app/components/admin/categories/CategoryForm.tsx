"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

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

function SpinnerIcon() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}
function PencilIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
    </svg>
  );
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
  const [nameError, setNameError] = useState("");

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
    setNameError("");
  }, [editingCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setNameError("Category name is required");
      return;
    }

    setNameError("");

    const data: CategoryInput = {
      name: name.trim(),
      description: description.trim(),
      isActive,
    };

    await onSubmit(data);
  };

  return (
    <motion.div
      layout
      className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
          {editingCategory ? "Update category" : "Create category"}
        </h2>

        <AnimatePresence>
          {editingCategory && (
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20"
            >
              <PencilIcon />
              Editing &ldquo;{editingCategory.name}&rdquo;
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* NAME */}

        <div>
          <label htmlFor="category-name" className="mb-1.5 block text-sm font-medium text-zinc-700">
            Category name
          </label>

          <input
            id="category-name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (nameError) setNameError("");
            }}
            placeholder="e.g. Home &amp; Kitchen"
            aria-invalid={Boolean(nameError)}
            className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 ${
              nameError
                ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                : "border-zinc-300 focus:border-zinc-400 focus:ring-zinc-100"
            }`}
          />

          {nameError && (
            <p className="mt-1.5 text-xs font-medium text-red-600">{nameError}</p>
          )}
        </div>

        {/* DESCRIPTION */}

        <div>
          <label htmlFor="category-description" className="mb-1.5 block text-sm font-medium text-zinc-700">
            Description
          </label>

          <textarea
            id="category-description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            placeholder="Enter category description"
            rows={3}
            className="w-full resize-none rounded-lg border border-zinc-300 px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-100"
          />
        </div>

        {/* ACTIVE */}

        <div className="flex items-center justify-between rounded-lg border border-zinc-200 px-3.5 py-3">
          <div>
            <label htmlFor="category-active" className="text-sm font-medium text-zinc-700">
              Active
            </label>
            <p className="text-xs text-zinc-500">Visible to customers when active</p>
          </div>

          <button
            id="category-active"
            type="button"
            role="switch"
            aria-checked={isActive}
            onClick={() => setIsActive((prev) => !prev)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 ${
              isActive ? "bg-zinc-900" : "bg-zinc-200"
            }`}
          >
            <span
              className={`inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow transition-transform duration-200 ${
                isActive ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* BUTTONS */}

        <div className="flex gap-3 pt-1">

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-zinc-900 px-5 text-sm font-medium text-white transition-all duration-150 hover:bg-zinc-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2"
          >
            {isSubmitting && <SpinnerIcon />}
            {isSubmitting
              ? "Saving..."
              : editingCategory
                ? "Update category"
                : "Create category"}
          </button>

          {editingCategory && (
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex h-10 items-center rounded-lg border border-zinc-300 px-5 text-sm font-medium text-zinc-700 transition-colors duration-150 hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2"
            >
              Cancel
            </button>
          )}

        </div>

      </form>
    </motion.div>
  );
}