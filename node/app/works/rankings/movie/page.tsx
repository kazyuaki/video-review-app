import WorkListPage from "@/components/work/WorkListPage";
import { getPopularMoviesPage } from "@/lib/tmdb";

type MovieRankingPageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

/**
 * 映画ランキング一覧画面を表示する。
 */
export default async function MovieRankingPage({
  searchParams,
}: MovieRankingPageProps) {
  const { page = "1" } = await searchParams;
  const currentPage =
    Number.isInteger(Number(page)) && Number(page) > 0 ? Number(page) : 1;

  const result = await getPopularMoviesPage(currentPage);

  return (
    <WorkListPage
      eyebrow="MOVIE RANKING"
      title="日本で配信中の人気映画"
      description="日本で定額・無料・広告付き配信されている映画を人気順に表示します。"
      works={result.works}
      currentPage={result.currentPage}
      totalPages={result.totalPages}
      basePath="/works/rankings/movie"
    />
  );
}
