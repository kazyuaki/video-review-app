/** TMDBの人気映画APIが返す作品情報。 */
export type TmdbMovie = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
};

export type TmdbMovieResponse = {
  results: TmdbMovie[];
};

/** TMDBの人気TVシリーズAPIが返す作品情報。 */
export type TmdbTvShow = {
  id: number;
  name: string;
  poster_path: string | null;
  first_air_date: string;
};

export type TmdbTvResponse = {
  results: TmdbTvShow[];
};

/** TMDBの週間トレンドAPIが返す映画・TVシリーズ情報。 */
export type TmdbTrendingWork = {
  id: number;
  media_type: "movie" | "tv";
  title?: string;
  name?: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
};

export type TmdbTrendingResponse = {
  results: TmdbTrendingWork[];
};

export type TmdbMovieSearchWork = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date?: string;
  genre_ids?: number[];
};

export type TmdbTvSearchWork = {
  id: number;
  name: string;
  poster_path: string | null;
  first_air_date?: string;
  genre_ids?: number[];
};

/** 複合検索APIが返す映画、TVシリーズ、人物の検索結果。 */
export type TmdbMultiSearchWork = {
  id: number;
  media_type: "movie" | "tv" | "person";
  title?: string;
  name?: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
};

/** TMDB検索APIのページネーション付きレスポンス。 */
export type TmdbSearchResponse<T> = {
  page: number;
  total_pages: number;
  results: T[];
};

/** TMDBのジャンル情報 */
export type TmdbGenre = {
  id: number;
  name: string;
};

/** TMDBのジャンル一覧APIのレスポンス */
export type TmdbGenreResponse = {
  genres: TmdbGenre[];
};