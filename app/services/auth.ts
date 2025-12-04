const BASE_URL = "https://akil-backend.onrender.com";

type SignupPayload = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

type VerifyPayload = {
  email: string;
  OTP: string;
};

async function postJSON<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  let parsed: unknown = null;

  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    parsed = text;
  }

  const data = (parsed as { data?: unknown })?.data ?? parsed;

  if (!response.ok) {
    const errorMessage =
      (data as { message?: string; error?: string })?.message ||
      (data as { error?: string })?.error ||
      (typeof parsed === "string" && parsed) ||
      `Request failed with status ${response.status}`;

    throw new Error(errorMessage);
  }

  return data as T;
}

export async function signup(payload: SignupPayload) {
  return postJSON<{ message?: string; accessToken?: string }>("/signup", payload);
}

export async function login(payload: LoginPayload) {
  return postJSON<{
    message?: string;
    accessToken?: string;
    token?: string;
    data?: { accessToken?: string; token?: string };
  }>("/login", payload);
}

export async function verifyEmail(payload: VerifyPayload) {
  return postJSON<{ message?: string }>("/verify-email", payload);
}

export async function resendVerification(email: string) {
  return postJSON<{ message?: string }>("/verify-email/resend", { email });
}
