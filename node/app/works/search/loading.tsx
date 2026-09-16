/**
 * 作品検索結果の取得中に表示するローディング画面。
 */
export default function WorkSearchLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <div className="text-center" role="status">
        <div
          aria-hidden="true"
          className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-indigo-400"
        />

        <p className="mt-4 text-slate-300">検索画面を読み込んでいます...</p>
      </div>
    </main>
  );
}
