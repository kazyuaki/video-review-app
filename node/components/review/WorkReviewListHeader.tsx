import Link from "next/link";

type WorkReviewListHeaderProps = {
  workHref: string;
  title: string;
  averageRating: number;
  reviewCount: number;
};

/**
 * レビュー一覧の見出しと作品の評価集計を表示する。
 */
export function WorkReviewListHeader({
  workHref,
  title,
  averageRating,
  reviewCount,
}: WorkReviewListHeaderProps) {
  return (
    <>
      <Link
        href={workHref}
        className="text-sm font-semibold text-indigo-300 transition hover:text-indigo-200"
      >
        ← {title}の詳細へ戻る
      </Link>

      <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold tracking-widest text-indigo-300">
            REVIEWS
          </p>

          <h1 className="mt-2 text-3xl font-bold">{title}のレビュー</h1>
        </div>

        <div className="rounded-xl bg-white/5 px-5 py-3 text-right">
          <p className="text-sm text-slate-400">平均評価</p>

          <p className="mt-1 text-xl font-bold text-amber-300">
            ★ {averageRating.toFixed(1)}
            <span className="ml-2 text-sm font-normal text-slate-400">
              {reviewCount}件
            </span>
          </p>
        </div>
      </div>
    </>
  );
}
