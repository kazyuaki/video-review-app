import WorkCard from "@/components/home/WorkCard";
import WorkSearchForm from "@/components/search/WorkSearchForm";
import WorkSearchFilter from "@/components/search/WorkSearchFilter";
import WorkSearchPagination from "@/components/search/WorkSearchPagination";
import WorkGenreFilter from "@/components/search/WorkGenreFilter";
import {
  getMovieGenres,
  getTvGenres,
  getWorksByGenre,
  searchWorks,
} from "@/lib/tmdb";

type WorkSearchPageProps = {
  searchParams: Promise<{
    query?: string;
    type?: string;
    genre?: string;
    page?: string;
  }>;
};

/**
 * 作品検索画面を表示する。
 * タイトルまたはジャンルに一致する映画・TVシリーズの検索結果を表示する。
 */
export default async function WorkSearchPage({
  searchParams,
}: WorkSearchPageProps) {
  // URLパラメータを検索条件として扱いやすい値に整える。
  const { query = "", type = "", genre = "", page = "1" } = await searchParams;
  const currentPageNumber =
    Number.isInteger(Number(page)) && Number(page) > 0 ? Number(page) : 1;

  // 映画・TVのジャンルをまとめ、同じIDのジャンルは1つにする。
  const [movieGenres, tvGenres] = await Promise.all([
    getMovieGenres(),
    getTvGenres(),
  ]);
  const genres = Array.from(
    new Map(
      [...movieGenres, ...tvGenres].map((genre) => [genre.id, genre]),
    ).values(),
  );
  const selectedGenre = genres.find((item) => String(item.id) === genre);

  // タイトル検索を優先し、タイトルがない場合だけジャンル検索を行う。
  const searchResult = query
    ? await searchWorks(query, type, currentPageNumber)
    : null;

  const genreResult =
    !query && selectedGenre
      ? await getWorksByGenre(Number(genre), type, currentPageNumber)
      : null;

  // 検索方法にかかわらず、表示側では同じ形式で結果を扱う。
  const works = searchResult?.works ?? genreResult?.works ?? [];
  const currentPage =
    searchResult?.currentPage ?? genreResult?.currentPage ?? 1;
  const totalPages = searchResult?.totalPages ?? genreResult?.totalPages ?? 1;
  const hasSearchCondition = Boolean(query || selectedGenre);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-widest text-indigo-300">
            SEARCH
          </p>

          <h1 className="mt-2 text-3xl font-bold">作品を探す</h1>

          <div className="mt-8">
            <h2 className="text-lg font-semibold">タイトルから探す</h2>

            <p className="mt-2 text-sm text-slate-400">
              映画やTVシリーズのタイトルを入力してください。
            </p>

            <WorkSearchForm initialKeyword={query} />
          </div>

          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-800" />
            <span className="text-sm text-slate-500">または</span>
            <div className="h-px flex-1 bg-slate-800" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">ジャンルから探す</h2>

            <p className="mt-2 text-sm text-slate-400">
              好きなジャンルを選択してください。
            </p>

            <WorkGenreFilter
              selectedType={type}
              selectedGenre={genre}
              genres={genres}
            />
          </div>
        </div>

        {hasSearchCondition && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold">
              {query
                ? `「${query}」の検索結果`
                : `「${selectedGenre?.name ?? "ジャンル"}」の作品`}
            </h2>

            <WorkSearchFilter
              query={query}
              selectedGenre={genre}
              selectedType={type}
            />

            <div className="mt-6 grid grid-cols-[repeat(auto-fit,176px)] justify-center gap-4">
              {works.map((work) => (
                <WorkCard key={`${work.mediaType}-${work.id}`} work={work} />
              ))}
            </div>

            <WorkSearchPagination
              query={query}
              selectedGenre={genre}
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
