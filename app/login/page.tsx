
"use client";

import React, { FormEvent, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { loginUser } from "../features/auth/auth.api";
import { setUser } from "../features/auth/authSlice";
import { useAppDispatch } from "../store/hooks";

function AlertIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
      />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M22.065 12a10.522 10.522 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.243L9.88 9.88"
      />
    </svg>
  );
}

const inputClasses =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none transition-all duration-150 placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:text-zinc-500";

const fieldVariants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const LoginPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);
    setError("");

    try {
      const response = await loginUser({ email, password });

      // Update Redux
      dispatch(setUser(response.data));

      // Redirect based on role
      if (response.data.role === "ADMIN") {
        router.push("/admin");
      } else if (response.data.role === "USER") {
        router.push("/products");
      } else {
        router.push("/register");
      }

      alert("Login successful");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-8 sm:px-6">
      <motion.div
        initial={{
          opacity: 0,
          y: 24,
          scale: 0.98,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.45,
          ease: "easeOut",
        }}
        className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8"
      >
        {/* Header */}
        <motion.div
          initial={{
            opacity: 0,
            y: 8,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.08,
            duration: 0.35,
            ease: "easeOut",
          }}
        >
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Welcome back
          </h1>

          <p className="mt-1.5 text-sm text-zinc-500">
            Sign in to your account
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial="hidden"
          animate="visible"
          transition={{
            delayChildren: 0.15,
            staggerChildren: 0.08,
          }}
          className="mt-6 space-y-4"
        >
          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{
                  opacity: 0,
                  height: 0,
                  y: -8,
                }}
                animate={{
                  opacity: 1,
                  height: "auto",
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  height: 0,
                  y: -8,
                }}
                transition={{
                  duration: 0.22,
                }}
                role="alert"
                className="flex items-start gap-2.5 overflow-hidden rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
              >
                <AlertIcon />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Email */}
          <motion.div variants={fieldVariants}>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-zinc-700"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              required
              autoComplete="email"
              disabled={isSubmitting}
              className={inputClasses}
            />
          </motion.div>

          {/* Password */}
          <motion.div variants={fieldVariants}>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-zinc-700"
            >
              Password
            </label>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                disabled={isSubmitting}
                className={`${inputClasses} pr-10`}
              />

              <motion.button
                type="button"
                onClick={() => setShowPassword((show) => !show)}
                disabled={isSubmitting}
                whileTap={{ scale: 0.9 }}
                className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-zinc-400 transition-colors hover:text-zinc-600 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </motion.button>
            </div>
          </motion.div>

          {/* Submit */}
          <motion.div variants={fieldVariants}>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={!isSubmitting ? { y: -1 } : {}}
              whileTap={!isSubmitting ? { scale: 0.98 } : {}}
              transition={{ duration: 0.15 }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting && <SpinnerIcon />}
              {isSubmitting ? "Signing in..." : "Sign in"}
            </motion.button>
          </motion.div>
        </motion.form>

        {/* Register Link */}
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.5,
            duration: 0.3,
          }}
          className="mt-6 border-t border-zinc-100 pt-5 text-center"
        >
          <p className="text-sm text-zinc-500">
            Don't have an account?{" "}
            <motion.button
              type="button"
              onClick={() => router.push("/register")}
              disabled={isSubmitting}
              whileTap={{ scale: 0.97 }}
              className="font-medium text-zinc-900 transition-colors hover:text-zinc-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Create account
            </motion.button>
          </p>
        </motion.div>
      </motion.div>
    </main>
  );
};

export default LoginPage;

