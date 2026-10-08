import { notFound } from "next/navigation";
import { WorkReviewList } from "@/components/review/WorkReviewList";
import { getWorkReviews } from "@/lib/reviews";
import { getWorkDetail } from "@/lib/tmdb";
import { WorkReviewListHeader } from "@/components/review/WorkReviewListHeader";
import { WorkReviewPagination } from "@/components/review/WorkReviewPagination";

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

  const [work, reviewData] = await Promise.all([
    getWorkDetail(tmdbId, mediaType),
    getWorkReviews(mediaType, tmdbId, currentPage),
  ]);

  const workHref = `/works/${mediaType}/${id}`;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <WorkReviewListHeader
          workHref={workHref}
          title={work.title}
          averageRating={reviewData.averageRating}
          reviewCount={reviewData.reviewCount}
        />

        <section className="mt-8">
          <WorkReviewList reviews={reviewData.reviews} />
        </section>

        <WorkReviewPagination
          basePath={`${workHref}/reviews`}
          currentPage={reviewData.currentPage}
          totalPages={reviewData.totalPages}
        />
      </div>
    </main>
  );
}
