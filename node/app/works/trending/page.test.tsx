import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import TrendingWorksPage from "./page";
import { getTrendingWorksPage } from "@/lib/tmdb";

vi.mock("@/lib/tmdb", () => ({
  getTrendingWorksPage: vi.fn(),
}));

/**
 * 話題の作品一覧画面を検証する。
 */
describe("TrendingWorksPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(getTrendingWorksPage).mockResolvedValue({
      works: [
        {
          id: 301,
          title: "話題の映画",
          mediaType: "movie",
          releaseYear: "2025",
          posterPath: "/trending-movie.jpg",
        },
        {
          id: 302,
          title: "話題のTVシリーズ",
          mediaType: "tv",
          releaseYear: "2024",
          posterPath: "/trending-tv.jpg",
        },
      ],
      currentPage: 1,
      totalPages: 2,
    });
  });

  // NF014: 話題の映画・TVシリーズを表示できる
  it("話題の映画・TVシリーズのタイトルとポスターを表示できる", async () => {
    render(
      await TrendingWorksPage({
        searchParams: Promise.resolve({}),
      }),
    );

    expect(getTrendingWorksPage).toHaveBeenCalledWith(1);

    expect(
      screen.getByRole("heading", { name: "話題の作品" }),
    ).toBeInTheDocument();

    expect(screen.getByText("話題の映画")).toBeInTheDocument();
    expect(screen.getByAltText("話題の映画のポスター")).toBeInTheDocument();

    expect(screen.getByText("話題のTVシリーズ")).toBeInTheDocument();
    expect(
      screen.getByAltText("話題のTVシリーズのポスター"),
    ).toBeInTheDocument();
  });
});
