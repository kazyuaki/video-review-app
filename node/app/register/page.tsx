"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { api } from "@/lib/api";

type ValidationErrors = Record<string, string[]>;

type ErrorResponse = {
  message: string;
  errors?: ValidationErrors;
};

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrors({});
    setMessage("");
    setIsSubmitting(true);

    try {
      await api.get("/sanctum/csrf-cookie");

      await api.post("/api/register", {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      router.push("/");
    } catch (error) {
      if (axios.isAxiosError<ErrorResponse>(error)) {
        setErrors(error.response?.data.errors ?? {});
        setMessage(
          error.response?.data.message ??
            "会員登録に失敗しました。もう一度お試しください。",
        );
      } else {
        setMessage("予期しないエラーが発生しました。");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-4 py-12">
      <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-indigo-500/30 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-purple-500/30 blur-3xl" />

      <div className="relative w-full max-w-md rounded-3xl border border-white/20 bg-white/95 p-8 shadow-2xl backdrop-blur sm:p-10">
        <div className="mb-8 text-center">
          <Link
            href="/"
            aria-label="トップページへ戻る"
            className="mx-auto mb-4 block w-fit"
          >
            <Image
              src="/logo.svg"
              alt="Video Review App"
              width={72}
              height={72}
              priority
              className="rounded-2xl shadow-lg shadow-indigo-500/30"
            />
          </Link>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            会員登録
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            観た作品とレビューを記録しましょう
          </p>
        </div>

        {message && (
          <p
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              ユーザー名
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              placeholder="山田 太郎"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            />

            {errors.name && (
              <p className="mt-1.5 text-sm text-red-600">{errors.name[0]}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              メールアドレス
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              placeholder="example@email.com"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            />

            {errors.email && (
              <p className="mt-1.5 text-sm text-red-600">{errors.email[0]}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              パスワード
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              placeholder="8文字以上で入力"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            />

            {errors.password && (
              <p className="mt-1.5 text-sm text-red-600">
                {errors.password[0]}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password_confirmation"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              確認用パスワード
            </label>

            <input
              id="password_confirmation"
              name="password_confirmation"
              type="password"
              value={passwordConfirmation}
              onChange={(event) => setPasswordConfirmation(event.target.value)}
              autoComplete="new-password"
              placeholder="もう一度入力してください"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "登録中..." : "アカウントを作成"}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-slate-500">
          すでにアカウントをお持ちですか？
          <Link
            href="/login"
            className="ml-1 font-semibold text-indigo-600 transition hover:text-indigo-500"
          >
            ログイン
          </Link>
        </p>
        <p className="mt-8 text-center text-xs text-slate-500">
          © 2026 Video Review App
        </p>
      </div>
    </main>
  );
}
