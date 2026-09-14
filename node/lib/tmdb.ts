import type { Work } from "@/types/work";

const TMDB_API_URL = "https://api.themoviedb.org/3";

type TmdbMovie = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
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
    mediaType: "movie",
    releaseYear: movie.release_date
      ? movie.release_date.slice(0, 4)
      : undefined,
    rank: index + 1,
    posterPath: movie.poster_path,
  }));
}

type TmdbTvShow = {
  id: number;
  name: string;
  poster_path: string | null;
  first_air_date: string;
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
    mediaType: "tv",
    releaseYear: tvShow.first_air_date
      ? tvShow.first_air_date.slice(0, 4)
      : undefined,
    rank: index + 1,
    posterPath: tvShow.poster_path,
  }));
}

type TmdbTrendingWork = {
  id: number;
  media_type: "movie" | "tv" | "person";
  title?: string;
  name?: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
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
      mediaType: work.media_type,
      releaseYear:
        work.media_type === "movie"
          ? work.release_date?.slice(0, 4)
          : work.first_air_date?.slice(0, 4),
      posterPath: work.poster_path,
    }));
}

type TmdbSearchWork = {
  id: number;
  media_type: "movie" | "tv" | "person";
  title?: string;
  name?: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
};

type TmdbSearchResponse = {
  page: number;
  total_pages: number;
  results: TmdbSearchWork[];
};

type SearchWorksResult = {
  works: Work[];
  currentPage: number;
  totalPages: number;
};

/**
 * TMDBからキーワードに一致する作品を検索する。
 * 映画とTVシリーズのみを対象とし、人物データは除外する。
 */
export async function searchWorks(
  keyword: string,
  type?: string,
  page = 1,
): Promise<SearchWorksResult> {
  const token = process.env.TMDB_API_TOKEN;

  if (!token) {
    throw new Error("TMDB_API_TOKENが設定されていません。");
  }

  const response = await fetch(
    `${TMDB_API_URL}/search/multi?query=${encodeURIComponent(keyword)}&language=ja-JP&page=${page}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error("作品検索に失敗しました。");
  }

  const data: TmdbSearchResponse = await response.json();

  const works = data.results
    .filter((work) => work.media_type === "movie" || work.media_type === "tv")
    .filter((work) => {
      if (type === "movie") {
        return work.media_type === "movie";
      }

      if (type === "tv") {
        return work.media_type === "tv";
      }

      if (type === "animation") {
        return work.genre_ids?.includes(16) ?? false;
      }

      return true;
    })
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

  return {
    works,
    currentPage: data.page,
    totalPages: data.total_pages,
  };
}
