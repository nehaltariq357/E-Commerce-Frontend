"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import type { ProductVariant } from "../../components/product/product.type";

interface VariantTableProps {
  variants: ProductVariant[];
  isLoading: boolean;
  onEdit: (variant: ProductVariant) => void;
  onDelete: (variantId: number) => Promise<void>;
}

function PencilIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  );
}
function SpinnerIcon() {
  return (
    <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}
function LayersIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
    </svg>
  );
}

function StockBadge({ stock }: { stock: number }) {
  const tone =
    stock === 0
      ? "bg-red-50 text-red-700 ring-red-600/20"
      : stock <= 5
        ? "bg-amber-50 text-amber-700 ring-amber-600/20"
        : "bg-emerald-50 text-emerald-700 ring-emerald-600/20";

  const dot =
    stock === 0 ? "bg-red-500" : stock <= 5 ? "bg-amber-500" : "bg-emerald-500";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${tone}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot} ${stock === 0 ? "" : stock <= 5 ? "animate-pulse" : ""}`} />
      {stock === 0 ? "Out of stock" : `${stock} in stock`}
    </span>
  );
}

function TableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200">
      <div className="flex items-center gap-4 border-b border-zinc-200 bg-zinc-50 px-4 py-3">
        <div className="h-3 w-6 animate-pulse rounded bg-zinc-200" />
        <div className="h-3 w-10 animate-pulse rounded bg-zinc-200" />
        <div className="h-3 w-10 animate-pulse rounded bg-zinc-200" />
        <div className="h-3 w-14 animate-pulse rounded bg-zinc-200" />
        <div className="ml-auto h-3 w-16 animate-pulse rounded bg-zinc-200" />
      </div>
      <div className="divide-y divide-zinc-100">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3.5">
            <div className="h-4 w-6 animate-pulse rounded bg-zinc-100" />
            <div className="h-4 w-14 animate-pulse rounded bg-zinc-100" />
            <div className="h-4 w-14 animate-pulse rounded bg-zinc-100" />
            <div className="h-6 w-24 animate-pulse rounded-full bg-zinc-100" />
            <div className="h-4 w-28 flex-1 animate-pulse rounded bg-zinc-100" />
            <div className="ml-auto flex gap-2">
              <div className="h-8 w-16 animate-pulse rounded-lg bg-zinc-100" />
              <div className="h-8 w-16 animate-pulse rounded-lg bg-zinc-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const rowVariants = {
  hidden: { opacity: 0, y: 6 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, delay: Math.min(i * 0.03, 0.3), ease: [0.16, 1, 0.3, 1] as const },
  }),
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function VariantTable({
  variants,
  isLoading,
  onEdit,
  onDelete,
}: VariantTableProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (variantId: number) => {
    setDeletingId(variantId);
    try {
      await onDelete(variantId);
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (variants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-zinc-50/40 px-6 py-14 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-zinc-400 ring-1 ring-zinc-200">
          <LayersIcon />
        </div>
        <h3 className="text-sm font-semibold text-zinc-900">No variants yet</h3>
        <p className="mt-1 max-w-sm text-sm text-zinc-500">
          Variants you add for this product will show up here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50">
              <th className="px-4 py-3 font-medium text-zinc-500">ID</th>
              <th className="px-4 py-3 font-medium text-zinc-500">Size</th>
              <th className="px-4 py-3 font-medium text-zinc-500">Color</th>
              <th className="px-4 py-3 font-medium text-zinc-500">Stock</th>
              <th className="px-4 py-3 font-medium text-zinc-500">SKU</th>
              <th className="px-4 py-3 text-right font-medium text-zinc-500">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-100 bg-white">
            <AnimatePresence initial={false}>
              {variants.map((variant, i) => {
                const isDeleting = deletingId === variant.id;

                return (
                  <motion.tr
                    key={variant.id}
                    custom={i}
                    layout
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    variants={rowVariants}
                    className="transition-colors hover:bg-zinc-50/70"
                  >
                    <td className="px-4 py-3 text-zinc-500">{variant.id}</td>

                    <td className="px-4 py-3 text-zinc-700">
                      {variant.size ?? <span className="text-zinc-400">N/A</span>}
                    </td>

                    <td className="px-4 py-3 text-zinc-700">
                      {variant.color ?? <span className="text-zinc-400">N/A</span>}
                    </td>

                    <td className="px-4 py-3">
                      <StockBadge stock={variant.stock} />
                    </td>

                    <td className="px-4 py-3 font-mono text-xs text-zinc-500">{variant.sku}</td>

                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit(variant)}
                          disabled={isDeleting}
                          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-zinc-300 px-3 text-sm font-medium text-zinc-700 transition-colors duration-150 hover:border-zinc-400 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2"
                        >
                          <PencilIcon />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(variant.id)}
                          disabled={isDeleting}
                          className="inline-flex h-8 w-[84px] items-center justify-center gap-1.5 rounded-lg bg-red-500 px-3 text-sm font-medium text-white transition-colors duration-150 hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                        >
                          {isDeleting ? <SpinnerIcon /> : <TrashIcon />}
                          {isDeleting ? "Deleting" : "Delete"}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}