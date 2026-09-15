import { fetchTmdb } from "@/lib/tmdb/client";
import type { Work } from "@/types/work";

import type { TmdbMovieResponse } from "./types";

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
