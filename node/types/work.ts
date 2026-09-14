/**
 * アプリ内で扱う作品種別を定義する。
 */
export type WorkMediaType = "movie" | "tv";

/**
 * アプリ内で扱う作品情報の型を定義する。
 */
export type Work = {
  id: number;
  title: string;
  mediaType: WorkMediaType;
  releaseYear?: string;
  rank?: number;
  posterPath?: string | null;
};
