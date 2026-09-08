import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

/**
 * Next.jsの画面遷移をテスト用のモックに置き換える。
 */
vi.mock("next/navigation", async () => {
  const { pushMock, refreshMock } = await import("./tests/mocks");

  return {
    useRouter: () => ({
      push: pushMock,
      refresh: refreshMock,
    }),
  };
});

/**
 * Laravel APIへの通信をテスト用のモックに置き換える。
 */
vi.mock("@/lib/api", async () => {
  const { apiGetMock, apiPostMock } = await import("./tests/mocks");

  return {
    api: {
      get: apiGetMock,
      post: apiPostMock,
    },
  };
});
