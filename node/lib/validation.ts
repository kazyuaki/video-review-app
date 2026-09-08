import type { ValidationErrors } from "@/types/api";

type RequiredField = {
  value: string;
  label: string;
};

/**
 * 必須項目を検証し、未入力項目のエラーを返す。
 */
export function validateRequiredFields(
  fields: Record<string, RequiredField>,
): ValidationErrors {
  return Object.entries(fields).reduce<ValidationErrors>(
    (errors, [fieldName, { value, label }]) => {
      if (!value) {
        errors[fieldName] = [`${label}を入力してください。`];
      }

      return errors;
    },
    {},
  );
}
