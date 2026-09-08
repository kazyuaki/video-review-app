import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { LoginForm } from "@/components/auth/LoginForm";
import { apiGetMock, apiPostMock, pushMock, refreshMock } from "@/tests/mocks";

/**
 * ログインフォームの入力、API通信、画面遷移を検証する。
 */
describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("NF004 正しい入力でログインできる", async () => {
    const user = userEvent.setup();

    apiGetMock.mockResolvedValue({});
    apiPostMock.mockResolvedValue({});

    render(<LoginForm />);

    await user.type(
      screen.getByRole("textbox", { name: "メールアドレス" }),
      "test@example.com",
    );

    await user.type(screen.getByLabelText("パスワード"), "password");

    await user.click(screen.getByRole("button", { name: "ログイン" }));

    await waitFor(() => {
      expect(apiPostMock).toHaveBeenCalledWith("/api/login", {
        email: "test@example.com",
        password: "password",
      });
    });

    expect(pushMock).toHaveBeenCalledWith("/");
    expect(refreshMock).toHaveBeenCalled();
  });

  test("NF005 未入力時にエラーを表示できる", async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    await user.click(screen.getByRole("button", { name: "ログイン" }));

    expect(
      await screen.findByText("メールアドレスを入力してください。"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("パスワードを入力してください。"),
    ).toBeInTheDocument();

    expect(apiGetMock).not.toHaveBeenCalled();
    expect(apiPostMock).not.toHaveBeenCalled();
    expect(pushMock).not.toHaveBeenCalled();
    expect(refreshMock).not.toHaveBeenCalled();
	});
	
  test("NF006 認証失敗時にエラーを表示できる", async () => {
    const user = userEvent.setup();

    apiGetMock.mockResolvedValue({});
    apiPostMock.mockRejectedValue({
      isAxiosError: true,
      response: {
        status: 401,
        data: {
          message: "メールアドレスまたはパスワードが正しくありません。",
        },
      },
    });

    render(<LoginForm />);

    const emailInput = screen.getByRole("textbox", {
      name: "メールアドレス",
    });

    const passwordInput = screen.getByLabelText("パスワード");

    await user.type(emailInput, "wrong@example.com");
    await user.type(passwordInput, "wrong-password");

    await user.click(screen.getByRole("button", { name: "ログイン" }));

    expect(
      await screen.findByText(
        "メールアドレスまたはパスワードが正しくありません。",
      ),
    ).toBeInTheDocument();

    expect(emailInput).toHaveValue("wrong@example.com");
    expect(passwordInput).toHaveValue("wrong-password");

    expect(apiPostMock).toHaveBeenCalledWith("/api/login", {
      email: "wrong@example.com",
      password: "wrong-password",
    });

    expect(pushMock).not.toHaveBeenCalled();
    expect(refreshMock).not.toHaveBeenCalled();
  });
});
