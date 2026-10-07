import { fetchTmdb } from "@/lib/tmdb/client";
import type { Work } from "@/types/work";

import type { TmdbMovie, TmdbSearchResponse } from "./types";

export type PopularMoviesResult = {
  works: Work[];
  currentPage: number;
  totalPages: number;
};

/**
 * TMDBから日本で視聴可能な人気映画を取得する。
 * 日本語の作品情報を取得し、先頭10件を返す。
 */
export async function getPopularMovies(): Promise<Work[]> {
  const result = await getPopularMoviesPage();

  return result.works.slice(0, 10);
}

/**
 * TMDBから日本で視聴可能な人気映画をページ単位で取得する。
 */
export async function getPopularMoviesPage(
  page = 1,
): Promise<PopularMoviesResult> {
  const data = await fetchTmdb<TmdbSearchResponse<TmdbMovie>>(
    `/discover/movie?language=ja-JP&page=${page}&watch_region=JP&with_watch_monetization_types=flatrate|free|ads&sort_by=popularity.desc`,
  );

  return {
    works: data.results.map((movie, index) => ({
      id: movie.id,
      title: movie.title,
      mediaType: "movie",
      releaseYear: movie.release_date
        ? movie.release_date.slice(0, 4)
        : undefined,
      rank: (data.page - 1) * 20 + index + 1,
      posterPath: movie.poster_path,
    })),
    currentPage: data.page,
    totalPages: data.total_pages,
  };
}

export type GenreMoviesResult = {
  works: Work[];
  currentPage: number;
  totalPages: number;
};

/**
 * TMDBから指定したジャンルの映画を取得する。
 * ページネーション情報とともに作品一覧を返す。
 */
export async function getMoviesByGenre(
  genreId: number,
  page = 1,
): Promise<GenreMoviesResult> {
  const data = await fetchTmdb<TmdbSearchResponse<TmdbMovie>>(
    `/discover/movie?language=ja-JP&page=${page}&with_genres=${genreId}`,
  );

  return {
    works: data.results.map((movie) => ({
      id: movie.id,
      title: movie.title,
      mediaType: "movie",
      releaseYear: movie.release_date
        ? movie.release_date.slice(0, 4)
        : undefined,
      posterPath: movie.poster_path,
    })),
    currentPage: data.page,
    totalPages: data.total_pages,
  };
}
