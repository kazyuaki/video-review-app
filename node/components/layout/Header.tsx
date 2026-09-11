"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

/**
 * アプリケーション共通のヘッダーを表示する。
 */
export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const hiddenPaths = ["/register", "/login"];

  if (hiddenPaths.includes(pathname)) {
    return null;
  }

  async function handleLogout(): Promise<void> {
    try {
      setIsLoggingOut(true);
      await logout();
      router.push("/");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 text-slate-100 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className=" flex items-center text-lg font-bold tracking-wide text-sky-400"
        >
          <Image
            src="/logo.svg"
            alt="Video Reviewのロゴ"
            width={40}
            height={40}
            priority
          />
          <span>Video Review</span>{" "}
        </Link>

        <nav aria-label="メインナビゲーション">
          {isLoading ? (
            <span className="text-sm text-slate-400">確認中...</span>
          ) : user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-300">{user.name}</span>

              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm transition hover:border-sky-400 hover:text-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoggingOut ? "ログアウト中..." : "ログアウト"}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-3 py-2 text-sm text-slate-300 transition hover:text-sky-400"
              >
                ログイン
              </Link>

              <Link
                href="/register"
                className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
              >
                会員登録
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
