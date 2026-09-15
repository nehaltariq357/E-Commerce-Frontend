import Link from "next/link";
import { motion } from "framer-motion";
import { Product } from "./product.type";

interface ProductCartProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCartProps) => {
  const image = product.productImages?.[0]?.imageUrl;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="h-full"
    >
      <Link
        href={`/products/${product.id}`}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl"
      >
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-zinc-100">
          {image ? (
            <img
              src={image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm font-medium text-zinc-400">
              No image
            </div>
          )}

          {/* Image Overlay */}
          <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/5" />

          {/* View Product */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileHover={{ opacity: 1, y: 0 }}
            className="absolute bottom-3 left-3 right-3 hidden rounded-lg bg-white/95 px-4 py-2.5 text-center text-sm font-medium text-zinc-900 shadow-md backdrop-blur-sm sm:block"
          >
            View Product
          </motion.div>
        </div>

        {/* Product Info */}
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          {/* Category */}
          {product.category && (
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
              {product.category.name}
            </p>
          )}

          {/* Product Name */}
          <h3 className="line-clamp-2 text-base font-semibold leading-6 text-zinc-900 transition-colors duration-200 group-hover:text-zinc-600 sm:text-lg">
            {product.name}
          </h3>

          {/* Price */}
          <div className="mt-auto pt-4">
            <p className="text-lg font-bold tracking-tight text-zinc-900">
              ${product.price}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};