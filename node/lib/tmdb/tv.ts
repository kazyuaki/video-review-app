import { fetchTmdb } from "@/lib/tmdb/client";
import type { Work } from "@/types/work";

import type { TmdbSearchResponse, TmdbTvShow } from "./types";

export type PopularTvShowsResult = {
  works: Work[];
  currentPage: number;
  totalPages: number;
};

/**
 * TMDBから人気のTVシリーズを取得する。
 * 日本語の作品情報を取得し、先頭10件を返す。
 */
export async function getPopularTvShows(): Promise<Work[]> {
  const result = await getPopularTvShowsPage();

  return result.works.slice(0, 10);
}

/**
 * TMDBから人気TVシリーズをページ単位で取得する。
 */
export async function getPopularTvShowsPage(
  page = 1,
): Promise<PopularTvShowsResult> {
  const data = await fetchTmdb<TmdbSearchResponse<TmdbTvShow>>(
    `/tv/popular?language=ja-JP&page=${page}`,
  );

  return {
    works: data.results.map((tvShow, index) => ({
      id: tvShow.id,
      title: tvShow.name,
      mediaType: "tv",
      releaseYear: tvShow.first_air_date
        ? tvShow.first_air_date.slice(0, 4)
        : undefined,
      rank: (data.page - 1) * 20 + index + 1,
      posterPath: tvShow.poster_path,
    })),
    currentPage: data.page,
    totalPages: data.total_pages,
  };
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
