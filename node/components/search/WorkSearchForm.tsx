"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * 作品検索用の入力フォームを表示する。
 * 入力されたキーワードをクエリパラメーターに設定して検索する。
 */
export default function WorkSearchForm({
  initialKeyword = "",
}: {
  initialKeyword?: string;
}) {
  const router = useRouter();
  const [keyword, setKeyword] = useState(initialKeyword);

  /**
   * 入力されたキーワードで作品検索画面へ遷移する。
   */
  const handleSearch = () => {
    const trimmedKeyword = keyword.trim();

    if (!trimmedKeyword) {
      return;
    }

    router.push(`/works/search?query=${encodeURIComponent(trimmedKeyword)}`);
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleSearch();
      }}
      className="mt-8 flex gap-3"
    >
      <input
        type="text"
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
        placeholder="作品名を入力"
        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-400"
      />

      <button
        type="submit"
        className="shrink-0 rounded-xl bg-indigo-500 px-6 py-3 font-semibold text-white transition hover:bg-indigo-400"
      >
        検索
      </button>
    </form>
  );
}
