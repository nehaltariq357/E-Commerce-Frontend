"use client";

import type {
  ProductImage,
} from "../../components/product/product.type";

interface ImageTableProps {
  images: ProductImage[];
}

export default function ImageTable({
  images,
}: ImageTableProps) {
  if (images.length === 0) {
    return <p>No images found.</p>;
  }

  return (
    <div>
      <h3>Product Images</h3>

      <div>
        {images.map((image) => (
          <div key={image.id}>
            <img
              src={image.imageUrl}
              alt="Product"
              width={150}
              height={150}
            />

            {/* <p>{image.imageUrl}</p> */}
          </div>
        ))}
      </div>
    </div>
  );
}