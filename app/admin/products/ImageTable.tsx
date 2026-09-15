"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import type {
  ProductImage,
} from "../../components/product/product.type";

interface ImageTableProps {
  images: ProductImage[];
}

function ImageIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  );
}

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, delay: Math.min(i * 0.04, 0.3), ease: [0.16, 1, 0.3, 1] as const },
  }),
};

function ImageThumb({ image }: { image: ProductImage }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative h-full w-full">
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-zinc-100" />
      )}

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.imageUrl}
        alt="Product"
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`h-full w-full object-cover transition-all duration-300 group-hover:scale-105 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}

export default function ImageTable({
  images,
}: ImageTableProps) {
  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-zinc-50/40 px-6 py-14 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-zinc-400 ring-1 ring-zinc-200">
          <ImageIcon />
        </div>
        <h3 className="text-sm font-semibold text-zinc-900">No images yet</h3>
        <p className="mt-1 max-w-sm text-sm text-zinc-500">
          Images added to this product will show up here.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-900">Product images</h3>
        <span className="text-xs text-zinc-400">
          {images.length} {images.length === 1 ? "image" : "images"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {images.map((image, i) => (
          <motion.div
            key={image.id}
            custom={i}
            initial="hidden"
            animate="show"
            variants={itemVariants}
            className="group relative aspect-square overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 transition-shadow duration-200 hover:shadow-md"
          >
            <ImageThumb image={image} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}