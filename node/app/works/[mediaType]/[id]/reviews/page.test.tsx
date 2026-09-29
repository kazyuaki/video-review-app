import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import WorkReviewListPage from "./page";
import { getWorkReviews } from "@/lib/reviews";
import { getWorkDetail } from "@/lib/tmdb";

vi.mock("@/lib/tmdb", () => ({
  getWorkDetail: vi.fn(),
}));

vi.mock("@/lib/reviews", () => ({
  getWorkReviews: vi.fn(),
}));

/**
 * 作品ごとのレビュー一覧画面を検証する。
 */
describe("WorkReviewListPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(getWorkDetail).mockResolvedValue({
      id: 12345,
      title: "テスト映画",
      mediaType: "movie",
      overview: "テスト映画のあらすじです。",
      posterPath: "/test-poster.jpg",
      backdropPath: "/test-backdrop.jpg",
      releaseYear: "2026",
      genres: ["アクション"],
      cast: [],
      streamingServices: [],
      isRecentRelease: false,
    });

    vi.mocked(getWorkReviews).mockResolvedValue({
      averageRating: 4,
      reviewCount: 1,
      reviews: [
        {
          id: 1,
          userName: "テストユーザー",
          rating: 4,
          content: "とても楽しめた作品でした。",
          hasSpoiler: false,
          createdAt: "2026-09-20T00:00:00.000Z",
        },
      ],
      currentPage: 1,
      totalPages: 1,
    });
  });

  // NF032: 新着レビュー一覧を表示できる
  it("作品情報、投稿者、評価、本文を表示できる", async () => {
    render(
      await WorkReviewListPage({
        params: Promise.resolve({
          mediaType: "movie",
          id: "12345",
        }),
        searchParams: Promise.resolve({}),
      }),
    );

    expect(getWorkDetail).toHaveBeenCalledWith(12345, "movie");
    expect(getWorkReviews).toHaveBeenCalledWith("movie", 12345, 1);

    expect(
      screen.getByRole("heading", { name: "テスト映画のレビュー" }),
    ).toBeInTheDocument();

    const reviewCard = screen.getByText("テストユーザー").closest("li");

    expect(reviewCard).not.toBeNull();
    expect(within(reviewCard!).getByText("★ 4.0")).toBeInTheDocument();
    expect(
      within(reviewCard!).getByText("とても楽しめた作品でした。"),
    ).toBeInTheDocument();
    expect(within(reviewCard!).getByText("2026年9月20日")).toBeInTheDocument();
    expect(screen.getByText("1件")).toBeInTheDocument();
  });

  // NF033: ページ切り替えで次のレビューを取得できる
  it("2ページ目を指定すると、2ページ目のレビューを表示できる", async () => {
    vi.mocked(getWorkReviews).mockResolvedValue({
      averageRating: 4,
      reviewCount: 11,
      reviews: [
        {
          id: 11,
          userName: "2ページ目のユーザー",
          rating: 5,
          content: "2ページ目に表示されるレビューです。",
          hasSpoiler: false,
          createdAt: "2026-09-21T00:00:00.000Z",
        },
      ],
      currentPage: 2,
      totalPages: 2,
    });

    render(
      await WorkReviewListPage({
        params: Promise.resolve({
          mediaType: "movie",
          id: "12345",
        }),
        searchParams: Promise.resolve({
          page: "2",
        }),
      }),
    );

    expect(getWorkReviews).toHaveBeenCalledWith("movie", 12345, 2);
    expect(
      screen.getByText("2ページ目に表示されるレビューです。"),
    ).toBeInTheDocument();
    expect(screen.getByText("2 / 2")).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "← 前へ" })).toHaveAttribute(
      "href",
      "/works/movie/12345/reviews?page=1",
    );

    expect(
      screen.queryByRole("link", { name: "次へ →" }),
    ).not.toBeInTheDocument();
  });
});
