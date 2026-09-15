import { fetchTmdb } from "./client";

import type { TmdbGenre, TmdbGenreResponse } from "./types";

/**
 * TMDBから映画ジャンル一覧を取得する。
 * 日本語のジャンル名を取得する。
 */
export async function getMovieGenres(): Promise<TmdbGenre[]> {
  const data = await fetchTmdb<TmdbGenreResponse>(
    "/genre/movie/list?language=ja-JP",
  );

  return data.genres;
}

/**
 * TMDBからTVシリーズのジャンル一覧を取得する。
 * 日本語のジャンル名を取得する。
 */
export async function getTvGenres(): Promise<TmdbGenre[]> {
  const data = await fetchTmdb<TmdbGenreResponse>(
    "/genre/tv/list?language=ja-JP",
  );

  return data.genres;
}