/**
 * アプリ内で扱う作品情報の型を定義する。
 */
export type Work = {
  id: number;
  title: string;
  rank?: number;
  posterPath?: string | null;
};
