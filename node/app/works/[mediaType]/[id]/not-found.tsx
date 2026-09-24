import Link from "next/link";

/**
 * 指定された作品が存在しない場合の画面を表示する。
 */
export default function NotFound() {
  return (
    <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-slate-950 px-6 text-white">
      <div className="max-w-lg text-center">
        <h1 className="text-2xl font-bold md:text-3xl">
          作品が見つかりません
        </h1>

        <p className="mt-4 text-slate-400">
          指定された作品は存在しないか、削除された可能性があります。
        </p>

        <Link
          href="/works/search"
          className="mt-8 inline-flex rounded-xl bg-indigo-500 px-8 py-3 font-semibold text-white transition hover:bg-indigo-400"
        >
          作品を探す
        </Link>
      </div>
    </main>
  );
}
