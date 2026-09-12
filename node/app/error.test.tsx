import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ErrorPage from "@/app/error";
/**
 * アプリケーションのエラー画面のテスト。
 * エラー内容の表示と再試行操作を確認する。
 */
describe("Error", () => {
  it("作品情報の取得に失敗したことを表示できる", () => {
    render(<ErrorPage error={new Error("テスト用エラー")} reset={vi.fn()} />);

    expect(
      screen.getByRole("heading", {
        name: "作品情報の取得に失敗しました",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /一時的に作品情報を取得できませんでした。.*時間をおいて再度お試しください。/,
      ),
    ).toBeInTheDocument();
  });

  it("再試行ボタンを押すとresetが呼ばれる", () => {
    const resetMock = vi.fn();

    render(<ErrorPage error={new Error("テスト用エラー")} reset={resetMock} />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "再試行",
      }),
    );

    expect(resetMock).toHaveBeenCalledTimes(1);
  });
});
