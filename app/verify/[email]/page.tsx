/**
 * Verify email page with OTP inputs and resend control.
 */
"use client";

import {
  FormEvent,
  KeyboardEvent,
  use,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { resendVerification, verifyEmail } from "../../services/auth";

type VerifyPageProps = {
  params: Promise<{ email: string }>;
};

const OTP_LENGTH = 4;

export default function VerifyPage({ params }: VerifyPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const decodedEmail = useMemo(
    () => decodeURIComponent(resolvedParams.email),
    [resolvedParams.email]
  );
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [timeLeft, setTimeLeft] = useState(30);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const otpValue = useMemo(() => digits.join(""), [digits]);
  const canResend = timeLeft === 0 && !resending;
  const formattedTime = useMemo(
    () => `0:${timeLeft.toString().padStart(2, "0")}`,
    [timeLeft]
  );

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timeLeft === 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;

    const nextDigits = [...digits];
    nextDigits[index] = value;
    setDigits(nextDigits);

    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      const prev = inputsRef.current[index - 1];
      prev?.focus();
      prev?.select();
    }

    if (event.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }

    if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (otpValue.length < OTP_LENGTH) {
      setError("Please enter the full verification code.");
      return;
    }

    try {
      setLoading(true);
      await verifyEmail({ email: decodedEmail, OTP: otpValue });
      setSuccess("Email verified successfully. Redirecting...");
      setTimeout(() => router.push("/login"), 700);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to verify the code. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setError(null);
    setSuccess(null);
    try {
      setResending(true);
      await resendVerification(decodedEmail);
      setTimeLeft(30);
      setSuccess("A new code has been sent to your email.");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to resend the code right now.";
      setError(message);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f7fb] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl bg-white border border-[#e6e8f2] rounded-[32px] shadow-[0_20px_60px_rgba(37,50,75,0.08)] p-8 md:p-12 text-center">
        <h1 className="text-3xl font-black text-[#25324b] mb-4">Verify Email</h1>
        <p className="text-[#7c829a] max-w-xl mx-auto">
          We&apos;ve sent a verification code to the email address you provided. To
          complete the verification process, please enter the code here.
        </p>

        <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
          <div className="flex justify-center gap-4">
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputsRef.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-14 h-14 md:w-16 md:h-16 rounded-lg border-2 border-[#bfbdf8] bg-[#f8f8ff] text-center text-2xl font-semibold text-[#a1a0d4] focus:border-[#4640de] focus:ring-2 focus:ring-[#c6c2ff] outline-none"
                aria-label={`Verification code digit ${index + 1}`}
              />
            ))}
          </div>

          <div className="text-sm text-[#8b90a6]">
            You can request to{" "}
            <button
              type="button"
              disabled={!canResend}
              onClick={handleResend}
              className="font-semibold text-[#322cc0] disabled:text-[#aeb3cc] disabled:cursor-not-allowed"
            >
              Resend code
            </button>{" "}
            in <span className="font-semibold text-[#2f2785]">{formattedTime}</span>
            {resending ? <span className="ml-2 text-[#6b7186]">Sending...</span> : null}
          </div>

          {error ? (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg max-w-lg mx-auto">
              {error}
            </p>
          ) : null}

          {success ? (
            <p className="text-sm text-green-700 bg-green-50 border border-green-100 px-3 py-2 rounded-lg max-w-lg mx-auto">
              {success}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-3/4 mx-auto rounded-full bg-[#c2c0f6] text-white font-semibold py-3.5 transition hover:bg-[#b1aef4] shadow-[0_14px_28px_rgba(70,64,222,0.18)] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
