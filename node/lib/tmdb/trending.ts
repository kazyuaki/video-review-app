import { fetchTmdb } from "@/lib/tmdb/client";
import type { Work } from "@/types/work";

import type { TmdbTrendingResponse } from "./types";

/**
 * TMDBから話題の作品を取得する。
 * 映画とTVシリーズの週間トレンドを取得し、
 * アプリ用の作品情報に変換して先頭10件を返す。
 */
export async function getTrendingWorks(): Promise<Work[]> {
  const data = await fetchTmdb<TmdbTrendingResponse>(
    "/trending/all/week?language=ja-JP",
  );

  return data.results
    .filter((work) => work.media_type === "movie" || work.media_type === "tv")
    .slice(0, 10)
    .map((work) => ({
      id: work.id,
      title:
        work.media_type === "movie" ? (work.title ?? "") : (work.name ?? ""),
      mediaType: work.media_type,
      releaseYear:
        work.media_type === "movie"
          ? work.release_date?.slice(0, 4)
          : work.first_air_date?.slice(0, 4),
      posterPath: work.poster_path,
    }));
}
