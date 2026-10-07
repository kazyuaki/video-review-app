import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getPopularTvShows } from "./tv";

/**
 * 日本で視聴可能な人気TVシリーズ取得処理のテスト。
 * TMDBのレスポンスをアプリ内で扱う作品情報へ変換できることを確認する。
 */
describe("getPopularTvShows", () => {
  beforeEach(() => {
    process.env.TMDB_API_TOKEN = "test-token";
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete process.env.TMDB_API_TOKEN;
  });

  it("日本で視聴可能な人気TVシリーズをWork形式に変換して取得できる", async () => {
    const fetchMock = vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          page: 1,
          total_pages: 500,
          results: [
            {
              id: 201,
              name: "テストTVシリーズ",
              poster_path: "/test-tv.jpg",
              first_air_date: "2024-10-01",
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

    const result = await getPopularTvShows();

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.themoviedb.org/3/discover/tv?language=ja-JP&page=1&watch_region=JP&with_watch_monetization_types=flatrate|free|ads&sort_by=popularity.desc",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer test-token",
        }),
      }),
    );

    expect(result).toEqual([
      {
        id: 201,
        title: "テストTVシリーズ",
        mediaType: "tv",
        releaseYear: "2024",
        rank: 1,
        posterPath: "/test-tv.jpg",
      },
    ]);
  });
});
