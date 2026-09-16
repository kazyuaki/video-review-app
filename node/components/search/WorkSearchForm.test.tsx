import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import WorkSearchForm from "./WorkSearchForm";
import { pushMock } from "@/tests/mocks";

/**
 * 作品検索フォームのテスト。
 * 入力したキーワードで作品検索画面へ遷移できることを確認する。
 */
describe("WorkSearchForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // NF011: 検索キーワードを入力して作品を検索できる
  it("入力したキーワードを検索URLに設定して遷移できる", async () => {
    const user = userEvent.setup();

    render(<WorkSearchForm />);

    await user.type(
      screen.getByPlaceholderText("作品名を入力"),
      "テスト 映画",
    );

    await user.click(screen.getByRole("button", { name: "検索" }));

    expect(pushMock).toHaveBeenCalledWith(
      `/works/search?query=${encodeURIComponent("テスト 映画")}`,
    );
  });
});
