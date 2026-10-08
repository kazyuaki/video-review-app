import Image from "next/image";
import Link from "next/link";
import type { ViewingRecord } from "@/types/viewingRecord";

type ViewingRecordCardProps = {
  viewingRecord: ViewingRecord;
  onDelete: () => void;
};

const statusLabels = {
  want_to_watch: "観たい",
  watching: "視聴中",
  watched: "視聴済み",
  dropped: "中断",
} as const;

const TMDB_IMAGE_URL = "https://image.tmdb.org/t/p/w500";

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

/**
 * マイリスト内の作品と視聴記録をカード形式で表示する。
 */
export function ViewingRecordCard({
  viewingRecord,
  onDelete,
}: ViewingRecordCardProps) {
  return (
    <li className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex gap-4">
        <Link
          href={`/works/${viewingRecord.work.mediaType}/${viewingRecord.work.tmdbId}`}
          className="relative flex h-32 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-indigo-500/30 to-purple-500/20"
        >
          {viewingRecord.work.posterPath ? (
            <Image
              src={`${TMDB_IMAGE_URL}${viewingRecord.work.posterPath}`}
              alt={`${viewingRecord.work.title}のポスター`}
              fill
              sizes="80px"
              className="object-cover"
            />
          ) : (
            <span className="text-3xl" aria-hidden="true">
              🎬
            </span>
          )}
        </Link>

        <div className="min-w-0 flex-1">
          <Link
            href={`/works/${viewingRecord.work.mediaType}/${viewingRecord.work.tmdbId}`}
            className="block truncate text-lg font-bold transition hover:text-indigo-300"
          >
            {viewingRecord.work.title}
          </Link>

          <p className="mt-3 font-semibold text-indigo-300">
            {statusLabels[viewingRecord.status]}
          </p>

          {viewingRecord.vodService && (
            <p className="mt-2 text-sm text-slate-300">
              {viewingRecord.vodService}
            </p>
          )}

          {viewingRecord.startedAt && (
            <p className="mt-2 text-sm text-slate-400">
              視聴開始日: {formatDate(viewingRecord.startedAt)}
            </p>
          )}

          {viewingRecord.watchedAt && (
            <p className="mt-1 text-sm text-slate-400">
              視聴完了日: {formatDate(viewingRecord.watchedAt)}
            </p>
          )}

          <button
            type="button"
            onClick={onDelete}
            className="mt-5 rounded-lg border border-red-400/60 px-3 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-400 hover:text-slate-950"
          >
            登録を解除
          </button>
        </div>
      </div>
    </li>
  );
}
