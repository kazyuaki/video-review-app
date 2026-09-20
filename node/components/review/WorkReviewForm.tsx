"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { parseApiError } from "@/lib/apiError";
import type { OwnWorkReview } from "@/types/review";
import type { WorkMediaType } from "@/types/work";

type WorkReviewFormProps = {
  mediaType: WorkMediaType;
  tmdbId: number;
  title: string;
  ownReview: OwnWorkReview | null;
  onComplete: (isEditing: boolean) => Promise<void>;
  onCancel: () => void;
};

/**
 * ログイン中ユーザーのレビュー投稿・編集フォームを表示する。
 */
export function WorkReviewForm({
  mediaType,
  tmdbId,
  title,
  ownReview,
  onComplete,
  onCancel,
}: WorkReviewFormProps) {
  const router = useRouter();

  const [rating, setRating] = useState(() => String(ownReview?.rating ?? 5));
  const [content, setContent] = useState(() => ownReview?.content ?? "");
  const [hasSpoiler, setHasSpoiler] = useState(
    () => ownReview?.hasSpoiler ?? false,
  );
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setIsSubmitting(true);

    const isEditing = Boolean(ownReview);

    try {
      await api.get("/sanctum/csrf-cookie");

      const reviewData = {
        rating: Number(rating),
        content,
        has_spoiler: hasSpoiler,
      };

      if (isEditing) {
        await api.put(
          `/api/works/${mediaType}/${tmdbId}/reviews/me`,
          reviewData,
        );
      } else {
        await api.post(`/api/works/${mediaType}/${tmdbId}/reviews`, {
          ...reviewData,
          title,
        });
      }

      await onComplete(isEditing);
      router.refresh();
    } catch (error) {
      const apiError = parseApiError(
        error,
        "レビューの保存に失敗しました。もう一度お試しください。",
      );

      setMessage(apiError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-lg font-bold">
          {ownReview ? "レビューを編集" : "レビューを投稿"}
        </h3>

        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-slate-400 transition hover:text-white"
        >
          閉じる
        </button>
      </div>

      {message && (
        <p
          role="alert"
          className="mt-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-200"
        >
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-5 space-y-5">
        <div>
          <label
            htmlFor="rating"
            className="block text-sm font-semibold text-slate-200"
          >
            評価
          </label>

          <select
            id="rating"
            value={rating}
            onChange={(event) => setRating(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
          >
            <option value="5">★★★★★ 5</option>
            <option value="4">★★★★☆ 4</option>
            <option value="3">★★★☆☆ 3</option>
            <option value="2">★★☆☆☆ 2</option>
            <option value="1">★☆☆☆☆ 1</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-semibold text-slate-200"
          >
            レビュー本文
          </label>

          <textarea
            id="content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            maxLength={2000}
            required
            rows={6}
            placeholder="作品を観た感想を書いてみましょう。"
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder:text-slate-500"
          />

          <p className="mt-1 text-right text-xs text-slate-500">
            {content.length} / 2000文字
          </p>
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={hasSpoiler}
            onChange={(event) => setHasSpoiler(event.target.checked)}
            className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-indigo-500"
          />
          ネタバレを含む
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-indigo-500 px-4 py-3 font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? "保存中..."
            : ownReview
              ? "レビューを更新"
              : "レビューを投稿"}
        </button>
      </form>
    </div>
  );
}
