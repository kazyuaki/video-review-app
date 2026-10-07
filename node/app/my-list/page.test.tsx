import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import MyListPage from "./page";
import { apiDeleteMock, apiGetMock } from "@/tests/mocks";

const authState = vi.hoisted(() => ({
  user: { id: 1, name: "テストユーザー" } as {
    id: number;
    name: string;
  } | null,
  isLoading: false,
}));

vi.mock("@/components/auth/AuthProvider", () => ({
  useAuth: () => authState,
}));

/**
 * マイリスト画面を検証する。
 */
describe("MyListPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    authState.user = { id: 1, name: "テストユーザー" };
    authState.isLoading = false;

    apiGetMock.mockResolvedValue({
      data: {
        viewingRecords: [
          {
            id: 1,
            status: "watching",
            vodService: "Netflix",
            startedAt: "2026-10-01",
            watchedAt: null,
            work: {
              tmdbId: 12345,
              mediaType: "movie",
              title: "テスト映画",
              posterPath: "/test-poster.jpg",
            },
          },
          {
            id: 2,
            status: "watched",
            vodService: "U-NEXT",
            startedAt: "2026-10-02",
            watchedAt: "2026-10-07",
            work: {
              tmdbId: 67890,
              mediaType: "tv",
              title: "別のテスト作品",
              posterPath: null,
            },
          },
        ],
      },
    });
    apiDeleteMock.mockResolvedValue({});
  });

  // NF026: 自分の視聴記録一覧を表示できる
  it("ログイン中ユーザーの視聴記録を表示できる", async () => {
    render(<MyListPage />);

    expect(
      await screen.findByRole("heading", { name: "マイリスト" }),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(apiGetMock).toHaveBeenCalledWith("/api/viewing-records");
    });

    expect(screen.getByRole("link", { name: "テスト映画" })).toHaveAttribute(
      "href",
      "/works/movie/12345",
    );
    expect(screen.getByAltText("テスト映画のポスター")).toBeInTheDocument();
    expect(
      screen.getByAltText("テスト映画のポスター").closest("a"),
    ).toHaveAttribute("href", "/works/movie/12345");
    const workCard = screen.getByText("テスト映画").closest("li");

    expect(workCard).not.toBeNull();
    expect(within(workCard!).getByText("視聴中")).toBeInTheDocument();
    expect(within(workCard!).getByText("Netflix")).toBeInTheDocument();
    expect(
      within(workCard!).getByText("視聴開始日: 2026年10月1日"),
    ).toBeInTheDocument();
  });

  // NF027: 視聴状況で絞り込める
  it("視聴状況を選択すると該当する作品だけを表示できる", async () => {
    render(<MyListPage />);

    await screen.findByText("テスト映画");

    expect(screen.getByText("別のテスト作品")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("視聴状況で絞り込む"), {
      target: { value: "watching" },
    });

    expect(screen.getByText("テスト映画")).toBeInTheDocument();
    expect(screen.queryByText("別のテスト作品")).not.toBeInTheDocument();

    expect(apiGetMock).toHaveBeenCalledTimes(1);
  });

  // NF028: マイリストから作品を削除できる
  it("削除確認で確定すると削除APIを呼び出し、一覧から作品が消える", async () => {
    render(<MyListPage />);

    await screen.findByText("テスト映画");

    const workCard = screen.getByText("テスト映画").closest("li");

    expect(workCard).not.toBeNull();

    fireEvent.click(
      within(workCard!).getByRole("button", { name: "登録を解除" }),
    );

    expect(
      screen.getByRole("dialog", { name: "マイリストから削除しますか？" }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "削除する" }));

    await waitFor(() => {
      expect(apiDeleteMock).toHaveBeenCalledWith(
        "/api/works/movie/12345/viewing-records/me",
      );
    });

    expect(apiGetMock).toHaveBeenCalledWith("/sanctum/csrf-cookie");
    expect(screen.queryByText("テスト映画")).not.toBeInTheDocument();
    expect(screen.getByText("別のテスト作品")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(
      "マイリストから作品を削除しました。",
    );
  });

  // NF029: 削除確認をキャンセルできる
  it("削除確認をキャンセルすると削除APIを呼ばず、作品を表示し続ける", async () => {
    render(<MyListPage />);

    await screen.findByText("テスト映画");

    const workCard = screen.getByText("テスト映画").closest("li");

    expect(workCard).not.toBeNull();

    fireEvent.click(
      within(workCard!).getByRole("button", { name: "登録を解除" }),
    );

    fireEvent.click(screen.getByRole("button", { name: "キャンセル" }));

    expect(apiDeleteMock).not.toHaveBeenCalled();
    expect(screen.getByText("テスト映画")).toBeInTheDocument();
    expect(
      screen.queryByRole("dialog", { name: "マイリストから削除しますか？" }),
    ).not.toBeInTheDocument();
  });
});
