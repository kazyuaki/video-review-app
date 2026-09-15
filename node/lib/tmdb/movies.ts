import { fetchTmdb } from "@/lib/tmdb/client";
import type { Work } from "@/types/work";

import type { TmdbMovie, TmdbMovieResponse, TmdbSearchResponse } from "./types";
/**
 * TMDBから人気映画を取得する。
 * 日本語の作品情報を取得し、先頭10件を返す。
 */
export async function getPopularMovies(): Promise<Work[]> {
  const data = await fetchTmdb<TmdbMovieResponse>(
    "/movie/popular?language=ja-JP&page=1",
  );

  return data.results.slice(0, 10).map((movie, index) => ({
    id: movie.id,
    title: movie.title,
    mediaType: "movie",
    releaseYear: movie.release_date
      ? movie.release_date.slice(0, 4)
      : undefined,
    rank: index + 1,
    posterPath: movie.poster_path,
  }));
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
