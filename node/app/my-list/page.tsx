"use client";

import { isAxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { api } from "@/lib/api";
import type {
  ViewingRecord,
  ViewingRecordsResponse,
  ViewingStatus,
} from "@/types/viewingRecord";
import { parseApiError } from "@/lib/apiError";

const statusLabels = {
  want_to_watch: "観たい",
  watching: "視聴中",
  watched: "視聴済み",
  dropped: "中断",
} as const;

const TMDB_IMAGE_URL = "https://image.tmdb.org/t/p/w500";

type ViewingRecordStatusFilter = "all" | ViewingStatus;

const statusFilterOptions: {
  value: ViewingRecordStatusFilter;
  label: string;
}[] = [
  { value: "all", label: "すべて" },
  { value: "want_to_watch", label: "観たい" },
  { value: "watching", label: "視聴中" },
  { value: "watched", label: "視聴済み" },
  { value: "dropped", label: "中断" },
];

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

/**
 * ログイン中ユーザーのマイリストを表示する。
 */
export default function MyListPage() {
  const { user, isLoading } = useAuth();
  const [viewingRecords, setViewingRecords] = useState<ViewingRecord[]>([]);
  const [isListReady, setIsListReady] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedStatus, setSelectedStatus] =
    useState<ViewingRecordStatusFilter>("all");
  const [recordToDelete, setRecordToDelete] = useState<ViewingRecord | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    if (isLoading || !user) {
      return;
    }

    let isCancelled = false;

    async function loadViewingRecords() {
      try {
        const response = await api.get<ViewingRecordsResponse>(
          "/api/viewing-records",
        );

        if (!isCancelled) {
          setViewingRecords(response.data.viewingRecords);
        }
      } catch (error) {
        if (isCancelled) {
          return;
        }

        if (isAxiosError(error) && error.response?.status === 401) {
          setMessage("マイリストを表示するにはログインが必要です。");
          return;
        }

        setMessage("マイリストの取得に失敗しました。");
      } finally {
        if (!isCancelled) {
          setIsListReady(true);
        }
      }
    }

    void loadViewingRecords();

    return () => {
      isCancelled = true;
    };
  }, [isLoading, user]);

  const filteredViewingRecords =
    selectedStatus === "all"
      ? viewingRecords
      : viewingRecords.filter((record) => record.status === selectedStatus);

  async function handleDelete() {
    if (!recordToDelete) {
      return;
    }

    setDeleteError("");
    setIsDeleting(true);

    try {
      await api.get("/sanctum/csrf-cookie");

      await api.delete(
        `/api/works/${recordToDelete.work.mediaType}/${recordToDelete.work.tmdbId}/viewing-records/me`,
      );

      setViewingRecords((records) =>
        records.filter((record) => record.id !== recordToDelete.id),
      );
      setRecordToDelete(null);
      setStatusMessage("マイリストから作品を削除しました。");
    } catch (error) {
      const apiError = parseApiError(
        error,
        "マイリストからの削除に失敗しました。もう一度お試しください。",
      );

      setDeleteError(apiError.message);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <p className="text-sm font-semibold tracking-widest text-indigo-300">
          MY LIST
        </p>
        <h1 className="mt-2 text-3xl font-bold">マイリスト</h1>
        <p className="mt-3 text-sm text-slate-400">
          登録した作品と視聴状況を確認できます。
        </p>

        {statusMessage && (
          <p
            role="status"
            className="mt-6 rounded-lg bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200"
          >
            {statusMessage}
          </p>
        )}

        {viewingRecords.length > 0 && (
          <div className="mt-8">
            <label
              htmlFor="viewing-status-filter"
              className="block text-sm font-semibold text-slate-200"
            >
              視聴状況で絞り込む
            </label>

            <select
              id="viewing-status-filter"
              value={selectedStatus}
              onChange={(event) =>
                setSelectedStatus(
                  event.target.value as ViewingRecordStatusFilter,
                )
              }
              className="mt-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
            >
              {statusFilterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {isLoading ? (
          <p className="mt-8 text-sm text-slate-400">
            ログイン状態を確認しています...
          </p>
        ) : !user ? (
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
            マイリストを表示するには
            <Link
              href="/login"
              className="mx-1 font-semibold text-indigo-300 hover:text-indigo-200"
            >
              ログイン
            </Link>
            が必要です。
          </div>
        ) : !isListReady ? (
          <p className="mt-8 text-sm text-slate-400">
            マイリストを読み込んでいます...
          </p>
        ) : message ? (
          <p
            role="alert"
            className="mt-8 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-200"
          >
            {message}
          </p>
        ) : filteredViewingRecords.length === 0 ? (
          <p className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
            {viewingRecords.length === 0
              ? "マイリストにはまだ作品が登録されていません。"
              : "選択した視聴状況の作品はありません。"}
          </p>
        ) : (
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredViewingRecords.map((viewingRecord) => (
              <li
                key={viewingRecord.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
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
                      onClick={() => {
                        setDeleteError("");
                        setRecordToDelete(viewingRecord);
                      }}
                      className="mt-5 rounded-lg border border-red-400/60 px-3 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-400 hover:text-slate-950"
                    >
                      登録を解除
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {recordToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-viewing-record-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm"
        >
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
            <h2
              id="delete-viewing-record-title"
              className="text-xl font-bold text-white"
            >
              マイリストから削除しますか？
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              「{recordToDelete.work.title}」の視聴記録を削除します。元に戻すことはできません。
            </p>

            {deleteError && (
              <p
                role="alert"
                className="mt-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-200"
              >
                {deleteError}
              </p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setRecordToDelete(null)}
                disabled={isDeleting}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                キャンセル
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeleting ? "削除中..." : "削除する"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
