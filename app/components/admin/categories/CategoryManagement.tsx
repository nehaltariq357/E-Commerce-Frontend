"use client";

import { useEffect, useState } from "react";

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
    <div className="space-y-8">

      {/* HEADER */}

      <div>
        <h1 className="text-2xl font-bold">
          Category Management
        </h1>

        <p className="text-gray-500">
          Manage your product categories.
        </p>
      </div>

      {/* ERROR */}

      {error && (
        <div className="rounded-md bg-red-50 p-3 text-red-600">
          {error}
        </div>
      )}

      {/* SUCCESS */}

      {message && (
        <div className="rounded-md bg-green-50 p-3 text-green-600">
          {message}
        </div>
      )}

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