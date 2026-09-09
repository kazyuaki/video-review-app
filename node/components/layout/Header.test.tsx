import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { Header } from "@/components/layout/Header";
import { apiGetMock, apiPostMock, pushMock, refreshMock } from "@/tests/mocks";

/**
 * ヘッダーからログアウトした際のAPI通信と画面遷移を検証する。
 */
describe("Header", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("NF007 ログアウト後に未認証状態へ遷移する", async () => {
    const user = userEvent.setup();

    apiGetMock.mockResolvedValue({
      data: {
        id: 1,
        name: "テストユーザー",
        email: "test@example.com",
      },
    });

    apiPostMock.mockResolvedValue({});

    render(
      <AuthProvider>
        <Header />
      </AuthProvider>,
    );

    expect(await screen.findByText("テストユーザー")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: "ログアウト",
      }),
    );

    await waitFor(() => {
      expect(apiPostMock).toHaveBeenCalledWith("/api/logout");
    });

    expect(
      await screen.findByRole("link", {
        name: "ログイン",
      }),
    ).toBeInTheDocument();

    expect(pushMock).toHaveBeenCalledWith("/");
    expect(refreshMock).toHaveBeenCalled();
  });
});
