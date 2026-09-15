"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import {
  createProductVariant,
  deleteProductVariant,
  getProductVariants,
  updateProductVariant,
} from "../../components/product/product.api";

import type {
  ProductVariant,
  ProductVariantInput,
} from "../../components/product/product.type";

import VariantForm from "./VariantForm";
import VariantTable from "./VariantTable";

interface VariantManagementProps {
  productId: number;
}

function CheckCircleIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function AlertCircleIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  );
}

const alertVariants = {
  hidden: { opacity: 0, y: -6, height: 0, marginBottom: 0 },
  show: { opacity: 1, y: 0, height: "auto", marginBottom: 16 },
  exit: { opacity: 0, y: -6, height: 0, marginBottom: 0 },
};

export default function VariantManagement({
  productId,
}: VariantManagementProps) {
  const [variants, setVariants] = useState<
    ProductVariant[]
  >([]);

  const [editingVariant, setEditingVariant] =
    useState<ProductVariant | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  const [message, setMessage] = useState("");

  // load variants
  const loadVariants = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response =
        await getProductVariants(productId);

      setVariants(response.data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load variants"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // load variants when product changes
  useEffect(() => {
    setEditingVariant(null);
    setMessage("");

    loadVariants();
  }, [productId]);

  // create / update variant
  const handleSubmit = async (
    data: ProductVariantInput
  ) => {
    try {
      setIsSubmitting(true);
      setError("");
      setMessage("");

      if (editingVariant) {
        // update
        const response =
          await updateProductVariant(
            editingVariant.id,
            data
          );

        setVariants((currentVariants) =>
          currentVariants.map((variant) =>
            variant.id === editingVariant.id
              ? response.data
              : variant
          )
        );

        setMessage(
          "Variant updated successfully"
        );

        setEditingVariant(null);
      } else {
        // create
        const response =
          await createProductVariant(data);

        setVariants((currentVariants) => [
          ...currentVariants,
          response.data,
        ]);

        setMessage(
          "Variant created successfully"
        );
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // edit
  const handleEdit = (
    variant: ProductVariant
  ) => {
    setEditingVariant(variant);
    setError("");
    setMessage("");
  };

  // cancel
  const handleCancel = () => {
    setEditingVariant(null);
    setError("");
    setMessage("");
  };

  // delete
  const handleDelete = async (
    variantId: number
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this variant?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      const response =
        await deleteProductVariant(variantId);

      setVariants((currentVariants) =>
        currentVariants.filter(
          (variant) =>
            variant.id !== variantId
        )
      );

      setMessage(response.message);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete variant"
      );
    }
  };

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-base font-semibold text-zinc-900">Variant Management</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Add, edit, or remove size, color, and stock variants for this product.
        </p>
      </div>

      <AnimatePresence initial={false}>
        {error && (
          <motion.div
            key="error"
            initial="hidden"
            animate="show"
            exit="exit"
            variants={alertVariants}
            className="flex items-start gap-2 overflow-hidden rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
          >
            <AlertCircleIcon />
            <span>{error}</span>
          </motion.div>
        )}

        {message && (
          <motion.div
            key="message"
            initial="hidden"
            animate="show"
            exit="exit"
            variants={alertVariants}
            className="flex items-start gap-2 overflow-hidden rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-700"
          >
            <CheckCircleIcon />
            <span>{message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-6">
        <VariantForm
          productId={productId}
          editingVariant={editingVariant}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>

      <VariantTable
        variants={variants}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}