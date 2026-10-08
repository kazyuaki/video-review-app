"use client";

import { isAxiosError } from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { api } from "@/lib/api";
import type {
  ViewingRecord,
  ViewingRecordsResponse,
  ViewingRecordStatusFilter,
} from "@/types/viewingRecord";
import { parseApiError } from "@/lib/apiError";
import { ViewingRecordCard } from "./ViewingRecordCard";
import { ViewingRecordFilter } from "./ViewingRecordFilter";
import { DeleteViewingRecordDialog } from "./DeleteViewingRecordDialog";


/**
 * マイリストの取得・絞り込み・削除操作を管理して表示する。
 */
export function MyListPageContent() {
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
          <ViewingRecordFilter
            value={selectedStatus}
            onChange={setSelectedStatus}
          />
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
              <ViewingRecordCard
                key={viewingRecord.id}
                viewingRecord={viewingRecord}
                onDelete={() => {
                  setDeleteError("");
                  setRecordToDelete(viewingRecord);
                }}
              />
            ))}
          </ul>
        )}
      </div>

      {recordToDelete && (
        <DeleteViewingRecordDialog
          viewingRecord={recordToDelete}
          isDeleting={isDeleting}
          error={deleteError}
          onCancel={() => setRecordToDelete(null)}
          onConfirm={handleDelete}
        />
      )}
    </main>
  );
}
