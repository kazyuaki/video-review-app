import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import MovieRankingPage from "./page";
import { getPopularMoviesPage } from "@/lib/tmdb";

vi.mock("@/lib/tmdb", () => ({
  getPopularMoviesPage: vi.fn(),
}));

/**
 * 映画ランキング一覧画面を検証する。
 */
describe("MovieRankingPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(getPopularMoviesPage).mockResolvedValue({
      works: [
        {
          id: 101,
          title: "人気映画",
          mediaType: "movie",
          releaseYear: "2025",
          rank: 1,
          posterPath: "/popular-movie.jpg",
        },
      ],
      currentPage: 1,
      totalPages: 2,
    });
  });

  // NF012: 人気映画をランキング形式で表示できる
  it("人気映画のタイトル、ポスター、順位を表示できる", async () => {
    render(
      await MovieRankingPage({
        searchParams: Promise.resolve({}),
      }),
    );

    expect(getPopularMoviesPage).toHaveBeenCalledWith(1);

    expect(
      screen.getByRole("heading", { name: "映画ランキング" }),
    ).toBeInTheDocument();

    const movieCard = screen.getByText("人気映画").closest("a");

    expect(movieCard).not.toBeNull();
    expect(
      within(movieCard!).getByAltText("人気映画のポスター"),
    ).toBeInTheDocument();
    expect(within(movieCard!).getByText("1")).toBeInTheDocument();
  });
  // NF015: ページ切替で次の作品一覧を取得できる
  it("2ページ目を指定すると、2ページ目の作品と前ページへのリンクを表示できる", async () => {
    vi.mocked(getPopularMoviesPage).mockResolvedValue({
      works: [
        {
          id: 121,
          title: "2ページ目の映画",
          mediaType: "movie",
          releaseYear: "2024",
          rank: 21,
          posterPath: "/second-page-movie.jpg",
        },
      ],
      currentPage: 2,
      totalPages: 2,
    });

    render(
      await MovieRankingPage({
        searchParams: Promise.resolve({
          page: "2",
        }),
      }),
    );

    expect(getPopularMoviesPage).toHaveBeenCalledWith(2);
    expect(screen.getByText("2ページ目の映画")).toBeInTheDocument();
    expect(screen.getByText("2 / 2")).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "← 前へ" })).toHaveAttribute(
      "href",
      "/works/rankings/movie?page=1",
    );

    expect(
      screen.queryByRole("link", { name: "次へ →" }),
    ).not.toBeInTheDocument();
  });
});
