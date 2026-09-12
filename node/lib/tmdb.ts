import type { Work } from "@/types/work";

const TMDB_API_URL = "https://api.themoviedb.org/3";

type TmdbMovie = {
  id: number;
  title: string;
  poster_path: string | null;
};

type TmdbMovieResponse = {
  results: TmdbMovie[];
};

/**
 * TMDBから人気映画を取得する。
 * 日本語の作品情報を取得し、先頭10件を返す。
 */
export async function getPopularMovies(): Promise<Work[]> {
  const token = process.env.TMDB_API_TOKEN;

  if (!token) {
    throw new Error("TMDB_API_TOKENが設定されていません。");
  }

  const response = await fetch(
    `${TMDB_API_URL}/movie/popular?language=ja-JP&page=1`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error("人気映画の取得に失敗しました。");
  }

  const data: TmdbMovieResponse = await response.json();

  return data.results.slice(0, 10).map((movie, index) => ({
    id: movie.id,
    title: movie.title,
    rank: index + 1,
    posterPath: movie.poster_path,
  }));
}

type TmdbTvShow = {
  id: number;
  name: string;
  poster_path: string | null;
};

type TmdbTvResponse = {
  results: TmdbTvShow[];
};

/**
 * TMDBから人気のTVシリーズを取得する。
 * 日本語の作品情報を取得し、アプリ用の作品情報に変換して先頭10件を返す。
 */
export async function getPopularTvShows(): Promise<Work[]> {
  const token = process.env.TMDB_API_TOKEN;

  if (!token) {
    throw new Error("TMDB_API_TOKENが設定されていません。");
  }

  const response = await fetch(
    `${TMDB_API_URL}/tv/popular?language=ja-JP&page=1`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error("人気TVシリーズの取得に失敗しました。");
  }

  const data: TmdbTvResponse = await response.json();

  return data.results.slice(0, 10).map((tvShow, index) => ({
    id: tvShow.id,
    title: tvShow.name,
    rank: index + 1,
    posterPath: tvShow.poster_path,
  }));
}


type TmdbTrendingWork = {
  id: number;
  media_type: "movie" | "tv";
  title?: string;
  name?: string;
  poster_path: string | null;
};

type TmdbTrendingResponse = {
  results: TmdbTrendingWork[];
};

/**
 * TMDBから話題の作品を取得する。
 * 映画とTVシリーズの週間トレンドを取得し、
 * アプリ用の作品情報に変換して先頭10件を返す。
 */
export async function getTrendingWorks(): Promise<Work[]> {
  const token = process.env.TMDB_API_TOKEN;

  if (!token) {
    throw new Error("TMDB_API_TOKENが設定されていません。");
  }

  const response = await fetch(
    `${TMDB_API_URL}/trending/all/week?language=ja-JP`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error("話題の作品の取得に失敗しました。");
  }

  const data: TmdbTrendingResponse = await response.json();

  return data.results
    .filter((work) => work.media_type === "movie" || work.media_type === "tv")
    .slice(0, 10)
    .map((work) => ({
      id: work.id,
      title:
        work.media_type === "movie" ? (work.title ?? "") : (work.name ?? ""),
      posterPath: work.poster_path,
    }));
}
