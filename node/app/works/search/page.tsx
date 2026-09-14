import WorkCard from "@/components/home/WorkCard";
import WorkSearchForm from "@/components/search/WorkSearchForm";
import WorkSearchFilter from "@/components/search/WorkSearchFilter";
import { searchWorks } from "@/lib/tmdb";
import WorkSearchPagination from "@/components/search/WorkSearchPagination";

type WorkSearchPageProps = {
  searchParams: Promise<{
    query?: string;
    type?: string;
    page?: string;
  }>;
};

/**
 * 作品検索画面を表示する。
 * キーワードに一致する映画・TVシリーズの検索結果を表示する。
 */
export default async function WorkSearchPage({
  searchParams,
}: WorkSearchPageProps) {
  const { query = "", type = "", page = "1" } = await searchParams;

  const currentPageNumber =
    Number.isInteger(Number(page)) && Number(page) > 0 ? Number(page) : 1;

  const searchResult = query
    ? await searchWorks(query, type, currentPageNumber)
    : {
        works: [],
        currentPage: 1,
        totalPages: 1,
    };

  const { works, currentPage, totalPages } = searchResult;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-widest text-indigo-300">
            SEARCH
          </p>

          <h1 className="mt-2 text-3xl font-bold">作品を探す</h1>

          <p className="mt-3 text-slate-400">
            映画やTVシリーズのタイトルを入力して検索できます。
          </p>

          <WorkSearchForm initialKeyword={query} />
        </div>

        {query && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold">「{query}」の検索結果</h2>

            <WorkSearchFilter query={query} selectedType={type} />

            <div className="mt-6 grid grid-cols-[repeat(auto-fit,176px)] justify-center gap-4">
              {works.map((work) => (
                <WorkCard key={work.id} work={work} />
              ))}
            </div>

            <WorkSearchPagination
              query={query}
              selectedType={type}
              currentPage={currentPage}
              totalPages={totalPages}
            />
          </section>
        )}
      </div>
    </main>
  );
}
