import WorkCard from "@/components/home/WorkCard";
import WorkListPagination from "@/components/work/WorkListPagination";
import type { Work } from "@/types/work";

type WorkListPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  works: Work[];
  currentPage: number;
  totalPages: number;
  basePath: string;
};

/**
 * ランキング・話題の作品一覧画面の共通レイアウトを表示する。
 */
export default function WorkListPage({
  eyebrow,
  title,
  description,
  works,
  currentPage,
  totalPages,
  basePath,
}: WorkListPageProps) {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <p className="text-sm font-semibold tracking-widest text-indigo-300">
          {eyebrow}
        </p>

        <h1 className="mt-2 text-3xl font-bold">{title}</h1>

        <p className="mt-3 text-slate-400">{description}</p>

        {works.length > 0 ? (
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-[repeat(auto-fit,176px)] sm:justify-center sm:gap-4">
            {works.map((work) => (
              <WorkCard
                key={`${work.mediaType}-${work.id}`}
                work={work}
                fullWidth
              />
            ))}
          </div>
        ) : (
          <p className="mt-8 text-center text-slate-400">
            作品情報を取得できませんでした。
          </p>
        )}

        <WorkListPagination
          basePath={basePath}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </div>
    </main>
  );
}
