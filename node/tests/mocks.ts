import { vi } from "vitest";

/**
 * Next.jsの画面遷移を記録するモック関数。
 */
export const pushMock = vi.fn();
export const refreshMock = vi.fn();

/**
 * Laravel APIへの通信を記録するモック関数。
 */
export const apiGetMock = vi.fn();
export const apiPostMock = vi.fn();
