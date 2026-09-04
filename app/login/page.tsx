"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { loginUser } from "../features/auth/auth.api";
import { setUser } from "../features/auth/authSlice";
import { useAppDispatch } from "../store/hooks";

const LoginPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      const response = await loginUser({ email, password });
      // update redux
      dispatch(setUser(response.data));
      //redirect based on role

      if (response.data.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      {" "}
      <div className="w-full max-w-md rounded-lg border p-6 shadow-sm">
        {" "}
        <h1 className="text-2xl font-bold"> Welcome back </h1>{" "}
        <p className="mt-2 text-sm text-gray-500"> Sign in to your account </p>{" "}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {" "}
          {error && (
            <div className="rounded-md border border-red-200 p-3 text-sm text-red-600">
              {" "}
              {error}{" "}
            </div>
          )}{" "}
          <div>
            {" "}
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              {" "}
              Email{" "}
            </label>{" "}
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
              className="w-full rounded-md border px-3 py-2 outline-none"
            />{" "}
          </div>{" "}
          <div>
            {" "}
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium"
            >
              {" "}
              Password{" "}
            </label>{" "}
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
              className="w-full rounded-md border px-3 py-2 outline-none"
            />{" "}
          </div>{" "}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-black px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {" "}
            {isSubmitting ? "Signing in..." : "Sign in"}{" "}
          </button>{" "}
        </form>{" "}
      </div>{" "}
    </main>
  );
};

export default LoginPage;
