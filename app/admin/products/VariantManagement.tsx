"use client";

import { useEffect, useState } from "react";

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
      <h2>Variant Management</h2>

      {error && (
        <p>{error}</p>
      )}

      {message && (
        <p>{message}</p>
      )}

      <VariantForm
        productId={productId}
        editingVariant={editingVariant}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
      />

      <VariantTable
        variants={variants}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}