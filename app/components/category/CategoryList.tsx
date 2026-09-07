
"use client";

import { useEffect, useState } from "react";

import { getCategories } from "../../features/category/category.api";

import type { Category } from "../../features/category/category.types";

import CategoryCard from "./CategoryCard";

export default function CategoryList() {
  const [categories, setCategories] =
    useState<Category[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response =
          await getCategories();

        setCategories(response.data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch categories"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <section className="py-10">
        Loading categories...
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-10">
        <p>{error}</p>
      </section>
    );
  }

  if (categories.length === 0) {
    return (
      <section className="py-10">
        <p>No categories found</p>
      </section>
    );
  }

  return (
    <section className="py-10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">
          Shop by Category
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Explore products from our categories
        </p>
      </div>

      <div
        className="
          grid
          grid-cols-1
          gap-4
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
        "
      >
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
          />
        ))}
      </div>
    </section>
  );
}

