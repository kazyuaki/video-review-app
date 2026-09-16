import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getTrendingWorks } from "./trending";

/**
 * 話題の作品取得処理のテスト。
 * 映画とTVシリーズを作品情報へ変換し、人物を除外できることを確認する。
 */
describe("getTrendingWorks", () => {
  beforeEach(() => {
    process.env.TMDB_API_TOKEN = "test-token";
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete process.env.TMDB_API_TOKEN;
  });

  it("映画とTVシリーズをWork形式に変換し、人物を除外できる", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          results: [
            {
              id: 301,
              media_type: "movie",
              title: "テスト映画",
              poster_path: "/movie.jpg",
              release_date: "2025-01-15",
            },
            {
              id: 302,
              media_type: "tv",
              name: "テストTVシリーズ",
              poster_path: "/tv.jpg",
              first_air_date: "2024-10-01",
            },
            {
              id: 303,
              media_type: "person",
              name: "テスト人物",
              poster_path: "/person.jpg",
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

    const result = await getTrendingWorks();

    expect(result).toEqual([
      {
        id: 301,
        title: "テスト映画",
        mediaType: "movie",
        releaseYear: "2025",
        posterPath: "/movie.jpg",
      },
      {
        id: 302,
        title: "テストTVシリーズ",
        mediaType: "tv",
        releaseYear: "2024",
        posterPath: "/tv.jpg",
      },
    ]);
  });
});
