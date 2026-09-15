"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getProducts } from "./product.api";
import { ProductCard } from "./ProductCard";
import { Product } from "./product.type";

const skeletonItems = Array.from({ length: 8 });

export const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getProducts();
        setProducts(response.data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch products",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Loading Skeleton
  if (loading) {
    return (
      <section className="w-full">
        <div className="mb-6">
          <div className="h-7 w-40 animate-pulse rounded-md bg-zinc-200" />
          <div className="mt-2 h-4 w-64 animate-pulse rounded-md bg-zinc-100" />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {skeletonItems.map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-zinc-200 bg-white"
            >
              <div className="aspect-square animate-pulse bg-zinc-100" />

              <div className="space-y-3 p-5">
                <div className="h-3 w-20 animate-pulse rounded bg-zinc-100" />
                <div className="h-5 w-3/4 animate-pulse rounded bg-zinc-200" />
                <div className="h-5 w-24 animate-pulse rounded bg-zinc-200" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Error State
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex min-h-60 items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-6"
      >
        <div className="text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
            !
          </div>

          <h2 className="mt-3 text-base font-semibold text-red-800">
            Something went wrong
          </h2>

          <p className="mt-1 text-sm text-red-600">{error}</p>
        </div>
      </motion.div>
    );
  }

  // Empty State
  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex min-h-60 items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-6"
      >
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-200 text-zinc-500">
            🛍️
          </div>

          <h2 className="mt-4 text-lg font-semibold text-zinc-900">
            No products found
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            There are currently no products available.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <section className="w-full">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Products
        </h2>

        <p className="mt-1 text-sm text-zinc-500">
          Explore our latest products
        </p>
      </motion.div>

      {/* Product Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.06,
            },
          },
        }}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {products.map((product) => (
          <motion.div
            key={product.id}
            variants={{
              hidden: {
                opacity: 0,
                y: 18,
              },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.35,
                  ease: "easeOut",
                },
              },
            }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};