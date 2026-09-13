"use client";

import { useEffect, useState } from "react";

import {
  addProductImage,
  getProductById,
} from "../../components/product/product.api";

import type {
  ProductImage,
  ProductImageInput,
} from "../../components/product/product.type";

import ImageForm from "./ImageForm";
import ImageTable from "./ImageTable";

interface ImageManagementProps {
  productId: number;
}

export default function ImageManagement({
  productId,
}: ImageManagementProps) {
  const [images, setImages] = useState<ProductImage[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // load product images
  const loadImages = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await getProductById(productId);

      setImages(response.data.productImages ?? []);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load product images"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, [productId]);

  // add new image
  const handleSubmit = async (data: ProductImageInput) => {
    try {
      setIsSubmitting(true);
      setError("");
      setMessage("");

      const response = await addProductImage(data);

      setImages((prev) => [...prev, response.data]);

      setMessage(response.message);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to add product image"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2>Product Images</h2>

      {error && <p>{error}</p>}

      {message && <p>{message}</p>}

      <ImageForm
        productId={productId}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />

      {isLoading ? (
        <p>Loading images...</p>
      ) : (
        <ImageTable images={images} />
      )}
    </div>
  );
}