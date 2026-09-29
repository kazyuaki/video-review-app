import type { WorkReview } from "@/types/review";

type WorkReviewListProps = {
  reviews: WorkReview[];
};

/**
 * 作品に投稿されたレビュー一覧を表示する。
 */
export function WorkReviewList({ reviews }: WorkReviewListProps) {
  if (reviews.length === 0) {
    return (
      <p className="rounded-2xl bg-white/5 px-5 py-8 text-center text-slate-400">
        まだレビューはありません。
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {reviews.map((review) => (
        <li
          key={review.id}
          className="rounded-2xl border border-white/10 bg-white/5 p-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-semibold">{review.userName}</p>

            <p className="text-sm font-semibold text-amber-300">
              ★ {review.rating}.0
            </p>
          </div>

          {review.hasSpoiler ? (
            <details className="mt-4 text-sm text-slate-300">
              <summary className="cursor-pointer text-indigo-300">
                ネタバレを含むレビューを表示
              </summary>

              <p className="mt-3 whitespace-pre-line leading-7">
                {review.content}
              </p>
            </details>
          ) : (
            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-300">
              {review.content}
            </p>
          )}

          <p className="mt-4 text-xs text-slate-500">
            {new Intl.DateTimeFormat("ja-JP", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }).format(new Date(review.createdAt))}
          </p>
        </li>
      ))}
    </ul>
  );
}
