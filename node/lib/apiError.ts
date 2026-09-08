import axios from "axios";
import type { ErrorResponse, ValidationErrors } from "@/types/api";

type ParsedApiError = {
  message: string;
  errors: ValidationErrors;
};

/**
 * API通信で発生したエラーから画面表示用の情報を取得する。
 */
export function parseApiError(
  error: unknown,
  fallbackMessage: string,
): ParsedApiError {
  if (axios.isAxiosError<ErrorResponse>(error)) {
    return {
      message: error.response?.data.message ?? fallbackMessage,
      errors: error.response?.data.errors ?? {},
    };
  }

  return {
    message: "予期しないエラーが発生しました。",
    errors: {},
  };
}
