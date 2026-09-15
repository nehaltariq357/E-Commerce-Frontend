"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../../../features/category/category.api";

import {
  addCategory,
  removeCategory,
  setCategories,
  updateCategory as updateCategoryState,
} from "../../../features/category/categorySlice";

import type {
  Category,
  CategoryInput,
} from "../../../features/category/category.types";

import {
  useAppDispatch,
  useAppSelector,
} from "../../../store/hooks";

import CategoryForm from "./CategoryForm";
import CategoryTable from "./CategoryTable";

function AlertIcon() {
  return (
    <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.008M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
function CheckCircleIcon() {
  return (
    <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l2.25 2.25 6-6M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
function XIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function Banner({
  tone,
  children,
  onDismiss,
}: {
  tone: "error" | "success";
  children: React.ReactNode;
  onDismiss: () => void;
}) {
  const styles =
    tone === "error"
      ? {
          wrap: "border-red-200 bg-red-50",
          icon: "text-red-500",
          text: "text-red-700",
          dismiss: "text-red-400 hover:text-red-600 focus-visible:ring-red-400",
        }
      : {
          wrap: "border-emerald-200 bg-emerald-50",
          icon: "text-emerald-500",
          text: "text-emerald-700",
          dismiss: "text-emerald-400 hover:text-emerald-600 focus-visible:ring-emerald-400",
        };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
      animate={{ opacity: 1, height: "auto", marginBottom: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex items-start gap-2.5 overflow-hidden rounded-xl border px-4 py-3 ${styles.wrap}`}
    >
      <span className={`mt-0.5 ${styles.icon}`}>
        {tone === "error" ? <AlertIcon /> : <CheckCircleIcon />}
      </span>
      <p className={`flex-1 text-sm font-medium ${styles.text}`}>{children}</p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className={`rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${styles.dismiss}`}
      >
        <XIcon />
      </button>
    </motion.div>
  );
}

export default function CategoryManagement() {
  const dispatch = useAppDispatch();

  const categories = useAppSelector(
    (state) => state.category.categories
  );

  const [editingCategory, setEditingCategory] =
    useState<Category | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  const [message, setMessage] = useState("");

  // =========================
  // GET CATEGORIES
  // =========================

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await getCategories();

      if (response.success) {
        dispatch(setCategories(response.data));
      }
    } catch (error) {
      console.error(error);
      setError("Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // =========================
  // Auto-dismiss the success message after a few seconds
  // (purely presentational — error messages stay until the
  // user dismisses or acts again, since those need attention)
  // =========================

  useEffect(() => {
    if (!message) return;

    const timeout = setTimeout(() => setMessage(""), 4000);

    return () => clearTimeout(timeout);
  }, [message]);

  // =========================
  // CREATE / UPDATE
  // =========================

  const handleSubmit = async (
    data: CategoryInput
  ) => {
    try {
      setIsSubmitting(true);
      setError("");
      setMessage("");

      // UPDATE
      if (editingCategory) {
        const response = await updateCategory(
          editingCategory.id,
          data
        );

        if (response.success) {
          dispatch(
            updateCategoryState(response.data)
          );

          setEditingCategory(null);

          setMessage(
            "Category updated successfully"
          );
        }

        return;
      }

      // CREATE
      const response = await createCategory(data);

      if (response.success) {
        dispatch(addCategory(response.data));

        setMessage(
          "Category created successfully"
        );
      }
    } catch (error) {
      console.error(error);
      setError("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================
  // EDIT
  // =========================

  const handleEdit = (category: Category) => {
    setEditingCategory(category);

    setError("");
    setMessage("");
  };

  // =========================
  // CANCEL
  // =========================

  const handleCancel = () => {
    setEditingCategory(null);

    setError("");
    setMessage("");
  };

  // =========================
  // DELETE
  // =========================

  const handleDelete = async (
    categoryId: number
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      const response =
        await deleteCategory(categoryId);

      if (response.success) {
        dispatch(removeCategory(categoryId));

        setMessage(
          "Category deleted successfully"
        );
      }
    } catch (error) {
      console.error(error);
      setError("Failed to delete category");
    }
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Category Management
        </h1>

        <p className="mt-1 text-sm text-zinc-500">
          Manage your product categories.
        </p>
      </div>

      {/* ERROR / SUCCESS */}

      <AnimatePresence mode="popLayout">
        {error && (
          <Banner key="error" tone="error" onDismiss={() => setError("")}>
            {error}
          </Banner>
        )}
        {message && (
          <Banner key="message" tone="success" onDismiss={() => setMessage("")}>
            {message}
          </Banner>
        )}
      </AnimatePresence>

      {/* FORM */}

      <CategoryForm
        editingCategory={editingCategory}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
      />

      {/* TABLE */}

      <CategoryTable
        categories={categories}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

    </div>
  );
}