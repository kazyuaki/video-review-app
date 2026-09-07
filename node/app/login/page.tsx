import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";

/**
 * ログインページを表示する。
 */
export default function LoginPage() {
  return (
    <AuthLayout
      title="ログイン"
      description="お気に入りの作品を記録しましょう"
      footer={
        <p>
          アカウントをお持ちでないですか？
          <Link
            href="/register"
            className="ml-1 font-semibold text-indigo-600 transition hover:text-indigo-500"
          >
            会員登録
          </Link>
        </p>
      }
    >
      <LoginForm />
    </AuthLayout>
  );
}
