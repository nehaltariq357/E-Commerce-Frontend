"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";

import type { Product } from "../../components/product/product.type";

interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (productId: number) => Promise<void>;
  onManageVariants: (product: Product) => void;
}

function PencilIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  );
}
function LayersIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
    </svg>
  );
}
function ImageIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  );
}
function BoxIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-8.25 4.5-8.25-4.5M20.25 7.5l-8.25-4.5-8.25 4.5M20.25 7.5v9l-8.25 4.5m0-9L3.75 7.5m8.25 4.5v9M3.75 7.5v9l8.25 4.5" />
    </svg>
  );
}
function SpinnerIcon() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

function ActionButton({
  onClick,
  disabled,
  label,
  tone = "default",
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  label: string;
  tone?: "default" | "danger";
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${tone === "danger"
          ? "text-zinc-500 hover:bg-red-50 hover:text-red-600 focus-visible:ring-red-500"
          : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:ring-zinc-900"
        }`}
    >
      {children}
    </button>
  );
}

const rowVariants = {
  hidden: { opacity: 0, y: 6 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, delay: Math.min(i * 0.03, 0.3), ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function ProductTable({
  products,
  isLoading,
  onEdit,
  onDelete,
  onManageVariants,
}: ProductTableProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (productId: number) => {
    setDeletingId(productId);
    try {
      await onDelete(productId);
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-xl border border-zinc-200">
        <div className="space-y-0 divide-y divide-zinc-100">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3.5">
              <div className="h-10 w-10 flex-shrink-0 animate-pulse rounded-lg bg-zinc-100" />
              <div className="h-4 flex-1 animate-pulse rounded bg-zinc-100" />
              <div className="h-4 w-20 animate-pulse rounded bg-zinc-100" />
              <div className="h-4 w-16 animate-pulse rounded bg-zinc-100" />
              <div className="h-6 w-16 animate-pulse rounded-full bg-zinc-100" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 px-6 py-16 text-center"
      >
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">
          <BoxIcon />
        </div>
        <h3 className="text-base font-semibold text-zinc-900">No products found</h3>
        <p className="mt-1.5 max-w-sm text-sm text-zinc-500">
          Products you add will show up here.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50">
              <th className="px-4 py-3 font-medium text-zinc-500">Product</th>
              <th className="px-4 py-3 font-medium text-zinc-500">Slug</th>
              <th className="px-4 py-3 font-medium text-zinc-500">Price</th>
              <th className="px-4 py-3 font-medium text-zinc-500">Category</th>
              <th className="px-4 py-3 font-medium text-zinc-500">Status</th>
              <th className="px-4 py-3 text-right font-medium text-zinc-500">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-100 bg-white">
            {products.map((product, i) => {
              const thumbnail = product.productImages?.[0]?.imageUrl;
              const isDeleting = deletingId === product.id;

              return (
                <motion.tr
                  key={product.id}
                  custom={i}
                  initial="hidden"
                  animate="show"
                  variants={rowVariants}
                  className="transition-colors hover:bg-zinc-50/70"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-zinc-100 text-zinc-300">
                        {thumbnail ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={thumbnail} alt={product.name} className="h-full w-full object-cover" />
                        ) : (
                          <ImageIcon />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-zinc-900">{product.name}</p>
                        <p className="text-xs text-zinc-400">ID #{product.id}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-zinc-500">{product.slug}</td>

                  <td className="px-4 py-3 font-medium text-zinc-900">
                    Rs. {Number(product.price).toLocaleString()}
                  </td>

                  <td className="px-4 py-3 text-zinc-500">
                    {product.category?.name ?? (
                      <span className="text-zinc-400">No Category</span>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${product.isActive
                          ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
                          : "bg-zinc-100 text-zinc-600 ring-zinc-600/10"
                        }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${product.isActive ? "bg-emerald-500" : "bg-zinc-400"
                          }`}
                      />
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <ActionButton
                        onClick={() => onManageVariants(product)}
                        label="Manage variants"
                      >
                        <LayersIcon />
                      </ActionButton>

                      <ActionButton onClick={() => onEdit(product)} label="Edit product">
                        <PencilIcon />
                      </ActionButton>

                      <ActionButton
                        onClick={() => handleDelete(product.id)}
                        disabled={isDeleting}
                        label="Delete product"
                        tone="danger"
                      >
                        {isDeleting ? <SpinnerIcon /> : <TrashIcon />}
                      </ActionButton>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}