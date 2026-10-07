import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import TvRankingPage from "./page";
import { getPopularTvShowsPage } from "@/lib/tmdb";

vi.mock("@/lib/tmdb", () => ({
  getPopularTvShowsPage: vi.fn(),
}));

/**
 * TVシリーズランキング一覧画面を検証する。
 */
describe("TvRankingPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(getPopularTvShowsPage).mockResolvedValue({
      works: [
        {
          id: 201,
          title: "人気TVシリーズ",
          mediaType: "tv",
          releaseYear: "2024",
          rank: 1,
          posterPath: "/popular-tv.jpg",
        },
      ],
      currentPage: 1,
      totalPages: 2,
    });
  });

  // NF013: 人気TVシリーズをランキング形式で表示できる
  it("人気TVシリーズのタイトル、ポスター、順位を表示できる", async () => {
    render(
      await TvRankingPage({
        searchParams: Promise.resolve({}),
      }),
    );

    expect(getPopularTvShowsPage).toHaveBeenCalledWith(1);

    expect(
      screen.getByRole("heading", { name: "日本で配信中の人気TVシリーズ" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "日本で定額・無料・広告付き配信されているTVシリーズを人気順に表示します。",
      ),
    ).toBeInTheDocument();

    const tvCard = screen.getByText("人気TVシリーズ").closest("a");

    expect(tvCard).not.toBeNull();
    expect(
      within(tvCard!).getByAltText("人気TVシリーズのポスター"),
    ).toBeInTheDocument();
    expect(within(tvCard!).getByText("1")).toBeInTheDocument();
  });
});
