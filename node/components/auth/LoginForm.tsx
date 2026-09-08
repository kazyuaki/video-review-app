"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { FormField } from "@/components/auth/FormField";
import { api } from "@/lib/api";
import { parseApiError } from "@/lib/apiError";
import { validateRequiredFields } from "@/lib/validation";
import type { ValidationErrors } from "@/types/api";

/**
 * ログインフォームを表示し、ログインAPIへの送信を処理する。
 */
export function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrors({});
    setMessage("");

    const validationErrors = validateRequiredFields({
      email: { value: email.trim(), label: "メールアドレス" },
      password: { value: password, label: "パスワード" },
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      await api.get("/sanctum/csrf-cookie");

      await api.post("/api/login", {
        email,
        password,
      });

      router.push("/");
      router.refresh();
    } catch (error) {
      const apiError = parseApiError(
        error,
        "ログインに失敗しました。もう一度お試しください。",
      );

      setErrors(apiError.errors);
      setMessage(apiError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {message && (
        <p
          role="alert"
          className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
        >
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <FormField
          id="email"
          name="email"
          type="email"
          label="メールアドレス"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          placeholder="example@email.com"
          error={errors.email?.[0]}
        />

        <FormField
          id="password"
          name="password"
          type="password"
          label="パスワード"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          placeholder="パスワードを入力"
          error={errors.password?.[0]}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "ログイン中..." : "ログイン"}
        </button>
      </form>
    </>
  );
}
