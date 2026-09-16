"use client";

import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
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
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-1 text-base font-bold tracking-wide text-sky-400 sm:text-lg"
        >
          <Image
            src="/logo.svg"
            alt="Video Reviewのロゴ"
            width={36}
            height={36}
            priority
            className="sm:h-10 sm:w-10"
          />
          <span className="whitespace-nowrap max-[360px]:hidden">
            Video Review
          </span>
        </Link>

        <nav
          aria-label="メインナビゲーション"
          className="flex shrink-0 items-center gap-1 sm:gap-3"
        >
          <Link
            href="/works/search"
            aria-label="作品を検索"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-base text-slate-300 transition hover:bg-slate-800 hover:text-sky-400 sm:h-10 sm:w-10 sm:text-lg"
          >
            <Search size={20} />
          </Link>

          {isLoading ? (
            <span className="whitespace-nowrap text-xs text-slate-400 sm:text-sm">
              確認中...
            </span>
          ) : user ? (
            <div className="flex items-center gap-1 sm:gap-4">
              <span className="hidden text-sm text-slate-300 sm:inline">
                {user.name}
              </span>

              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="whitespace-nowrap rounded-lg border border-slate-700 px-2 py-2 text-xs transition hover:border-sky-400 hover:text-sky-400 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:text-sm"
              >
                {isLoggingOut ? "ログアウト中..." : "ログアウト"}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1 sm:gap-3">
              <Link
                href="/login"
                className="whitespace-nowrap px-2 py-2 text-xs text-slate-300 transition hover:text-sky-400 sm:px-3 sm:text-sm"
              >
                ログイン
              </Link>
              <Link
                href="/register"
                className="whitespace-nowrap rounded-lg bg-sky-500 px-3 py-2 text-xs font-semibold text-slate-950 transition hover:bg-sky-400 sm:px-4 sm:text-sm"
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
