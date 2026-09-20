/**
 * 作品詳細画面に表示するレビュー情報。
 */
export type WorkReview = {
  id: number;
  userName: string;
  rating: number;
  content: string;
  hasSpoiler: boolean;
  createdAt: string;
};

/**
 * 作品ごとのレビュー一覧APIが返す情報。
 */
export type WorkReviewsResponse = {
  averageRating: number;
  reviewCount: number;
  reviews: WorkReview[];
};

/**
 * ログイン中ユーザーが投稿したレビュー情報。
 */
export type OwnWorkReview = {
  id: number;
  rating: number;
  content: string;
  hasSpoiler: boolean;
  createdAt: string;
  updatedAt: string;
};
