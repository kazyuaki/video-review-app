import HeroSection from "@/components/home/HeroSection";
import WorkSection from "@/components/home/WorkSection";
import ReviewSection from "@/components/home/ReviewSection";
import type { Work } from "@/types/work";
import type { Review } from "@/components/home/ReviewCard";
import {
  getPopularMovies,
  getPopularTvShows,
  getTrendingWorks,
} from "@/lib/tmdb";
import { getRecentReviews } from "@/lib/reviews";

/**
 * 作品一覧表示用のダミーデータを生成する。
 * ランキング表示が必要な場合は順位情報を付与する。
 */
const createWorks = (prefix: string, count = 10, withRank = false): Work[] =>
  Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    title: `${prefix} ${index + 1}`,
    mediaType: "movie",
    ...(withRank && { rank: index + 1 }),
  }));

const recommendedWorks = createWorks("おすすめ作品");

/**
 * アプリケーションのトップページを表示する。
 */
export default async function Home() {
  const [popularMovies, popularTvShows, trendingWorks, recentReviewData] =
    await Promise.all([
      getPopularMovies(),
      getPopularTvShows(),
      getTrendingWorks(),
      getRecentReviews(),
    ]);

  const recentReviews: Review[] = recentReviewData.reviews.map((review) => ({
    id: review.id,
    user: review.userName,
    title: review.content,
    rating: review.rating,
  }));

  const workSections = [
    {
      title: "日本で配信中の人気映画",
      subtitle: "MOVIE RANKING",
      works: popularMovies,
      moreHref: "/works/rankings/movie",
    },
    {
      title: "日本で配信中の人気TVシリーズ",
      subtitle: "TV SERIES RANKING",
      works: popularTvShows,
      moreHref: "/works/rankings/tv",
    },
    {
      title: "世界で話題の作品",
      subtitle: "TRENDING WORKS",
      works: trendingWorks,
      moreHref: "/works/trending",
    },
    {
      title: "おすすめ作品",
      subtitle: "RECOMMENDED",
      works: recommendedWorks,
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white">
      {/* Hero */}
      <HeroSection />

      <div className="mx-auto flex max-w-7xl flex-col gap-20 px-6 pb-20">
        {/* Work Sections */}
        {workSections.map((section) => (
          <WorkSection
            key={section.subtitle}
            title={section.title}
            subtitle={section.subtitle}
            works={section.works}
            moreHref={section.moreHref}
          />
        ))}

        {/* Recent Reviews */}
        <ReviewSection reviews={recentReviews} />
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-sm text-slate-500">
        © 2026 Video Review App
      </footer>
    </main>
  );
}
