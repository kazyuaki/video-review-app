"use client";

/**
 * アプリケーションでデータ取得などに失敗した場合のエラー画面を表示する。
 * ユーザーにエラーを通知し、再試行するための操作を提供する。
 */
export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-slate-950 px-6 text-white">
      <div className="max-w-lg text-center">
        <p className="text-6xl font-black tracking-wider text-indigo-400">
          ERROR
        </p>

        <h1 className="mt-6 text-2xl font-bold md:text-3xl">
          作品情報の取得に失敗しました
        </h1>

        <p className="mt-4 text-slate-400">
          一時的に作品情報を取得できませんでした。
          <br />
          時間をおいて再度お試しください。
        </p>

        <button
          type="button"
          onClick={reset}
          className="mt-8 rounded-xl bg-indigo-500 px-8 py-3 font-semibold text-white transition hover:bg-indigo-400"
        >
          再試行
        </button>
      </div>
    </main>
  );
}
