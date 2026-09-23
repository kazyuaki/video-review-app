import { notFound } from "next/navigation";
import { getWorkDetail } from "@/lib/tmdb";
import type { WorkMediaType } from "@/types/work";
import { WorkReviewArea } from "@/components/review/WorkReviewArea";
import { getWorkReviews } from "@/lib/reviews";
import { WorkDetailHero } from "@/components/work-detail/WorkDetailHero";
import { WorkCastSection } from "@/components/work-detail/WorkCastSection";
import { WorkStreamingSection } from "@/components/work-detail/WorkStreamingSection";


type WorkDetailPageProps = {
  params: Promise<{
    mediaType: string;
    id: string;
  }>;
};
/**
 * 作品詳細画面を表示する。
 * 映画またはTVシリーズの詳細情報と配信サービス情報を表示する。
 */
export default async function WorkDetailPage({ params }: WorkDetailPageProps) {
  const { mediaType, id } = await params;
  const workId = Number(id);

  // URLで指定された作品種別とIDが正しい形式か確認する。
  if (
    (mediaType !== "movie" && mediaType !== "tv") ||
    !Number.isInteger(workId) ||
    workId <= 0
  ) {
    notFound();
  }

  const workMediaType = mediaType as WorkMediaType;

  const [work, reviewData] = await Promise.all([
    getWorkDetail(workId, workMediaType),
    getWorkReviews(workMediaType, workId),
  ]);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <WorkDetailHero work={work} />

      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <WorkCastSection cast={work.cast} />

        <WorkStreamingSection
          streamingServices={work.streamingServices}
        />

        <WorkReviewArea
          mediaType={work.mediaType}
          tmdbId={work.id}
          title={work.title}
          reviewData={reviewData}
        />
      </div>
    </main>
  );
}
