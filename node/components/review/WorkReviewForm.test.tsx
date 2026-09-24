import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { WorkReviewForm } from "./WorkReviewForm";
import {
  apiGetMock,
  apiPostMock,
  apiPutMock,
  refreshMock,
} from "@/tests/mocks";

/**
 * レビュー投稿フォームのテスト。
 */
describe("WorkReviewForm", () => {
  const onCompleteMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    apiGetMock.mockResolvedValue({});
    apiPostMock.mockResolvedValue({});
    apiPutMock.mockResolvedValue({});

    onCompleteMock.mockResolvedValue(undefined);
  });

  // NF024: 評価と本文を投稿できる
  it("評価と本文を入力してレビューを投稿できる", async () => {
    render(
      <WorkReviewForm
        mediaType="movie"
        tmdbId={12345}
        title="テスト映画"
        ownReview={null}
        onComplete={onCompleteMock}
        onCancel={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText("評価"), {
      target: { value: "4" },
    });

    fireEvent.change(screen.getByLabelText("レビュー本文"), {
      target: { value: "とても楽しめた作品でした。" },
    });

    fireEvent.click(screen.getByRole("button", { name: "レビューを投稿" }));

    await waitFor(() => {
      expect(apiPostMock).toHaveBeenCalledWith(
        "/api/works/movie/12345/reviews",
        {
          title: "テスト映画",
          rating: 4,
          content: "とても楽しめた作品でした。",
          has_spoiler: false,
        },
      );
    });

    expect(apiGetMock).toHaveBeenCalledWith("/sanctum/csrf-cookie");
    expect(onCompleteMock).toHaveBeenCalledWith(false);
    expect(refreshMock).toHaveBeenCalledOnce();
  });

  // NF025: 評価未選択時にエラーを表示できる
  it("評価を選択せずに投稿するとエラーを表示し、APIを呼び出さない", () => {
    render(
      <WorkReviewForm
        mediaType="movie"
        tmdbId={12345}
        title="テスト映画"
        ownReview={null}
        onComplete={onCompleteMock}
        onCancel={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText("レビュー本文"), {
      target: { value: "とても楽しめた作品でした。" },
    });

    fireEvent.click(screen.getByRole("button", { name: "レビューを投稿" }));

    expect(screen.getByText("評価を選択してください。")).toBeInTheDocument();
    expect(apiGetMock).not.toHaveBeenCalled();
    expect(apiPostMock).not.toHaveBeenCalled();
    expect(onCompleteMock).not.toHaveBeenCalled();
  });

  // NF026: 本文未入力時にエラーを表示できる
  it("本文を入力せずに投稿するとエラーを表示し、APIを呼び出さない", () => {
    render(
      <WorkReviewForm
        mediaType="movie"
        tmdbId={12345}
        title="テスト映画"
        ownReview={null}
        onComplete={onCompleteMock}
        onCancel={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText("評価"), {
      target: { value: "4" },
    });

    fireEvent.click(screen.getByRole("button", { name: "レビューを投稿" }));

    expect(
      screen.getByText("レビュー本文を入力してください。"),
    ).toBeInTheDocument();
    expect(apiGetMock).not.toHaveBeenCalled();
    expect(apiPostMock).not.toHaveBeenCalled();
    expect(onCompleteMock).not.toHaveBeenCalled();
  });

  // NF027: 文字数超過時にエラーを表示できる
  it("2000文字を超える本文ではエラーを表示し、APIを呼び出さない", () => {
    render(
      <WorkReviewForm
        mediaType="movie"
        tmdbId={12345}
        title="テスト映画"
        ownReview={null}
        onComplete={onCompleteMock}
        onCancel={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText("評価"), {
      target: { value: "4" },
    });

    fireEvent.change(screen.getByLabelText("レビュー本文"), {
      target: { value: "あ".repeat(2001) },
    });

    fireEvent.click(screen.getByRole("button", { name: "レビューを投稿" }));

    expect(
      screen.getByText("レビュー本文は2,000文字以内で入力してください。"),
    ).toBeInTheDocument();
    expect(apiGetMock).not.toHaveBeenCalled();
    expect(apiPostMock).not.toHaveBeenCalled();
    expect(onCompleteMock).not.toHaveBeenCalled();
  });

  // NF028: 既存レビューを編集できる
  it("既存レビューの評価と本文を変更して更新できる", async () => {
    render(
      <WorkReviewForm
        mediaType="movie"
        tmdbId={12345}
        title="テスト映画"
        ownReview={{
          id: 1,
          rating: 3,
          content: "変更前のレビューです。",
          hasSpoiler: false,
          createdAt: "2026-09-24T00:00:00.000Z",
          updatedAt: "2026-09-24T00:00:00.000Z",
        }}
        onComplete={onCompleteMock}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByLabelText("評価")).toHaveValue("3");
    expect(screen.getByLabelText("レビュー本文")).toHaveValue(
      "変更前のレビューです。",
    );

    fireEvent.change(screen.getByLabelText("評価"), {
      target: { value: "5" },
    });

    fireEvent.change(screen.getByLabelText("レビュー本文"), {
      target: { value: "変更後のレビューです。" },
    });

    fireEvent.click(screen.getByRole("button", { name: "レビューを更新" }));

    await waitFor(() => {
      expect(apiPutMock).toHaveBeenCalledWith(
        "/api/works/movie/12345/reviews/me",
        {
          rating: 5,
          content: "変更後のレビューです。",
          has_spoiler: false,
        },
      );
    });

    expect(onCompleteMock).toHaveBeenCalledWith(true);
    expect(refreshMock).toHaveBeenCalledOnce();
  });
});
