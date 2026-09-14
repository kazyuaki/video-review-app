import Link from "next/link";

type WorkSearchPaginationProps = {
  query: string;
  selectedType?: string;
  currentPage: number;
  totalPages: number;
};

/**
 * 作品検索結果のページネーションを表示する。
 * 現在の検索条件を保持したまま、前後のページへ移動する。
 */
export default function WorkSearchPagination({
  query,
  selectedType = "",
  currentPage,
  totalPages,
}: WorkSearchPaginationProps) {
  /**
   * 検索条件を保持したページURLを生成する。
   */
  const createPageHref = (page: number) => {
    const params = new URLSearchParams({
      query,
      page: String(page),
    });

    if (selectedType) {
      params.set("type", selectedType);
    }

    return `/works/search?${params.toString()}`;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      aria-label="検索結果のページネーション"
      className="mt-10 flex items-center justify-center gap-4"
    >
      {currentPage > 1 && (
        <Link
          href={createPageHref(currentPage - 1)}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:border-indigo-400 hover:text-white"
        >
          ← 前へ
        </Link>
      )}

      <span className="text-sm text-slate-400">
        {currentPage} / {totalPages}
      </span>

      {currentPage < totalPages && (
        <Link
          href={createPageHref(currentPage + 1)}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:border-indigo-400 hover:text-white"
        >
          次へ →
        </Link>
      )}
    </nav>
  );
}
