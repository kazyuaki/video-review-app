import { fetchTmdb } from "@/lib/tmdb/client";
import type { Work } from "@/types/work";

import type { TmdbSearchResponse, TmdbTrendingWork } from "./types";

export type TrendingWorksResult = {
  works: Work[];
  currentPage: number;
  totalPages: number;
};

/**
 * TMDBから世界で話題の作品を取得する。
 * 映画とTVシリーズの週間トレンドを取得し、先頭10件を返す。
 */
export async function getTrendingWorks(): Promise<Work[]> {
  const result = await getTrendingWorksPage();

  return result.works.slice(0, 10);
}

/**
 * TMDBから話題の映画・TVシリーズをページ単位で取得する。
 */
export async function getTrendingWorksPage(
  page = 1,
): Promise<TrendingWorksResult> {
  const data = await fetchTmdb<TmdbSearchResponse<TmdbTrendingWork>>(
    `/trending/all/week?language=ja-JP&page=${page}`,
  );

  return {
    works: data.results
      .filter((work) => work.media_type === "movie" || work.media_type === "tv")
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
      })),
    currentPage: data.page,
    totalPages: data.total_pages,
  };
}
