import { WorkMediaType } from "./work";

/**
 * 視聴状況として保存できる値。
 */
export type ViewingStatus =
  | "want_to_watch"
  | "watching"
  | "watched"
  | "dropped";

/**
 * ログイン中ユーザーの作品ごとの視聴記録。
 */
export type OwnViewingRecord = {
  id: number;
  status: ViewingStatus;
  vodService: string | null;
  startedAt: string | null;
  watchedAt: string | null;
};

/**
 * 視聴記録に紐づく作品情報。
 */
export type ViewingRecordWork = {
  tmdbId: number;
  mediaType: WorkMediaType;
  title: string;
  posterPath: string | null;
};

/**
 * マイリスト一覧に表示する視聴記録。
 */
export type ViewingRecord = OwnViewingRecord & {
  work: ViewingRecordWork;
};

/**
 * マイリスト取得APIのレスポンス。
 */
export type ViewingRecordsResponse = {
  viewingRecords: ViewingRecord[];
};