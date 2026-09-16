"use client";
import { motion } from "framer-motion";
import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-4 py-10">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <Spinner />
      </motion.div>
      <p className="text-sm text-zinc-400">Loading...</p>
    </div>
  );
}