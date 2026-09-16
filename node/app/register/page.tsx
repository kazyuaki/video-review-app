import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { RegisterForm } from "@/components/auth/RegisterForm";

/**
 * 会員登録ページを表示する。
 */
export default function RegisterPage() {
  return (
    <AuthLayout
      title="会員登録"
      description="観た作品とレビューを記録しましょう"
      footer={
        <p className="flex flex-wrap items-center justify-center gap-x-1 leading-6">
          <span>すでにアカウントをお持ちですか？</span>
          <Link
            href="/login"
            className="whitespace-nowrap font-semibold text-indigo-600 transition hover:text-indigo-500"
          >
            ログイン
          </Link>
        </p>
      }
    >
      <RegisterForm />
    </AuthLayout>
  );
}
