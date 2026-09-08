/**
 * Laravelが返す項目別のバリデーションエラー。
 */
export type ValidationErrors = Record<string, string[]>;

/**
 * Laravel APIのエラーレスポンス。
 */
export type ErrorResponse = {
  message: string;
  errors?: ValidationErrors;
};
