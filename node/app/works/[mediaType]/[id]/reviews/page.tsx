import Link from "next/link";
import { notFound } from "next/navigation";
import { WorkReviewList } from "@/components/review/WorkReviewList";
import { getWorkReviews } from "@/lib/reviews";
import { getWorkDetail } from "@/lib/tmdb";
import type { WorkMediaType } from "@/types/work";

type WorkReviewListPageProps = {
  params: Promise<{
    mediaType: string;
    id: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
};

/**
 * 作品に投稿されたレビューを、ページ単位で一覧表示する。
 */
export default async function WorkReviewListPage({
  params,
  searchParams,
}: WorkReviewListPageProps) {
  const { mediaType, id } = await params;
  const { page = "1" } = await searchParams;

  const tmdbId = Number(id);
  const pageNumber = Number(page);
  const currentPage =
    Number.isInteger(pageNumber) && pageNumber > 0 ? pageNumber : 1;

  if (
    (mediaType !== "movie" && mediaType !== "tv") ||
    !Number.isInteger(tmdbId) ||
    tmdbId <= 0
  ) {
    notFound();
  }

  const workMediaType = mediaType as WorkMediaType;

  const [work, reviewData] = await Promise.all([
    getWorkDetail(tmdbId, workMediaType),
    getWorkReviews(workMediaType, tmdbId, currentPage),
  ]);

  const createPageHref = (targetPage: number) =>
    `/works/${mediaType}/${id}/reviews?page=${targetPage}`;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <Link
          href={`/works/${mediaType}/${id}`}
          className="text-sm font-semibold text-indigo-300 transition hover:text-indigo-200"
        >
          ← {work.title}の詳細へ戻る
        </Link>

        <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold tracking-widest text-indigo-300">
              REVIEWS
            </p>

            <h1 className="mt-2 text-3xl font-bold">{work.title}のレビュー</h1>
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

        <section className="mt-8">
          <WorkReviewList reviews={reviewData.reviews} />
        </section>

        {reviewData.totalPages > 1 && (
          <nav
            aria-label="レビュー一覧のページネーション"
            className="mt-10 flex items-center justify-center gap-4"
          >
            {reviewData.currentPage > 1 && (
              <Link
                href={createPageHref(reviewData.currentPage - 1)}
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:border-indigo-400 hover:text-white"
              >
                ← 前へ
              </Link>
            )}

            <span className="text-sm text-slate-400">
              {reviewData.currentPage} / {reviewData.totalPages}
            </span>

            {reviewData.currentPage < reviewData.totalPages && (
              <Link
                href={createPageHref(reviewData.currentPage + 1)}
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:border-indigo-400 hover:text-white"
              >
                次へ →
              </Link>
            )}
          </nav>
        )}
      </div>
    </main>
  );
}
