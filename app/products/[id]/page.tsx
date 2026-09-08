"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProductById } from "../../components/product/product.api";
import { Product } from "../../components/product/product.type";
import { addToCart } from "../../features/cart/cart.api";
import {
  addCartItem,
  updateCartItemState,
} from "../../features/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

export default function ProductDetailPage() {
  const params = useParams();
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart.cart);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState<
    number | undefined
  >(undefined);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");
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

  // handle add to cart
  const handleAddToCart = async () => {
    if (!product) return;
    try {
      setIsAddingToCart(true);
      setError("");
      // if user has variants, user must select one
      if (
        product.productVariants &&
        product.productVariants.length > 0 &&
        !selectedVariantId
      ) {
        throw new Error("Please select a product variant");
      }

      const response = await addToCart({
        productId: product.id,
        variantId: selectedVariantId,
        quantity,
      });

      const cartItem = response.data;

      // check if item exists in redux

      const existingItem = cart?.cartItems.find(
        (item) => item.id === cartItem.id,
      );
      if (existingItem) {
        dispatch(updateCartItemState(cartItem));
      } else {
        dispatch(addCartItem(cartItem));
      }
      alert("Product added to cart successfully");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to add to cart",
      );
    } finally {
      setIsAddingToCart(false);
    }
  };

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
          {product.productVariants && product.productVariants.length > 0 && (
            <div className="mt-8">
              {" "}
              <h2 className="mb-3 text-lg font-semibold">
                {" "}
                Select Variant{" "}
              </h2>{" "}
              <div className="flex flex-wrap gap-3">
                {" "}
                {product.productVariants.map((variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setSelectedVariantId(variant.id)}
                    disabled={variant.stock === 0}
                    className={`rounded-lg border px-4 py-2 transition ${selectedVariantId === variant.id ? "border-black bg-black text-white" : "bg-white"} ${variant.stock === 0 ? "cursor-not-allowed opacity-50" : ""}`}
                  >
                    {" "}
                    {variant.size && <span>{variant.size} </span>}{" "}
                    {variant.color && <span>{variant.color}</span>}{" "}
                    {!variant.size && !variant.color && variant.sku}{" "}
                    <span className="ml-2 text-xs">
                      {" "}
                      ({variant.stock} left){" "}
                    </span>{" "}
                  </button>
                ))}{" "}
              </div>{" "}
            </div>
          )}{" "}
          {/* Quantity */}{" "}
          <div className="mt-6">
            {" "}
            <label className="mb-2 block font-medium"> Quantity </label>{" "}
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(event) =>
                setQuantity(Math.max(1, Number(event.target.value)))
              }
              className="w-24 rounded-lg border px-3 py-2"
            />{" "}
          </div>{" "}
          {/* Error */}{" "}
          {error && <p className="mt-4 text-sm text-red-500"> {error} </p>}{" "}
          {/* Add to Cart */}{" "}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="mt-8 rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {" "}
            {isAddingToCart ? "Adding..." : "Add to Cart"}{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
    </main>
  );
}
