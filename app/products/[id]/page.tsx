"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProductById } from "../../components/product/product.api";
import { Product } from "../../components/product/product.type";

export default function ProductDetailPage() {
  const params = useParams();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productId = Number(params.id);
        if (Number.isNaN(productId)) {
          throw new Error("Invalid product ID");
        }
        const response = await getProductById(productId);
        setProduct(response.data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to fetch product",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [params.id]);
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }
  if (!product) {
    return <div>Product not found</div>;
  }

  const image = product.productImages?.[0]?.imageUrl;
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      {" "}
      <div className="grid gap-10 md:grid-cols-2">
        {" "}
        {/* Product Image */}{" "}
        <div className="aspect-square overflow-hidden rounded-xl bg-gray-100">
          {" "}
          {image ? (
            <img
              src={image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
              {" "}
              No image{" "}
            </div>
          )}{" "}
        </div>{" "}
        {/* Product Information */}{" "}
        <div>
          {" "}
          {product.category && (
            <p className="mb-2 text-sm text-gray-500">
              {" "}
              {product.category.name}{" "}
            </p>
          )}{" "}
          <h1 className="text-3xl font-bold"> {product.name} </h1>{" "}
          <p className="mt-4 text-2xl font-bold"> ${product.price} </p>{" "}
          <p className="mt-6 leading-7 text-gray-600">
            {" "}
            {product.description}{" "}
          </p>{" "}
          {/* Variants */}{" "}
          {(product.productVariants?.length ?? 0) > 0 && (
            <div className="mt-8">
              {" "}
              <h2 className="mb-3 text-lg font-semibold">
                {" "}
                Available Variants{" "}
              </h2>{" "}
              <div className="space-y-3">
                {" "}
                {product.productVariants?.map((variant) => (
                  <div key={variant.id} className="rounded-lg border p-4">
                    {" "}
                    <p>
                      {" "}
                      <strong>SKU:</strong> {variant.sku}{" "}
                    </p>{" "}
                    {variant.size && (
                      <p>
                        {" "}
                        <strong>Size:</strong> {variant.size}{" "}
                      </p>
                    )}{" "}
                    {variant.color && (
                      <p>
                        {" "}
                        <strong>Color:</strong> {variant.color}{" "}
                      </p>
                    )}{" "}
                    <p>
                      {" "}
                      <strong>Stock:</strong> {variant.stock}{" "}
                    </p>{" "}
                  </div>
                ))}{" "}
              </div>{" "}
            </div>
          )}{" "}
          <button
            type="button"
            className="mt-8 rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
          >
            {" "}
            Add to Cart{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
    </main>
  );
}
