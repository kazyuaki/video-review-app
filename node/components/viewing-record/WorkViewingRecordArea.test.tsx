import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { WorkViewingRecordArea } from "./WorkViewingRecordArea";
import { apiGetMock, apiPostMock, apiPutMock } from "@/tests/mocks";

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
 * 作品詳細の視聴記録操作を検証する。
 */
describe("WorkViewingRecordArea", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    authState.user = { id: 1, name: "テストユーザー" };
    authState.isLoading = false;

    apiGetMock.mockResolvedValue({});

    apiPostMock.mockResolvedValue({
      data: {
        id: 1,
        status: "want_to_watch",
        vodService: null,
        startedAt: null,
        watchedAt: null,
      },
    });
  });

  function renderArea() {
    return render(
      <WorkViewingRecordArea
        mediaType="movie"
        tmdbId={12345}
        title="テスト映画"
        posterPath="/test-poster.jpg"
      />,
    );
  }

  // NF023: 作品を視聴記録へ登録できる
  it("視聴状況を選択してマイリストへ登録できる", async () => {
    apiGetMock.mockImplementationOnce(() =>
      Promise.reject({
        isAxiosError: true,
        response: { status: 404 },
      }),
    );

    renderArea();

    await screen.findByRole("button", { name: "マイリストに登録" });

    fireEvent.change(screen.getByLabelText("視聴状況"), {
      target: { value: "watching" },
    });
    fireEvent.change(screen.getByLabelText("視聴した配信サービス"), {
      target: { value: "Netflix" },
    });
    fireEvent.change(screen.getByLabelText("視聴開始日"), {
      target: { value: "2026-10-01" },
    });
    fireEvent.change(screen.getByLabelText("視聴完了日"), {
      target: { value: "2026-10-07" },
    });
    fireEvent.click(screen.getByRole("button", { name: "マイリストに登録" }));

    await waitFor(() => {
      expect(apiPostMock).toHaveBeenCalledWith(
        "/api/works/movie/12345/viewing-records",
        {
          title: "テスト映画",
          poster_path: "/test-poster.jpg",
          status: "watching",
          vod_service: "Netflix",
          started_at: "2026-10-01",
          watched_at: "2026-10-07",
        },
      );
    });

    expect(apiGetMock).toHaveBeenCalledWith("/sanctum/csrf-cookie");
    expect(screen.getByRole("status")).toHaveTextContent(
      "マイリストに登録しました。",
    );
  });

  // NF024: 登録済み作品では現在の状況を表示できる
  it("登録済みの視聴情報を選択状態で表示できる", async () => {
    apiGetMock.mockResolvedValue({
      data: {
        id: 1,
        status: "watched",
        vodService: "Netflix",
        startedAt: "2026-10-01",
        watchedAt: "2026-10-07",
      },
    });

    renderArea();

    expect(await screen.findByLabelText("視聴状況")).toHaveValue("watched");
    expect(screen.getByLabelText("視聴した配信サービス")).toHaveValue(
      "Netflix",
    );
    expect(screen.getByLabelText("視聴開始日")).toHaveValue("2026-10-01");
    expect(screen.getByLabelText("視聴完了日")).toHaveValue("2026-10-07");
    expect(
      screen.getByRole("button", { name: "視聴状況を更新" }),
    ).toBeInTheDocument();
  });

  // NF025: 未認証時はログインへ誘導される
  it("未ログイン時はログインへの導線を表示し、APIを呼び出さない", () => {
    authState.user = null;

    renderArea();

    expect(
      screen.getByText(
        (_, element) =>
          element?.textContent ===
          "マイリストへ登録するにはログインが必要です。",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "ログイン" })).toHaveAttribute(
      "href",
      "/login",
    );
    expect(apiGetMock).not.toHaveBeenCalled();
  });

  it("登録済み作品の視聴情報を変更して更新できる", async () => {
    apiGetMock.mockResolvedValue({
      data: {
        id: 1,
        status: "want_to_watch",
        vodService: "Amazon Prime Video",
        startedAt: "2026-09-20",
        watchedAt: null,
      },
    });

    apiPutMock.mockResolvedValue({
      data: {
        id: 1,
        status: "watched",
        vodService: "Netflix",
        startedAt: "2026-10-01",
        watchedAt: "2026-10-07",
      },
    });

    renderArea();

    await screen.findByRole("button", { name: "視聴状況を更新" });

    fireEvent.change(screen.getByLabelText("視聴状況"), {
      target: { value: "watched" },
    });
    fireEvent.change(screen.getByLabelText("視聴した配信サービス"), {
      target: { value: "Netflix" },
    });
    fireEvent.change(screen.getByLabelText("視聴開始日"), {
      target: { value: "2026-10-01" },
    });
    fireEvent.change(screen.getByLabelText("視聴完了日"), {
      target: { value: "2026-10-07" },
    });
    fireEvent.click(screen.getByRole("button", { name: "視聴状況を更新" }));

    await waitFor(() => {
      expect(apiPutMock).toHaveBeenCalledWith(
        "/api/works/movie/12345/viewing-records/me",
        {
          status: "watched",
          vod_service: "Netflix",
          started_at: "2026-10-01",
          watched_at: "2026-10-07",
        },
      );
    });

    expect(screen.getByRole("status")).toHaveTextContent(
      "視聴状況を更新しました。",
    );
  });
});
