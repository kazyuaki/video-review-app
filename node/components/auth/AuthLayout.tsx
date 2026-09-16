import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type AuthLayoutProps = {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
};

/**
 * 会員登録・ログイン画面で共通するレイアウトを表示する。
 */
export function AuthLayout({
  title,
  description,
  children,
  footer,
}: AuthLayoutProps) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-4 py-6 sm:py-12">
      <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-indigo-500/30 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-purple-500/30 blur-3xl" />

      <div className="relative w-full max-w-md rounded-2xl border border-white/20 bg-white/95 p-5 shadow-2xl backdrop-blur sm:rounded-3xl sm:p-10">
        <div className="mb-6 text-center sm:mb-8">
          <Link
            href="/"
            className="mb-4 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 transition hover:text-indigo-500"
          >
            ← トップページへ戻る
          </Link>

          <Image
            src="/logo.svg"
            alt="Video Review App"
            width={56}
            height={56}
            priority
            className="mx-auto mb-3 rounded-xl shadow-lg shadow-indigo-500/30 sm:mb-4 sm:h-[72px] sm:w-[72px] sm:rounded-2xl"
          />

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {title}
          </h1>

          <p className="mt-2 text-sm text-slate-500">{description}</p>
        </div>

        {children}

        <div className="mt-7 text-center text-xs text-slate-500 sm:text-sm">
          {footer}
        </div>

        <p className="mt-8 text-center text-xs text-slate-500">
          © 2026 Video Review App
        </p>
      </div>
    </main>
  );
}
