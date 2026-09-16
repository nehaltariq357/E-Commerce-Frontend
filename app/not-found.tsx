"use client";
import Link from "next/link";
import { motion } from "framer-motion";

function CompassIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-4.243-4.243L2 15.166V21h5.834l3.293-3.293M9.53 16.122l6.878-6.878m-6.878 6.878L2.878 22.775M16.407 9.244A3 3 0 1011.593 4.43a3 3 0 004.814 4.814z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 9l6-6" />
    </svg>
  );
}

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md text-center"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">
          <CompassIcon />
        </div>

        <p className="mt-5 text-sm font-medium text-zinc-400">404</p>
        <h1 className="mt-1 text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>

        <Link
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-zinc-800 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
        >
          Back to home
        </Link>
      </motion.div>
    </div>
  );
}