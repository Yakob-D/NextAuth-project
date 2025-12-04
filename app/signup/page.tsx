/**
 * Signup page with email form and CTA, styled after provided reference.
 */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { signup } from "../services/auth";

type SignupForm = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
};

const roleOptions = [
  { label: "Candidate", value: "candidate" },
  { label: "Employer", value: "employer" },
];

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState<SignupForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "candidate",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const buttonLabel = useMemo(
    () => (loading ? "Creating account..." : "Continue"),
    [loading]
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!form.name.trim() || !form.email.trim()) {
      setError("Please fill in your name and email.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await signup({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
        role: form.role,
      });

      setSuccess("Account created. Please verify your email.");
      setTimeout(() => {
        router.push(`/verify/${encodeURIComponent(form.email.trim())}`);
      }, 400);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to create your account.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f6fb] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl bg-white border border-[#e6e8f2] rounded-[32px] shadow-[0_20px_60px_rgba(37,50,75,0.08)] p-8 md:p-12">
        <div className="flex justify-center mb-6">
          <h1 className="text-3xl md:text-4xl font-black text-[#25324b] text-center">
            Sign Up Today!
          </h1>
        </div>

        <div className="space-y-8">
          <button
            type="button"
            className="w-full border border-[#d1d6ed] rounded-xl py-3.5 px-4 flex items-center justify-center gap-3 text-[#1f1f23] font-semibold bg-[#f8f9ff] hover:bg-[#eef0ff] transition"
          >
            <FcGoogle size={22} />
            <span>Sign Up with Google</span>
          </button>

          <div className="flex items-center gap-6">
            <span className="h-px flex-1 bg-[#dbe0f0]" aria-hidden="true" />
            <span className="text-sm text-[#9aa1b8] font-semibold">
              Or Sign Up with Email
            </span>
            <span className="h-px flex-1 bg-[#dbe0f0]" aria-hidden="true" />
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block space-y-2 md:col-span-2">
                <span className="text-base font-semibold text-[#4a4f63]">
                  Full Name
                </span>
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                  className="w-full rounded-xl border border-[#d7d9e5] bg-[#fafbff] px-4 py-3 text-[#2a2f4f] placeholder:text-[#a0a3b4] focus:border-[#4640de] focus:ring-2 focus:ring-[#c6c2ff] outline-none transition"
                  placeholder="Enter your full name"
                />
              </label>

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
                  Role
                </span>
                <select
                  name="role"
                  value={form.role}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, role: e.target.value }))
                  }
                  className="w-full rounded-xl border border-[#d7d9e5] bg-[#fafbff] px-4 py-3 text-[#2a2f4f] focus:border-[#4640de] focus:ring-2 focus:ring-[#c6c2ff] outline-none transition"
                >
                  {roleOptions.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block space-y-2">
              <span className="text-base font-semibold text-[#4a4f63]">
                Password
              </span>
              <input
                type="password"
                name="password"
                autoComplete="new-password"
                value={form.password}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, password: e.target.value }))
                }
                required
                className="w-full rounded-xl border border-[#d7d9e5] bg-[#fafbff] px-4 py-3 text-[#2a2f4f] placeholder:text-[#a0a3b4] focus:border-[#4640de] focus:ring-2 focus:ring-[#c6c2ff] outline-none transition"
                placeholder="Enter password"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-base font-semibold text-[#4a4f63]">
                Confirm Password
              </span>
              <input
                type="password"
                name="confirmPassword"
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
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

          <p className="text-center text-sm text-[#6b7186]">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[#2f2785]">
              Login
            </Link>
          </p>

          <p className="text-xs text-center text-[#9aa1b8] leading-relaxed">
            By clicking &apos;Continue&apos;, you acknowledge that you have read
            and accepted our{" "}
            <span className="underline font-semibold">Terms of Service</span>{" "}
            and{" "}
            <span className="underline font-semibold">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
