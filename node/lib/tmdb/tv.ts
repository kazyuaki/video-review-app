import { fetchTmdb } from "@/lib/tmdb/client";
import type { Work } from "@/types/work";

import type { TmdbTvResponse } from "./types";

/**
 * TMDBから人気のTVシリーズを取得する。
 * 日本語の作品情報を取得し、アプリ用の作品情報に変換して先頭10件を返す。
 */
export async function getPopularTvShows(): Promise<Work[]> {
  const data = await fetchTmdb<TmdbTvResponse>(
    "/tv/popular?language=ja-JP&page=1",
  );

  return data.results.slice(0, 10).map((tvShow, index) => ({
    id: tvShow.id,
    title: tvShow.name,
    mediaType: "tv",
    releaseYear: tvShow.first_air_date
      ? tvShow.first_air_date.slice(0, 4)
      : undefined,
    rank: index + 1,
    posterPath: tvShow.poster_path,
  }));
}
