import Link from "next/link";

const WORK_SEARCH_PATH = "/works/search";

/**
 * トップページのヒーローセクションを表示する。
 * アプリの概要と作品検索画面への導線を提供する。
 */
export default function HeroSection() {
  return (
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
          href={WORK_SEARCH_PATH}
          className="mt-10 inline-flex rounded-2xl bg-white px-7 py-3.5 font-semibold text-slate-900 shadow-xl transition hover:-translate-y-0.5 hover:bg-slate-100"
        >
          作品を探す →
        </Link>
      </div>
    </section>
  );
}
