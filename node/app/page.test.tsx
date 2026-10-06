import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { getRecentReviews } from "@/lib/reviews";

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

vi.mock("@/lib/reviews", () => ({
  getRecentReviews: vi.fn(),
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
    vi.mocked(getRecentReviews).mockResolvedValue({
      reviews: [
        {
          id: 401,
          userName: "新着レビュー投稿者",
          workTitle: "テスト映画",
          tmdbId: 101,
          mediaType: "movie",
          rating: 4,
          content: "新着レビューの本文です。",
          createdAt: "2026-10-06T00:00:00.000Z",
        },
      ],
    });
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

  // NF011: 各作品セクションから対応する一覧画面へ遷移できる
  it("各作品セクションに対応する一覧画面へのリンクを表示できる", async () => {
    render(await Home());

    const movieSection = screen
      .getByRole("heading", { name: "映画ランキング" })
      .closest("section");
    const tvSection = screen
      .getByRole("heading", { name: "TVシリーズランキング" })
      .closest("section");
    const trendingSection = screen
      .getByRole("heading", { name: "話題の作品" })
      .closest("section");

    expect(movieSection).not.toBeNull();
    expect(tvSection).not.toBeNull();
    expect(trendingSection).not.toBeNull();

    expect(
      within(movieSection!).getByRole("link", { name: "もっと見る →" }),
    ).toHaveAttribute("href", "/works/rankings/movie");

    expect(
      within(tvSection!).getByRole("link", { name: "もっと見る →" }),
    ).toHaveAttribute("href", "/works/rankings/tv");

    expect(
      within(trendingSection!).getByRole("link", { name: "もっと見る →" }),
    ).toHaveAttribute("href", "/works/trending");
  });

  // NF036: 新着レビューを表示できる
  it("新着レビューの本文、投稿者、評価を表示できる", async () => {
    render(await Home());

    const section = screen
      .getByRole("heading", { name: "新着レビュー" })
      .closest("section");

    expect(getRecentReviews).toHaveBeenCalledOnce();
    expect(section).not.toBeNull();
    expect(
      within(section!).getByText("新着レビューの本文です。"),
    ).toBeInTheDocument();
    expect(
      within(section!).getByText("新着レビュー投稿者"),
    ).toBeInTheDocument();
    expect(within(section!).getByText("★★★★")).toBeInTheDocument();
  });
});
