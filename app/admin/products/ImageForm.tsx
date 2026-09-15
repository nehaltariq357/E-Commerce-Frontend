"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

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

const inputClass =
  "h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:text-zinc-400";

function SpinnerIcon() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
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
function AlertIcon() {
  return (
    <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  );
}

export default function ImageForm({
  productId,
  onSubmit,
  isSubmitting,
}: ImageFormProps) {
  const [imageUrl, setImageUrl] = useState("");
  const [previewFailed, setPreviewFailed] = useState(false);

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
    setPreviewFailed(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm"
    >
      <h3 className="text-sm font-semibold text-zinc-900">Add product image</h3>

      <div className="flex items-start gap-3">
        <div className="relative flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-300">
          <AnimatePresence mode="wait" initial={false}>
            {imageUrl && !previewFailed ? (
              <motion.img
                key={imageUrl}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                src={imageUrl}
                alt=""
                className="h-full w-full object-cover"
                onError={() => setPreviewFailed(true)}
                onLoad={() => setPreviewFailed(false)}
              />
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <ImageIcon />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex-1">
          <label htmlFor="image-url" className="mb-1.5 block text-sm font-medium text-zinc-800">
            Image URL
          </label>

          <input
            id="image-url"
            type="url"
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value);
              setPreviewFailed(false);
            }}
            placeholder="https://example.com/image.jpg"
            required
            disabled={isSubmitting}
            className={inputClass}
          />

          {previewFailed ? (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
              <AlertIcon />
              Couldn&apos;t load a preview for this URL — check that it&apos;s a direct image link.
            </p>
          ) : (
            <p className="mt-1.5 text-xs text-zinc-400">
              Paste a direct link to an image file.
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white transition-all duration-150 hover:bg-zinc-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2"
      >
        {isSubmitting ? <SpinnerIcon /> : <PlusIcon />}
        {isSubmitting ? "Adding..." : "Add image"}
      </button>
    </form>
  );
}