"use client";

import { isAxiosError } from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { parseApiError } from "@/lib/apiError";
import { api } from "@/lib/api";
import type { OwnViewingRecord, ViewingStatus } from "@/types/viewingRecord";
import type { WorkMediaType } from "@/types/work";

type WorkViewingRecordAreaProps = {
  mediaType: WorkMediaType;
  tmdbId: number;
  title: string;
  posterPath: string | null;
};

const viewingStatusOptions: {
  value: ViewingStatus;
  label: string;
}[] = [
  { value: "want_to_watch", label: "観たい" },
  { value: "watching", label: "視聴中" },
  { value: "watched", label: "視聴済み" },
  { value: "dropped", label: "中断" },
];

/**
 * 作品詳細で、ログイン中ユーザーの視聴記録を登録・更新する。
 */
export function WorkViewingRecordArea({
  mediaType,
  tmdbId,
  title,
  posterPath,
}: WorkViewingRecordAreaProps) {
  const { user, isLoading } = useAuth();

  const [viewingRecord, setViewingRecord] = useState<OwnViewingRecord | null>(
    null,
  );
  const [status, setStatus] = useState<ViewingStatus>("want_to_watch");
  const [vodService, setVodService] = useState("");
  const [startedAt, setStartedAt] = useState("");
  const [watchedAt, setWatchedAt] = useState("");
  const [isRecordReady, setIsRecordReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isLoading || !user) {
      return;
    }

    let isCancelled = false;

    async function loadViewingRecord() {
      try {
        const response = await api.get<OwnViewingRecord>(
          `/api/works/${mediaType}/${tmdbId}/viewing-records/me`,
        );

        if (!isCancelled) {
          setViewingRecord(response.data);
          setStatus(response.data.status);
          setVodService(response.data.vodService ?? "");
          setStartedAt(response.data.startedAt ?? "");
          setWatchedAt(response.data.watchedAt ?? "");
        }
      } catch (error) {
        if (isCancelled) {
          return;
        }

        // 404は未登録の視聴記録として扱う。
        if (isAxiosError(error) && error.response?.status === 404) {
          setViewingRecord(null);
          return;
        }

        setMessage("視聴記録の取得に失敗しました。");
      } finally {
        if (!isCancelled) {
          setIsRecordReady(true);
        }
      }
    }

    void loadViewingRecord();

    return () => {
      isCancelled = true;
    };
  }, [isLoading, mediaType, tmdbId, user]);

  async function handleSubmit() {
    setMessage("");
    setIsSubmitting(true);

    try {
      await api.get("/sanctum/csrf-cookie");

      const response = viewingRecord
        ? await api.put<OwnViewingRecord>(
            `/api/works/${mediaType}/${tmdbId}/viewing-records/me`,
            {
              status,
              vod_service: vodService || null,
              started_at: startedAt || null,
              watched_at: watchedAt || null,
            },
          )
        : await api.post<OwnViewingRecord>(
            `/api/works/${mediaType}/${tmdbId}/viewing-records`,
            {
              title,
              poster_path: posterPath,
              status,
              vod_service: vodService || null,
              started_at: startedAt || null,
              watched_at: watchedAt || null,
            },
          );

      setViewingRecord(response.data);
      setMessage(
        viewingRecord
          ? "視聴状況を更新しました。"
          : "マイリストに登録しました。",
      );
    } catch (error) {
      const apiError = parseApiError(
        error,
        viewingRecord
          ? "視聴状況の更新に失敗しました。もう一度お試しください。"
          : "マイリストへの登録に失敗しました。もう一度お試しください。",
      );

      setMessage(apiError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="border-t border-white/10 py-10">
      <h2 className="mt-2 text-2xl font-bold">視聴状況</h2>
      <p className="mt-2 text-sm text-slate-400">
        マイリストに登録して、作品の視聴状況を管理できます。
      </p>

      {isLoading || (user && !isRecordReady) ? (
        <p className="mt-6 text-sm text-slate-400">
          視聴記録を確認しています...
        </p>
      ) : !user ? (
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
          マイリストへ登録するには
          <Link
            href="/login"
            className="mx-1 font-semibold text-indigo-300 hover:text-indigo-200"
          >
            ログイン
          </Link>
          が必要です。
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
          {message && (
            <p
              role="status"
              className="mb-5 rounded-lg bg-white/10 px-4 py-3 text-sm text-slate-300"
            >
              {message}
            </p>
          )}

          <label
            htmlFor="viewing-status"
            className="block text-sm font-semibold text-slate-200"
          >
            視聴状況
          </label>

          <select
            id="viewing-status"
            value={status}
            onChange={(event) => setStatus(event.target.value as ViewingStatus)}
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
          >
            {viewingStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <label
            htmlFor="vod-service"
            className="mt-5 block text-sm font-semibold text-slate-200"
          >
            視聴した配信サービス
          </label>
          <input
            id="vod-service"
            type="text"
            value={vodService}
            onChange={(event) => setVodService(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
          />

          <label
            htmlFor="started-at"
            className="mt-5 block text-sm font-semibold text-slate-200"
          >
            視聴開始日
          </label>
          <input
            id="started-at"
            type="date"
            value={startedAt}
            onChange={(event) => setStartedAt(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
          />

          <label
            htmlFor="watched-at"
            className="mt-5 block text-sm font-semibold text-slate-200"
          >
            視聴完了日
          </label>
          <input
            id="watched-at"
            type="date"
            value={watchedAt}
            onChange={(event) => setWatchedAt(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
          />

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="mt-5 w-full rounded-xl bg-indigo-500 px-4 py-3 font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting
              ? "保存中..."
              : viewingRecord
                ? "視聴状況を更新"
                : "マイリストに登録"}
          </button>
        </div>
      )}
    </section>
  );
}
