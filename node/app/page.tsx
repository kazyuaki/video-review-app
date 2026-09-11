import HeroSection from "@/components/home/HeroSection";
import WorkSection from "@/components/home/WorkSection";
import ReviewSection from "@/components/home/ReviewSection";
import type { Work } from "@/components/home/WorkCard";
import type { Review } from "@/components/home/ReviewCard";

/**
 * 作品一覧表示用のダミーデータを生成する。
 * ランキング表示が必要な場合は順位情報を付与する。
 */
const createWorks = (prefix: string, count = 10, withRank = false): Work[] =>
  Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    title: `${prefix} ${index + 1}`,
    ...(withRank && { rank: index + 1 }),
  }));

const popularWorks = createWorks("人気作品", 10, true);
const trendingDramas = createWorks("話題のドラマ");
const recommendedWorks = createWorks("おすすめ作品");

const recentReviews: Review[] = [
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

const workSections = [
  {
    title: "人気作品",
    subtitle: "POPULAR",
    works: popularWorks,
  },
  {
    title: "話題のドラマ",
    subtitle: "TRENDING TV",
    works: trendingDramas,
  },
  {
    title: "おすすめ作品",
    subtitle: "RECOMMENDED",
    works: recommendedWorks,
  },
];

/**
 * アプリケーションのトップページを表示する。
 */
export default function Home() {
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
