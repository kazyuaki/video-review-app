import WorkListPage from "@/components/work/WorkListPage";
import { getPopularTvShowsPage } from "@/lib/tmdb";

type TvRankingPageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

/**
 * TVシリーズランキング一覧画面を表示する。
 */
export default async function TvRankingPage({
  searchParams,
}: TvRankingPageProps) {
  const { page = "1" } = await searchParams;
  const currentPage =
    Number.isInteger(Number(page)) && Number(page) > 0 ? Number(page) : 1;

  const result = await getPopularTvShowsPage(currentPage);

  return (
    <WorkListPage
      eyebrow="TV SERIES RANKING"
      title="TVシリーズランキング"
      description="TMDBで人気のTVシリーズをランキング形式で表示します。"
      works={result.works}
      currentPage={result.currentPage}
      totalPages={result.totalPages}
      basePath="/works/rankings/tv"
    />
  );
}
