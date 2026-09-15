import { fetchTmdb } from "@/lib/tmdb/client";
import type { Work } from "@/types/work";

import type {
  TmdbMovieSearchWork,
  TmdbMultiSearchWork,
  TmdbSearchResponse,
  TmdbTvSearchWork,
} from "./types";

export type SearchWorksResult = {
  works: Work[];
  currentPage: number;
  totalPages: number;
};

/** 検索条件に応じたTMDBの検索エンドポイントを返す。 */
const getSearchEndpoint = (type?: string) => {
  if (type === "movie") {
    return "search/movie";
  }

  if (type === "tv") {
    return "search/tv";
  }

  return "search/multi";
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
  const endpoint = getSearchEndpoint(type);
  const path = `/${endpoint}?query=${encodeURIComponent(keyword)}&language=ja-JP&page=${page}`;

  if (type === "movie") {
    const data = await fetchTmdb<TmdbSearchResponse<TmdbMovieSearchWork>>(path);

    return {
      works: data.results.map((movie) => ({
        id: movie.id,
        title: movie.title,
        mediaType: "movie",
        releaseYear: movie.release_date?.slice(0, 4),
        posterPath: movie.poster_path,
      })),
      currentPage: data.page,
      totalPages: data.total_pages,
    };
  }

  if (type === "tv") {
    const data = await fetchTmdb<TmdbSearchResponse<TmdbTvSearchWork>>(path);

    return {
      works: data.results.map((tvShow) => ({
        id: tvShow.id,
        title: tvShow.name,
        mediaType: "tv",
        releaseYear: tvShow.first_air_date?.slice(0, 4),
        posterPath: tvShow.poster_path,
      })),
      currentPage: data.page,
      totalPages: data.total_pages,
    };
  }

  const data = await fetchTmdb<TmdbSearchResponse<TmdbMultiSearchWork>>(path);

  return {
    works: data.results
      .filter(
        (work): work is TmdbMultiSearchWork & { media_type: "movie" | "tv" } =>
          work.media_type === "movie" || work.media_type === "tv",
      )
      .map((work) => ({
        id: work.id,
        title:
          work.media_type === "movie"
            ? (work.title ?? "")
            : (work.name ?? ""),
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
