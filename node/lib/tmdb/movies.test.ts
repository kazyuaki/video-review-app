import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getPopularMovies } from "./movies";

/**
 * 人気映画取得処理のテスト。
 * TMDBのレスポンスをアプリ内で扱う作品情報へ変換できることを確認する。
 */
describe("getPopularMovies", () => {
  beforeEach(() => {
    process.env.TMDB_API_TOKEN = "test-token";
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete process.env.TMDB_API_TOKEN;
  });

  it("人気映画をWork形式に変換して取得できる", async () => {
    const fetchMock = vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          results: [
            {
              id: 101,
              title: "テスト映画",
              poster_path: "/test-movie.jpg",
              release_date: "2025-01-15",
            },
          ],
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        },
      ),
    );

    const result = await getPopularMovies();

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.themoviedb.org/3/movie/popular?language=ja-JP&page=1",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer test-token",
        }),
      }),
    );

    expect(result).toEqual([
      {
        id: 101,
        title: "テスト映画",
        mediaType: "movie",
        releaseYear: "2025",
        rank: 1,
        posterPath: "/test-movie.jpg",
      },
    ]);
  });
});
