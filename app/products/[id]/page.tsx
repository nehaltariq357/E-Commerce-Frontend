"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { getProductById } from "../../components/product/product.api";
import { Product } from "../../components/product/product.type";
import { addToCart } from "../../features/cart/cart.api";
import {
addCartItem,
updateCartItemState,
} from "../../features/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

function AlertIcon() {
return (
<svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} >
<path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
</svg>
);
}

function ImageIcon() {
return (
<svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} >
<path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
</svg>
);
}

function SpinnerIcon() {
return (
<svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" >
<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
</svg>
);
}

function MinusIcon() {
return (
<svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} >
<path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
</svg>
);
}

function PlusIconSmall() {
return (
<svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} >
<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
</svg>
);
}

function ProductDetailSkeleton() {
return (
<main className="min-h-screen bg-zinc-50 px-4 py-8 sm:px-6 lg:py-12">
<div className="mx-auto max-w-7xl">
<div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
{/* Image Skeleton */}
<div className="aspect-square animate-pulse overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100" />

      {/* Content Skeleton */}
      <div className="flex flex-col justify-center">
        <div className="h-4 w-24 animate-pulse rounded bg-zinc-200" />

        <div className="mt-4 h-9 w-3/4 animate-pulse rounded bg-zinc-200" />

        <div className="mt-5 h-8 w-28 animate-pulse rounded bg-zinc-200" />

        <div className="mt-7 space-y-2.5">
          <div className="h-4 w-full animate-pulse rounded bg-zinc-100" />
          <div className="h-4 w-full animate-pulse rounded bg-zinc-100" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-zinc-100" />
        </div>

        <div className="mt-8 h-10 w-72 animate-pulse rounded-lg bg-zinc-100" />

        <div className="mt-7 h-11 w-32 animate-pulse rounded-lg bg-zinc-200" />

        <div className="mt-8 h-12 w-full animate-pulse rounded-lg bg-zinc-200" />
      </div>
    </div>
  </div>
</main>

);
}

export default function ProductDetailPage() {
const params = useParams();
const router = useRouter();
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
      error instanceof Error
        ? error.message
        : "Failed to fetch product",
    );
  } finally {
    setLoading(false);
  }
};

fetchProduct();

}, [params.id]);

// Handle add to cart
const handleAddToCart = async () => {
if (!product) return;

try {
  setIsAddingToCart(true);
  setError("");

  // If user has variants, user must select one
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

  // Check if item exists in Redux
  const existingItem = cart?.cartItems.find(
    (item) => item.id === cartItem.id,
  );

  if (existingItem) {
    dispatch(updateCartItemState(cartItem));
  } else {
    dispatch(addCartItem(cartItem));
  }

  alert("Product added to cart successfully");
  router.push("/cart");
} catch (error) {
  setError(
    error instanceof Error
      ? error.message
      : "Failed to add to cart",
  );
} finally {
  setIsAddingToCart(false);
}

};

if (loading) {
return <ProductDetailSkeleton />;
}

if (error && !product) {
return (
<main className="min-h-screen bg-zinc-50 px-4 py-16 sm:px-6">
<div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-red-200 bg-white px-6 py-10 text-center shadow-sm">
<div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
<AlertIcon />
</div>

      <h2 className="mt-4 text-lg font-semibold text-zinc-900">
        Something went wrong
      </h2>

      <p className="mt-2 text-sm leading-6 text-zinc-500">
        {error}
      </p>
    </div>
  </main>
);

}

if (!product) {
return (
<main className="min-h-screen bg-zinc-50 px-4 py-16 sm:px-6">
<div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-10 text-center">
<div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">
<ImageIcon />
</div>

      <h2 className="mt-4 text-lg font-semibold text-zinc-900">
        Product not found
      </h2>

      <p className="mt-2 text-sm leading-6 text-zinc-500">
        This product may have been removed or is no longer available.
      </p>
    </div>
  </main>
);

}

const image = product.productImages?.[0]?.imageUrl;

return (
<main className="min-h-screen bg-zinc-50 px-4 py-8 sm:px-6 lg:py-12">
<div className="mx-auto max-w-7xl">
<div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
{/* Product Image */}
<motion.div
initial={{ opacity: 0, scale: 0.97 }}
animate={{ opacity: 1, scale: 1 }}
transition={{ duration: 0.45, ease: "easeOut" }}
className="group relative aspect-square overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm"
>
{image ? (
<img src={image} alt={product.name} className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
) : (
<div className="flex h-full flex-col items-center justify-center gap-3 text-zinc-400">
<ImageIcon />
<span className="text-sm">No image available</span>
</div>
)}
</motion.div>

      {/* Product Information */}
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: 0.45,
          delay: 0.08,
          ease: "easeOut",
        }}
        className="flex flex-col justify-center"
      >
        {/* Category */}
        {product.category && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500"
          >
            {product.category.name}
          </motion.p>
        )}

        {/* Product Name */}
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl"
        >
          {product.name}
        </motion.h1>

        {/* Price */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-5 text-2xl font-bold tracking-tight text-zinc-950"
        >
          ${Number(product.price).toFixed(2)}
        </motion.p>

        {/* Divider */}
        <div className="my-7 h-px bg-zinc-200" />

        {/* Description */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-sm font-semibold text-zinc-900">
            Description
          </h2>

          <p className="mt-2 text-sm leading-7 text-zinc-600 sm:text-base">
            {product.description}
          </p>
        </motion.div>

        {/* Variants */}
        {product.productVariants &&
          product.productVariants.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="mt-8"
            >
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-zinc-900">
                  Select variant
                </h2>

                {selectedVariantId && (
                  <span className="text-xs text-zinc-500">
                    Selected
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2.5">
                {product.productVariants.map((variant) => {
                  const isSelected =
                    selectedVariantId === variant.id;
                  const isOutOfStock = variant.stock === 0;

                  return (
                    <motion.button
                      key={variant.id}
                      type="button"
                      onClick={() =>
                        setSelectedVariantId((currentId)=>currentId === variant.id ? undefined :variant.id)
                      }
                      disabled={isOutOfStock}
                      whileTap={
                        !isOutOfStock ? { scale: 0.97 } : {}
                      }
                      className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                        isSelected
                          ? "border-zinc-900 bg-zinc-900 text-white shadow-sm"
                          : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-500 hover:bg-zinc-50"
                      } ${
                        isOutOfStock
                          ? "cursor-not-allowed opacity-40"
                          : ""
                      }`}
                    >
                      {variant.size && (
                        <span>{variant.size} </span>
                      )}

                      {variant.color && (
                        <span>{variant.color}</span>
                      )}

                      {!variant.size &&
                        !variant.color &&
                        variant.sku}

                      <span
                        className={`ml-2 text-xs ${
                          isSelected
                            ? "text-zinc-300"
                            : "text-zinc-400"
                        }`}
                      >
                        ({variant.stock} left)
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

        {/* Quantity */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-7"
        >
          <label
            htmlFor="quantity"
            className="mb-2 block text-sm font-semibold text-zinc-900"
          >
            Quantity
          </label>

          <div className="inline-flex h-11 items-stretch overflow-hidden rounded-xl border border-zinc-300 bg-white shadow-sm">
            <motion.button
              type="button"
              onClick={() =>
                setQuantity((q) => Math.max(1, q - 1))
              }
              whileTap={{ scale: 0.9 }}
              className="flex w-10 items-center justify-center text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
              aria-label="Decrease quantity"
            >
              <MinusIcon />
            </motion.button>

            <input
              id="quantity"
              type="number"
              min={1}
              value={quantity}
              onChange={(event) =>
                setQuantity(
                  Math.max(1, Number(event.target.value)),
                )
              }
              className="w-14 border-x border-zinc-300 bg-white text-center text-sm font-medium text-zinc-900 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />

            <motion.button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              whileTap={{ scale: 0.9 }}
              className="flex w-10 items-center justify-center text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
              aria-label="Increase quantity"
            >
              <PlusIconSmall />
            </motion.button>
          </div>
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -6 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -6 }}
              className="mt-5 flex items-start gap-2.5 overflow-hidden rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700"
            >
              <AlertIcon />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add to Cart */}
        <motion.button
          type="button"
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          whileHover={!isAddingToCart ? { y: -1 } : {}}
          whileTap={!isAddingToCart ? { scale: 0.98 } : {}}
          transition={{ duration: 0.15 }}
          className="mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-zinc-950 px-6 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {isAddingToCart && <SpinnerIcon />}
          {isAddingToCart
            ? "Adding to cart..."
            : "Add to Cart"}
        </motion.button>
      </motion.div>
    </div>
  </div>
</main>

);
}