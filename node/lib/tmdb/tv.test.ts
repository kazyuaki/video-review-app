import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getPopularTvShows } from "./tv";

/**
 * 人気TVシリーズ取得処理のテスト。
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

  it("人気TVシリーズをWork形式に変換して取得できる", async () => {
    const fetchMock = vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
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
      "https://api.themoviedb.org/3/tv/popular?language=ja-JP&page=1",
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
