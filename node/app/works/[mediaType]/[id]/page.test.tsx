import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import WorkDetailPage from "./page";
import { getWorkDetail } from "@/lib/tmdb";
import { getWorkReviews } from "@/lib/reviews";
import { TmdbApiError } from "@/lib/tmdb/client";

const { notFound } = vi.hoisted(() => ({
  notFound: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  notFound,
  usePathname: () => "/",
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

vi.mock("@/lib/tmdb", () => ({
  getWorkDetail: vi.fn(),
}));

vi.mock("@/lib/reviews", () => ({
  getWorkReviews: vi.fn(),
}));

vi.mock("@/components/auth/AuthProvider", () => ({
  useAuth: () => ({
    user: null,
    isLoading: false,
  }),
}));

/**
 * 作品詳細画面の表示を検証する。
 */
describe("WorkDetailPage", () => {
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
      genres: ["アクション", "SF"],
      cast: [
        {
          id: 1,
          name: "テスト出演者",
          character: "主人公",
          profilePath: "/test-profile.jpg",
        },
      ],
      streamingServices: [],
      isRecentRelease: false,
    });

    vi.mocked(getWorkReviews).mockResolvedValue({
      averageRating: 0,
      reviewCount: 0,
      reviews: [],
    });
  });

  // NF015: 作品の詳細情報を表示できる
  it("作品の画像、タイトル、概要、公開年、ジャンル、出演者を表示できる", async () => {
    render(
      await WorkDetailPage({
        params: Promise.resolve({
          mediaType: "movie",
          id: "12345",
        }),
      }),
    );

    expect(getWorkDetail).toHaveBeenCalledWith(12345, "movie");
    expect(getWorkReviews).toHaveBeenCalledWith("movie", 12345);

    expect(screen.getByAltText("テスト映画のポスター")).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: "テスト映画" }),
    ).toBeInTheDocument();

    expect(screen.getByText("テスト映画のあらすじです。")).toBeInTheDocument();
    expect(screen.getByText("2026")).toBeInTheDocument();
    expect(screen.getByText("アクション")).toBeInTheDocument();
    expect(screen.getByText("SF")).toBeInTheDocument();

    expect(screen.getByRole("heading", { name: "出演者" })).toBeInTheDocument();

    expect(screen.getByText("テスト出演者")).toBeInTheDocument();
    expect(screen.getByText("主人公")).toBeInTheDocument();
  });

  // NF016: 作品に紐づくレビューを表示できる
  it("作品に紐づくレビューの投稿者、評価、本文、投稿日を表示できる", async () => {
    vi.mocked(getWorkReviews).mockResolvedValue({
      averageRating: 4.0,
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
    });

    render(
      await WorkDetailPage({
        params: Promise.resolve({
          mediaType: "movie",
          id: "12345",
        }),
      }),
    );

    expect(
      screen.getByRole("heading", { name: "レビュー" }),
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

  // NF017: 存在しない作品では作品が見つからない画面を表示する
  it("TMDB APIが404を返した場合はnotFoundを呼び出す", async () => {
    const notFoundError = new Error("NEXT_NOT_FOUND");

    vi.mocked(getWorkDetail).mockRejectedValue(new TmdbApiError(404));
    notFound.mockImplementation(() => {
      throw notFoundError;
    });

    await expect(
      WorkDetailPage({
        params: Promise.resolve({
          mediaType: "movie",
          id: "12345",
        }),
      }),
    ).rejects.toThrow(notFoundError);

    expect(notFound).toHaveBeenCalledOnce();
    expect(getWorkReviews).toHaveBeenCalledWith("movie", 12345);
  });
});
