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
        <p>
          すでにアカウントをお持ちですか？
          <Link
            href="/login"
            className="ml-1 font-semibold text-indigo-600 transition hover:text-indigo-500"
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
