"use client";

import { isAxiosError } from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { api } from "@/lib/api";
import type { OwnWorkReview, WorkReviewsResponse } from "@/types/review";
import type { WorkMediaType } from "@/types/work";
import { WorkReviewForm } from "./WorkReviewForm";
import { WorkReviewSection } from "./WorkReviewSection";

type WorkReviewAreaProps = {
  mediaType: WorkMediaType;
  tmdbId: number;
  title: string;
  reviewData: WorkReviewsResponse;
};

/**
 * レビュー一覧と、ログイン中ユーザーの投稿・編集操作をまとめて表示する。
 */
export function WorkReviewArea({
  mediaType,
  tmdbId,
  title,
  reviewData,
}: WorkReviewAreaProps) {
  const { user, isLoading } = useAuth();

  const [ownReview, setOwnReview] = useState<OwnWorkReview | null>(null);
  const [isOwnReviewReady, setIsOwnReviewReady] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isLoading || !user) {
      return;
    }

    let isCancelled = false;

    async function loadOwnReview() {
      try {
        const response = await api.get<OwnWorkReview>(
          `/api/works/${mediaType}/${tmdbId}/reviews/me`,
        );

        if (!isCancelled) {
          setOwnReview(response.data);
        }
      } catch (error) {
        if (isCancelled) {
          return;
        }

        // 404は、まだレビューを投稿していない状態として扱う。
        if (isAxiosError(error) && error.response?.status === 404) {
          setOwnReview(null);
          return;
        }

        setMessage("投稿済みレビューの取得に失敗しました。");
      } finally {
        if (!isCancelled) {
          setIsOwnReviewReady(true);
        }
      }
    }

    void loadOwnReview();

    return () => {
      isCancelled = true;
    };
  }, [isLoading, mediaType, tmdbId, user]);

  async function handleComplete(isEditing: boolean) {
    const response = await api.get<OwnWorkReview>(
      `/api/works/${mediaType}/${tmdbId}/reviews/me`,
    );

    setOwnReview(response.data);
    setIsFormOpen(false);
    setMessage(
      isEditing ? "レビューを更新しました。" : "レビューを投稿しました。",
    );
  }

  return (
    <section className="border-t border-white/10 py-10">
      <WorkReviewSection
        reviewData={reviewData}
        ownReviewId={user ? ownReview?.id : undefined}
        onEdit={() => setIsFormOpen(true)}
      />

      {message && (
        <p
          role="status"
          className="mt-6 rounded-lg bg-white/10 px-4 py-3 text-sm text-slate-300"
        >
          {message}
        </p>
      )}

      {isLoading || (user && !isOwnReviewReady) ? (
        <p className="mt-6 text-sm text-slate-400">
          投稿済みレビューを確認しています...
        </p>
      ) : !user ? (
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
          レビューを投稿するには
          <Link
            href="/login"
            className="mx-1 font-semibold text-indigo-300 hover:text-indigo-200"
          >
            ログイン
          </Link>
          が必要です。
        </div>
      ) : !ownReview && !isFormOpen ? (
        <button
          type="button"
          onClick={() => setIsFormOpen(true)}
          className="mt-6 rounded-xl bg-indigo-500 px-5 py-3 font-semibold text-white transition hover:bg-indigo-400"
        >
          レビューを投稿
        </button>
      ) : isFormOpen ? (
        <WorkReviewForm
          key={ownReview?.id ?? "new-review"}
          mediaType={mediaType}
          tmdbId={tmdbId}
          title={title}
          ownReview={ownReview}
          onComplete={handleComplete}
          onCancel={() => setIsFormOpen(false)}
        />
      ) : null}
    </section>
  );
}
