import type { WorkReviewsResponse } from "@/types/review";
import type { WorkMediaType } from "@/types/work";

const API_INTERNAL_URL = process.env.API_INTERNAL_URL;

/**
 * 指定した作品の評価集計と指定ページの新着レビューを取得する。
 */
export async function getWorkReviews(
  mediaType: WorkMediaType,
  tmdbId: number,
  page = 1,
): Promise<WorkReviewsResponse> {
  const pageQuery = page > 1 ? `?page=${page}` : "";

  if (!API_INTERNAL_URL) {
    throw new Error("API_INTERNAL_URLが設定されていません。");
  }

  const response = await fetch(
    `${API_INTERNAL_URL}/api/works/${mediaType}/${tmdbId}/reviews${pageQuery}`,
    {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("レビュー情報の取得に失敗しました。");
  }

  return response.json() as Promise<WorkReviewsResponse>;
}
