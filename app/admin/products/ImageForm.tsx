"use client";

import { useState } from "react";

import type {
  ProductImageInput,
} from "../../components/product/product.type";

interface ImageFormProps {
  productId: number;
  onSubmit: (
    data: ProductImageInput
  ) => Promise<void>;
  isSubmitting: boolean;
}

export default function ImageForm({
  productId,
  onSubmit,
  isSubmitting,
}: ImageFormProps) {
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const data: ProductImageInput = {
      productId,
      imageUrl,
    };

    await onSubmit(data);

    setImageUrl("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Product Image</h3>

      <div>
        <label>Image URL</label>

        <input
          type="url"
          value={imageUrl}
          onChange={(e) =>
            setImageUrl(e.target.value)
          }
          placeholder="https://example.com/image.jpg"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting
          ? "Adding..."
          : "Add Image"}
      </button>
    </form>
  );
}