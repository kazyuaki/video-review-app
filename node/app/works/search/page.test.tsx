import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import WorkSearchPage from "./page";
import {
  getMovieGenres,
  getTvGenres,
  getWorksByGenre,
  searchWorks,
} from "@/lib/tmdb";

vi.mock("@/lib/tmdb", () => ({
  getMovieGenres: vi.fn(),
  getTvGenres: vi.fn(),
  getWorksByGenre: vi.fn(),
  searchWorks: vi.fn(),
}));

/**
 * 作品検索画面のテスト。
 * 検索結果が画面に正しく表示されることを確認する。
 */
describe("WorkSearchPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(getMovieGenres).mockResolvedValue([]);
    vi.mocked(getTvGenres).mockResolvedValue([]);
    vi.mocked(getWorksByGenre).mockResolvedValue({
      works: [],
      currentPage: 1,
      totalPages: 1,
    });

    vi.mocked(searchWorks).mockResolvedValue({
      works: [
        {
          id: 101,
          title: "テスト映画",
          mediaType: "movie",
          releaseYear: "2025",
          posterPath: "/test-movie.jpg",
        },
        {
          id: 201,
          title: "テストTVシリーズ",
          mediaType: "tv",
          releaseYear: "2024",
          posterPath: "/test-tv.jpg",
        },
      ],
      currentPage: 1,
      totalPages: 1,
    });
  });

  // NF012: 検索結果に作品情報を表示できる
  it("検索結果のポスター、作品名、公開年、作品種別を表示できる", async () => {
    render(
      await WorkSearchPage({
        searchParams: Promise.resolve({
          query: "テスト作品",
        }),
      }),
    );

    expect(searchWorks).toHaveBeenCalledWith("テスト作品", "", 1);

    expect(screen.getByText("テスト映画")).toBeInTheDocument();
    expect(screen.getByAltText("テスト映画のポスター")).toBeInTheDocument();
    expect(screen.getByText("2025・映画")).toBeInTheDocument();

    expect(screen.getByText("テストTVシリーズ")).toBeInTheDocument();
    expect(
      screen.getByAltText("テストTVシリーズのポスター"),
    ).toBeInTheDocument();
    expect(screen.getByText("2024・TVシリーズ")).toBeInTheDocument();
  });

  // NF013: 検索結果が0件の場合の表示ができる
  it("検索結果が0件の場合の表示ができる", async () => {
    vi.mocked(searchWorks).mockResolvedValue({
      works: [],
      currentPage: 1,
      totalPages: 1,
    });

    render(
      await WorkSearchPage({
        searchParams: Promise.resolve({
          query: "見つからない作品",
        }),
      }),
		);
		
		expect(
			screen.getByText("該当する作品が見つかりませんでした。"),
		).toBeInTheDocument();
  });
});
