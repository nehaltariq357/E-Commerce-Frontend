"use client";

import { api } from "../lib/api";
import { useRouter } from "next/navigation";

import { useState, FormEvent } from "react";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await api(`/auth/register`, {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });
      setSuccess("Registration successful! You can now login.");
      setName("");
      setEmail("");
      setPassword("");

      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      {" "}
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow">
        {" "}
        <h1 className="mb-2 text-3xl font-bold"> Create Account </h1>{" "}
        <p className="mb-6 text-gray-600"> Register your account </p>{" "}
        <form onSubmit={handleSubmit} className="space-y-4">
          {" "}
          {/* Name */}{" "}
          <div>
            {" "}
            <label className="mb-1 block text-sm font-medium">
              {" "}
              Name{" "}
            </label>{" "}
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
              className="w-full rounded border px-3 py-2 outline-none focus:ring-2"
            />{" "}
          </div>{" "}
          {/* Email */}{" "}
          <div>
            {" "}
            <label className="mb-1 block text-sm font-medium">
              {" "}
              Email{" "}
            </label>{" "}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full rounded border px-3 py-2 outline-none focus:ring-2"
            />{" "}
          </div>{" "}
          {/* Password */}{" "}
          <div>
            {" "}
            <label className="mb-1 block text-sm font-medium">
              {" "}
              Password{" "}
            </label>{" "}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full rounded border px-3 py-2 outline-none focus:ring-2"
            />{" "}
          </div>{" "}
          {/* Error */}{" "}
          {error && (
            <p className="rounded bg-red-100 p-3 text-sm text-red-600">
              {" "}
              {error}{" "}
            </p>
          )}{" "}
          {/* Success */}{" "}
          {success && (
            <p className="rounded bg-green-100 p-3 text-sm text-green-600">
              {" "}
              {success}{" "}
            </p>
          )}{" "}
          {/* Submit */}{" "}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-black px-4 py-2 font-medium text-white disabled:opacity-50"
          >
            {" "}
            {loading ? "Creating Account..." : "Register"}{" "}
          </button>{" "}
        </form>{" "}
      </div>{" "}
    </main>
  );
}
