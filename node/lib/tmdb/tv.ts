import { fetchTmdb } from "@/lib/tmdb/client";
import type { Work } from "@/types/work";

import type { TmdbSearchResponse, TmdbTvResponse, TmdbTvShow } from "./types";

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

export type GenreTvShowsResult = {
  works: Work[];
  currentPage: number;
  totalPages: number;
};

/**
 * TMDBから指定したジャンルのTVシリーズを取得する。
 * ページネーション情報とともに作品一覧を返す。
 */
export async function getTvShowsByGenre(
  genreId: number,
  page = 1,
): Promise<GenreTvShowsResult> {
  const data = await fetchTmdb<TmdbSearchResponse<TmdbTvShow>>(
    `/discover/tv?language=ja-JP&page=${page}&with_genres=${genreId}`,
  );

  return {
    works: data.results.map((tvShow) => ({
      id: tvShow.id,
      title: tvShow.name,
      mediaType: "tv",
      releaseYear: tvShow.first_air_date
        ? tvShow.first_air_date.slice(0, 4)
        : undefined,
      posterPath: tvShow.poster_path,
    })),
    currentPage: data.page,
    totalPages: data.total_pages,
  };
}