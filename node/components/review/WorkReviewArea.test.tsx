import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { WorkReviewArea } from "./WorkReviewArea";
import {
  apiDeleteMock,
  apiGetMock,
  refreshMock,
} from "@/tests/mocks";

const authState = vi.hoisted(() => ({
  user: { id: 1, name: "テストユーザー" },
  isLoading: false,
}));

vi.mock("@/components/auth/AuthProvider", () => ({
  useAuth: () => authState,
}));

const ownReview = {
  id: 1,
  rating: 4,
  content: "自分のレビューです。",
  hasSpoiler: false,
  createdAt: "2026-09-20T00:00:00.000Z",
  updatedAt: "2026-09-20T00:00:00.000Z",
};

const reviewData = {
  averageRating: 4,
  reviewCount: 1,
  reviews: [
    {
      id: 1,
      userName: "テストユーザー",
      rating: 4,
      content: "自分のレビューです。",
      hasSpoiler: false,
      createdAt: "2026-09-20T00:00:00.000Z",
    },
  ],
};

/**
 * レビューの編集・削除操作を検証する。
 */
describe("WorkReviewArea", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authState.user = { id: 1, name: "テストユーザー" };
    authState.isLoading = false;
    apiGetMock.mockResolvedValue({ data: ownReview });
    apiDeleteMock.mockResolvedValue({});
  });

  function renderArea(data = reviewData) {
    return render(
      <WorkReviewArea
        mediaType="movie"
        tmdbId={12345}
        title="テスト映画"
        reviewData={data}
      />,
    );
  }

  // NF029: 他人のレビューには編集操作を表示しない
  it("他人のレビューには編集ボタンと削除ボタンを表示しない", async () => {
    renderArea({
      ...reviewData,
      reviews: [
        {
          ...reviewData.reviews[0],
          id: 2,
          userName: "別ユーザー",
          content: "別ユーザーのレビューです。",
        },
      ],
    });

    await waitFor(() => {
      expect(apiGetMock).toHaveBeenCalledWith(
        "/api/works/movie/12345/reviews/me",
      );
    });

    expect(screen.getByText("別ユーザーのレビューです。")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "編集" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "削除" })).not.toBeInTheDocument();
  });

  // NF030: 確認後に自分のレビューを削除できる
  it("削除確認で確定すると削除APIを呼び出し、更新後の一覧からレビューが消える", async () => {
    const { rerender } = renderArea();

    await screen.findByRole("button", { name: "削除" });
    fireEvent.click(screen.getByRole("button", { name: "削除" }));
    fireEvent.click(
      screen.getByRole("button", { name: "削除する" }),
    );

    await waitFor(() => {
      expect(apiDeleteMock).toHaveBeenCalledWith(
        "/api/works/movie/12345/reviews/me",
      );
    });

    expect(apiGetMock).toHaveBeenCalledWith("/sanctum/csrf-cookie");
    expect(refreshMock).toHaveBeenCalledOnce();

    rerender(
      <WorkReviewArea
        mediaType="movie"
        tmdbId={12345}
        title="テスト映画"
        reviewData={{ ...reviewData, reviewCount: 0, reviews: [] }}
      />,
    );

    expect(screen.queryByText("自分のレビューです。")).not.toBeInTheDocument();
  });

  // NF031: 削除確認をキャンセルできる
  it("削除確認をキャンセルすると削除APIを呼び出さず、レビューを表示し続ける", async () => {
    renderArea();

    await screen.findByRole("button", { name: "削除" });
    fireEvent.click(screen.getByRole("button", { name: "削除" }));
    fireEvent.click(screen.getByRole("button", { name: "キャンセル" }));

    expect(apiDeleteMock).not.toHaveBeenCalled();
    expect(screen.getByText("自分のレビューです。")).toBeInTheDocument();
    expect(
      screen.queryByRole("dialog", { name: "レビューを削除しますか？" }),
    ).not.toBeInTheDocument();
  });
});
