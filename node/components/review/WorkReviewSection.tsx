"use client";

import type { WorkReviewsResponse } from "@/types/review";

type WorkReviewSectionProps = {
  reviewData: WorkReviewsResponse;
  ownReviewId?: number;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
};

/**
 * 作品の評価集計と新着レビュー一覧を表示する。
 */
export function WorkReviewSection({
  reviewData,
  ownReviewId,
  onEdit,
  onDelete,
  isDeleting,
}: WorkReviewSectionProps) {
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">レビュー</h2>
          <p className="mt-2 text-sm text-slate-400">
            作品を観た感想を共有しましょう。
          </p>
        </div>

        <div className="rounded-xl bg-white/5 px-5 py-3 text-right">
          <p className="text-sm text-slate-400">平均評価</p>
          <p className="mt-1 text-xl font-bold text-amber-300">
            ★ {reviewData.averageRating.toFixed(1)}
            <span className="ml-2 text-sm font-normal text-slate-400">
              {reviewData.reviewCount}件
            </span>
          </p>
        </div>
      </div>

      {reviewData.reviews.length > 0 ? (
        <ul className="mt-6 space-y-4">
          {reviewData.reviews.map((review) => {
            const isOwnReview = review.id === ownReviewId;

            return (
              <li
                key={review.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold">
                    {review.userName}
                    {isOwnReview && (
                      <span className="ml-2 text-xs font-normal text-indigo-300">
                        自分のレビュー
                      </span>
                    )}
                  </p>

                  <div className="flex items-center gap-3">
                    <p className="text-sm font-semibold text-amber-300">
                      ★ {review.rating}.0
                    </p>

                    {isOwnReview && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={onEdit}
                          className="rounded-lg border border-indigo-400/60 px-3 py-1 text-xs font-semibold text-indigo-300 transition hover:bg-indigo-400 hover:text-slate-950"
                        >
                          編集
                        </button>
                        <button
                          type="button"
                          onClick={onDelete}
                          disabled={isDeleting}
                          className="rounded-lg border border-red-400/60 px-3 py-1 text-xs font-semibold text-red-300 transition hover:bg-red-400 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          削除
                        </button>
                      </div>
                    )}
                  </div>
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
            );
          })}
        </ul>
      ) : (
        <p className="mt-6 rounded-2xl bg-white/5 px-5 py-8 text-center text-slate-400">
          まだレビューはありません。最初のレビューを投稿してみましょう。
        </p>
      )}
    </>
  );
}
