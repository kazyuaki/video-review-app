import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import WorkSearchLoading from "./loading";

/**
 * 作品検索画面のローディング表示をテストする。
 */
describe("WorkSearchLoading", () => {
  // NF014: API通信中の状態を表示できる
  it("作品検索画面の読み込み中メッセージを表示できる", () => {
    render(<WorkSearchLoading />);

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(
      screen.getByText("検索画面を読み込んでいます..."),
    ).toBeInTheDocument();
  });
});
