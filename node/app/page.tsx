import Link from "next/link";

const popularWorks = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  title: `人気作品 ${index + 1}`,
  rank: index + 1,
}));

const trendingDramas = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  title: `話題のドラマ ${index + 1}`,
}));

const recommendedWorks = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  title: `おすすめ作品 ${index + 1}`,
}));

const recentReviews = [
  {
    id: 1,
    user: "User A",
    title: "最後まで一気に観てしまいました",
    rating: 5,
  },
  {
    id: 2,
    user: "User B",
    title: "映像と音楽がすごく良かったです",
    rating: 4,
  },
  {
    id: 3,
    user: "User C",
    title: "また観返したくなる作品でした",
    rating: 5,
  },
];

type Work = {
  id: number;
  title: string;
  rank?: number;
};

function WorkSection({
  title,
  subtitle,
  works,
}: {
  title: string;
  subtitle: string;
  works: Work[];
}) {
  return (
    <section>
      {/* Section Title */}
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-sm font-semibold tracking-widest text-indigo-300">
            {subtitle}
          </p>

          <h2 className="mt-2 text-2xl font-bold text-white">{title}</h2>
        </div>

        <Link
          href="/works/search"
          className="text-sm font-semibold text-indigo-300 transition hover:text-indigo-200"
        >
          もっと見る →
        </Link>
      </div>

      {/* Work List */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {works.map((work) => (
          <article
            key={work.id}
            className="group relative w-44 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:bg-white/10"
          >
            <div className="relative flex aspect-[2/3] items-center justify-center bg-gradient-to-br from-indigo-500/30 to-purple-500/20">
              <span className="text-4xl">🎬</span>

              {work.rank && (
                <span className="absolute bottom-2 left-3 text-5xl font-black text-white/90 drop-shadow-lg">
                  {work.rank}
                </span>
              )}
            </div>

            <div className="p-4">
              <h3 className="truncate font-semibold text-white">
                {work.title}
              </h3>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/**
 * アプリケーションのトップページを表示する。
 */
export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 text-center sm:py-32">
          <p className="mb-4 text-sm font-semibold tracking-widest text-indigo-300">
            FIND YOUR NEXT FAVORITE
          </p>

          <h1 className="mx-auto max-w-4xl text-[26px] font-bold leading-tight tracking-tight sm:text-6xl">
            観た作品を記録して、
            <span className="mt-2 block whitespace-nowrap bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-[26px] text-transparent sm:text-6xl">
              感想をみんなと共有しよう
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            映画やドラマを検索して、鑑賞記録やレビューを残せる
            動画鑑賞管理アプリです。
          </p>

          <Link
            href="/works/search"
            className="mt-10 inline-flex rounded-2xl bg-white px-7 py-3.5 font-semibold text-slate-900 shadow-xl transition hover:-translate-y-0.5 hover:bg-slate-100"
          >
            作品を探す →
          </Link>
        </div>
      </section>

      <div className="mx-auto flex max-w-7xl flex-col gap-20 px-6 pb-20">
        {/* Popular Works */}
        <WorkSection title="人気作品" subtitle="POPULAR" works={popularWorks} />

        {/* Trending Dramas */}
        <WorkSection
          title="話題のドラマ"
          subtitle="TRENDING TV"
          works={trendingDramas}
        />

        {/* Recommended Works */}
        <WorkSection
          title="おすすめ作品"
          subtitle="RECOMMENDED"
          works={recommendedWorks}
        />

        {/* Recent Reviews */}
        <section>
          <div className="mb-8">
            <p className="text-sm font-semibold tracking-widest text-indigo-300">
              RECENT REVIEWS
            </p>

            <h2 className="mt-2 text-2xl font-bold">新着レビュー</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {recentReviews.map((review) => (
              <article
                key={review.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:bg-white/10"
              >
                <div className="text-amber-300">
                  {"★".repeat(review.rating)}

                  <span className="text-slate-600">
                    {"★".repeat(5 - review.rating)}
                  </span>
                </div>

                <p className="mt-4 font-semibold">{review.title}</p>

                <p className="mt-3 text-sm text-slate-400">{review.user}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-sm text-slate-500">
        © 2026 Video Review App
      </footer>
    </main>
  );
}
