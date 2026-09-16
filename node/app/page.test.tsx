import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";

import Home from "./page";
import {
  getPopularMovies,
  getPopularTvShows,
  getTrendingWorks,
} from "@/lib/tmdb";

vi.mock("@/lib/tmdb", () => ({
  getPopularMovies: vi.fn(),
  getPopularTvShows: vi.fn(),
  getTrendingWorks: vi.fn(),
}));

/**
 * トップページ作品表示のテスト。
 * 人気映画、人気TVシリーズ、話題の作品が画面に表示されることを確認する。
 */
describe("Home", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(getPopularMovies).mockResolvedValue([
      {
        id: 101,
        title: "人気映画",
        mediaType: "movie",
        releaseYear: "2025",
        rank: 1,
        posterPath: "/popular-movie.jpg",
      },
    ]);

    vi.mocked(getPopularTvShows).mockResolvedValue([
      {
        id: 201,
        title: "人気TVシリーズ",
        mediaType: "tv",
        releaseYear: "2024",
        rank: 1,
        posterPath: "/popular-tv.jpg",
      },
    ]);

    vi.mocked(getTrendingWorks).mockResolvedValue([
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
    ]);
  });

  // NF008: 人気映画を表示できる
  it("人気映画を表示できる", async () => {
    render(await Home());

    const section = screen
      .getByRole("heading", { name: "映画ランキング" })
      .closest("section");

    expect(getPopularMovies).toHaveBeenCalledOnce();
    expect(section).not.toBeNull();
    expect(within(section!).getByText("人気映画")).toBeInTheDocument();
    expect(
      within(section!).getByAltText("人気映画のポスター"),
    ).toBeInTheDocument();
    expect(within(section!).getByText("1")).toBeInTheDocument();
  });

  // NF009: 人気TVシリーズを表示できる
  it("人気TVシリーズを表示できる", async () => {
    render(await Home());

    const section = screen
      .getByRole("heading", { name: "TVシリーズランキング" })
      .closest("section");

    expect(getPopularTvShows).toHaveBeenCalledOnce();
    expect(section).not.toBeNull();
    expect(within(section!).getByText("人気TVシリーズ")).toBeInTheDocument();
    expect(
      within(section!).getByAltText("人気TVシリーズのポスター"),
    ).toBeInTheDocument();
    expect(within(section!).getByText("1")).toBeInTheDocument();
  });

  // NF010: 話題の映画・TV作品を表示できる
  it("話題の映画・TVシリーズを表示できる", async () => {
    render(await Home());

    const section = screen
      .getByRole("heading", { name: "話題の作品" })
      .closest("section");

    expect(getTrendingWorks).toHaveBeenCalledOnce();
    expect(section).not.toBeNull();
    expect(within(section!).getByText("話題の映画")).toBeInTheDocument();
    expect(within(section!).getByText("話題のTVシリーズ")).toBeInTheDocument();
  });
});
