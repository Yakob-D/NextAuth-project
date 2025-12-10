"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { login } from "../services/auth";

type LoginForm = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const buttonLabel = useMemo(
    () => (loading ? "Logging in..." : "Login"),
    [loading]
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!form.email.trim() || !form.password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      const response = await login({
        email: form.email.trim(),
        password: form.password,
      });

      const token =
        response.data?.accessToken ??
        response.data?.token ??
        response.accessToken ??
        response.token;

      if (token) {
        localStorage.setItem("accessToken", token);
      }

      setSuccess("Login successful.");
      setTimeout(() => router.push("/"), 500);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to login right now.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f6fb] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="hidden md:block h-full">
          <div className="h-full w-full rounded-[32px] bg-gradient-to-br from-[#eef0ff] via-[#f8f9ff] to-[#eef3ff] border border-[#e3e7ff] shadow-inner" />
        </div>

        <div className="bg-white border border-[#e6e8f2] rounded-[32px] shadow-[0_20px_60px_rgba(37,50,75,0.08)] p-10 md:p-12">
          <div className="flex justify-center">
            <h1 className="text-3xl md:text-4xl font-black text-[#25324b]">
              Welcome Back,
            </h1>
          </div>

          <div className="flex items-center gap-6 my-8">
            <span className="h-px flex-1 bg-[#dbe0f0]" aria-hidden="true" />
            <span className="text-sm text-[#9aa1b8] font-semibold">
              Login
            </span>
            <span className="h-px flex-1 bg-[#dbe0f0]" aria-hidden="true" />
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <label className="block space-y-2">
              <span className="text-base font-semibold text-[#4a4f63]">
                Email Address
              </span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, email: e.target.value }))
                }
                required
                className="w-full rounded-xl border border-[#d7d9e5] bg-[#fafbff] px-4 py-3 text-[#2a2f4f] placeholder:text-[#a0a3b4] focus:border-[#4640de] focus:ring-2 focus:ring-[#c6c2ff] outline-none transition"
                placeholder="Enter email address"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-base font-semibold text-[#4a4f63]">
                Password
              </span>
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                value={form.password}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, password: e.target.value }))
                }
                required
                className="w-full rounded-xl border border-[#d7d9e5] bg-[#fafbff] px-4 py-3 text-[#2a2f4f] placeholder:text-[#a0a3b4] focus:border-[#4640de] focus:ring-2 focus:ring-[#c6c2ff] outline-none transition"
                placeholder="Enter password"
              />
            </label>

            {error ? (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
                {error}
              </p>
            ) : null}

            {success ? (
              <p className="text-sm text-green-700 bg-green-50 border border-green-100 px-3 py-2 rounded-lg">
                {success}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#2f2785] text-white font-semibold py-3.5 shadow-[0_14px_28px_rgba(70,64,222,0.22)] transition hover:bg-[#26206f] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {buttonLabel}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#6b7186]">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-semibold text-[#2f2785]">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
