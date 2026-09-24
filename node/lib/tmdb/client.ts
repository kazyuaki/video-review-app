const TMDB_API_URL = "https://api.themoviedb.org/3";

/** TMDB APIから返されたHTTPエラー。 */
export class TmdbApiError extends Error {
  constructor(public readonly status: number) {
    super("TMDB APIの取得に失敗しました。");
    this.name = "TmdbApiError";
  }
}

/**
 * TMDB APIへリクエストを送信する。
 */
export async function fetchTmdb<T>(path: string): Promise<T> {
  const token = process.env.TMDB_API_TOKEN;

  if (!token) {
    throw new Error("TMDB_API_TOKENが設定されていません。");
  }

  const response = await fetch(`${TMDB_API_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new TmdbApiError(response.status);
  }

  return response.json() as Promise<T>;
}
