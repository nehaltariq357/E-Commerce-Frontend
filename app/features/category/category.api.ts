import { api } from "../../lib/api";

import type {
  CategoriesResponse,
  CategoryInput,
  CategoryResponse,
  DeleteCategoryResponse,
} from "./category.types";

// get all categories

export const getCategories = async () =>
  await api<CategoriesResponse>("/categories");

// get category by id

export const getCategoryById = async (categoryId: number) => {
  return api<CategoryResponse>(`/categories/${categoryId}`);
};

// create category

export const createCategory = async (data: CategoryInput) =>
  await api<CategoryResponse>("/categories", {
    method: "POST",
    body: data,
  });

// update category

export const updateCategory = async (
  categoryId: number,
  data: CategoryInput
) =>
  await api<CategoryResponse>(`/categories/${categoryId}`, {
    method: "PATCH",
    body: data,
  });

// delete category

export const deleteCategory = async (categoryId: number) =>
  await api<DeleteCategoryResponse>(`/categories/${categoryId}`, {
    method: "DELETE",
  });