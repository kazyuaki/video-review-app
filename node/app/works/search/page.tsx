import WorkCard from "@/components/home/WorkCard";
import WorkSearchForm from "@/components/search/WorkSearchForm";
import { searchWorks } from "@/lib/tmdb";

type WorkSearchPageProps = {
  searchParams: Promise<{
    query?: string;
  }>;
};

/**
 * 作品検索画面を表示する。
 * キーワードに一致する映画・TVシリーズの検索結果を表示する。
 */
export default async function WorkSearchPage({
  searchParams,
}: WorkSearchPageProps) {
  const { query = "" } = await searchParams;

  const works = query ? await searchWorks(query) : [];

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

            <div className="mt-6 grid grid-cols-[repeat(auto-fit,176px)] justify-center gap-4">
              {works.map((work) => (
                <WorkCard key={work.id} work={work} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
