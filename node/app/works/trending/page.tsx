import WorkListPage from "@/components/work/WorkListPage";
import { getTrendingWorksPage } from "@/lib/tmdb";

type TrendingWorksPageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

/**
 * 話題の作品一覧画面を表示する。
 */
export default async function TrendingWorksPage({
  searchParams,
}: TrendingWorksPageProps) {
  const { page = "1" } = await searchParams;
  const currentPage =
    Number.isInteger(Number(page)) && Number(page) > 0 ? Number(page) : 1;

  const result = await getTrendingWorksPage(currentPage);

  return (
    <WorkListPage
      eyebrow="TRENDING WORKS"
      title="話題の作品"
      description="TMDBで話題の映画・TVシリーズを表示します。"
      works={result.works}
      currentPage={result.currentPage}
      totalPages={result.totalPages}
      basePath="/works/trending"
    />
  );
}
