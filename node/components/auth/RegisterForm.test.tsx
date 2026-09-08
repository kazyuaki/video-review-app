import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { apiGetMock, apiPostMock, pushMock } from "@/tests/mocks";

/**
 * 会員登録フォームの入力、API通信、画面遷移を検証する。
 */
describe("RegisterForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("NF001 正しい入力で登録処理が実行される", async () => {
    const user = userEvent.setup();

    apiGetMock.mockResolvedValue({});
    apiPostMock.mockResolvedValue({});

    render(<RegisterForm />);

    await user.type(
      screen.getByRole("textbox", { name: "ユーザー名" }),
      "テストユーザー",
    );

    await user.type(
      screen.getByRole("textbox", { name: "メールアドレス" }),
      "test@example.com",
    );

    await user.type(screen.getByLabelText("パスワード"), "password");

    await user.type(screen.getByLabelText("確認用パスワード"), "password");

    await user.click(screen.getByRole("button", { name: "アカウントを作成" }));

    await waitFor(() => {
      expect(apiPostMock).toHaveBeenCalledWith("/api/register", {
        name: "テストユーザー",
        email: "test@example.com",
        password: "password",
        password_confirmation: "password",
      });
    });

    expect(pushMock).toHaveBeenCalledWith("/");
  });

  test("NF002 必須項目の未入力エラーを表示できる", async () => {
    const user = userEvent.setup();

    render(<RegisterForm />);

    await user.click(screen.getByRole("button", { name: "アカウントを作成" }));

    expect(
      await screen.findByText("ユーザー名を入力してください。"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("メールアドレスを入力してください。"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("パスワードを入力してください。"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("確認用パスワードを入力してください。"),
    ).toBeInTheDocument();

    expect(apiGetMock).not.toHaveBeenCalled();
    expect(apiPostMock).not.toHaveBeenCalled();
    expect(pushMock).not.toHaveBeenCalled();
  });

  test("NF003 APIエラーを画面に表示できる", async () => {
    const user = userEvent.setup();

    apiGetMock.mockResolvedValue({});
    apiPostMock.mockRejectedValue({
      isAxiosError: true,
      response: {
        status: 422,
        data: {
          message: "入力内容に誤りがあります。",
          errors: {
            email: ["このメールアドレスはすでに使用されています。"],
          },
        },
      },
    });

    render(<RegisterForm />);

    const nameInput = screen.getByRole("textbox", {
      name: "ユーザー名",
    });

    const emailInput = screen.getByRole("textbox", {
      name: "メールアドレス",
    });

    const passwordInput = screen.getByLabelText("パスワード");
    const passwordConfirmationInput = screen.getByLabelText("確認用パスワード");

    await user.type(nameInput, "テストユーザー");
    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password");
    await user.type(passwordConfirmationInput, "password");

    await user.click(screen.getByRole("button", { name: "アカウントを作成" }));

    expect(
      await screen.findByText("このメールアドレスはすでに使用されています。"),
    ).toBeInTheDocument();

    expect(nameInput).toHaveValue("テストユーザー");
    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password");
    expect(passwordConfirmationInput).toHaveValue("password");

    expect(apiPostMock).toHaveBeenCalled();
    expect(pushMock).not.toHaveBeenCalled();
  });
});
