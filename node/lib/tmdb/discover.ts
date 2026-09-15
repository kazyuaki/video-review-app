import type { Work } from "@/types/work";

import { getMoviesByGenre } from "./movies";
import { getTvShowsByGenre } from "./tv";

export type GenreWorksResult = {
  works: Work[];
  currentPage: number;
  totalPages: number;
};

/**
 * 指定したジャンルの作品を取得する。
 * 作品種別が指定されていない場合は、映画とTVシリーズの両方を取得する。
 */
export async function getWorksByGenre(
  genreId: number,
  type?: string,
  page = 1,
): Promise<GenreWorksResult> {
  if (type === "movie") {
    return getMoviesByGenre(genreId, page);
  }

  if (type === "tv") {
    return getTvShowsByGenre(genreId, page);
  }

  const [movies, tvShows] = await Promise.all([
    getMoviesByGenre(genreId, page),
    getTvShowsByGenre(genreId, page),
  ]);

  return {
    works: [...movies.works, ...tvShows.works],
    currentPage: page,
    totalPages: Math.max(movies.totalPages, tvShows.totalPages),
  };
}
