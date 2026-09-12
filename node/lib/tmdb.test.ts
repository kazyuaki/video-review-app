import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getPopularMovies,
  getPopularTvShows,
  getTrendingWorks,
} from "@/lib/tmdb";

/**
 * TMDB API連携処理のテスト。
 * APIレスポンスをアプリ内の作品情報へ正しく変換できることを確認する。
 */
describe("getPopularMovies", () => {
  beforeEach(() => {
    process.env.TMDB_API_TOKEN = "test-token";
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("人気映画をWork形式に変換して取得できる", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          results: [
            {
              id: 101,
              title: "テスト映画",
              poster_path: "/test-movie.jpg",
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

    expect(result).toEqual([
      {
        id: 101,
        title: "テスト映画",
        rank: 1,
        posterPath: "/test-movie.jpg",
      },
    ]);
  });

  it("TMDB APIの取得に失敗した場合はエラーになる", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(null, {
        status: 500,
      }),
    );

    await expect(getPopularMovies()).rejects.toThrow(
      "人気映画の取得に失敗しました。",
    );
  });
});

/**
 * 人気TVシリーズ取得処理のテスト。
 * TMDBのTVシリーズ情報をWork形式へ正しく変換できることを確認する。
 */
describe("getPopularTvShows", () => {
  beforeEach(() => {
    process.env.TMDB_API_TOKEN = "test-token";
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("人気TVシリーズをWork形式に変換して取得できる", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          results: [
            {
              id: 201,
              name: "テストTVシリーズ",
              poster_path: "/test-tv.jpg",
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

    expect(result).toEqual([
      {
        id: 201,
        title: "テストTVシリーズ",
        rank: 1,
        posterPath: "/test-tv.jpg",
      },
    ]);
  });
});

/**
 * トレンド作品取得処理のテスト。
 * 映画とTVシリーズをWork形式へ正しく変換し、人物を除外できることを確認する。
 */
describe("getTrendingWorks", () => {
  beforeEach(() => {
    process.env.TMDB_API_TOKEN = "test-token";
  });

  afterEach(() => {
    vi.restoreAllMocks();
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
            },
            {
              id: 302,
              media_type: "tv",
              name: "テストTVシリーズ",
              poster_path: "/tv.jpg",
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
        posterPath: "/movie.jpg",
      },
      {
        id: 302,
        title: "テストTVシリーズ",
        posterPath: "/tv.jpg",
      },
    ]);
  });
});
