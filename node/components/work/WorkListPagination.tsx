import Link from "next/link";

type WorkListPaginationProps = {
  basePath: string;
  currentPage: number;
  totalPages: number;
};

/**
 * 作品一覧画面のページネーションを表示する。
 */
export default function WorkListPagination({
  basePath,
  currentPage,
  totalPages,
}: WorkListPaginationProps) {
  const createPageHref = (page: number) => `${basePath}?page=${page}`;

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      aria-label="作品一覧のページネーション"
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
