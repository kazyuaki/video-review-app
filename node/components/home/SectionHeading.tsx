import Link from "next/link";

type SectionHeadingProps = {
  title: string;
  subtitle: string;
  moreHref?: string;
};

/**
 * トップページの各セクションの見出しを表示する。
 * タイトル、サブタイトル、必要に応じて一覧画面へのリンクを表示する。
 */
export default function SectionHeading({
  title,
  subtitle,
  moreHref,
}: SectionHeadingProps) {
  return (
    <div className="mb-6 flex items-end justify-between">
      <div>
        <p className="text-sm font-semibold tracking-widest text-indigo-300">
          {subtitle}
        </p>

        <h2 className="mt-2 text-2xl font-bold text-white">{title}</h2>
      </div>

      {moreHref && (
        <Link
          href={moreHref}
          className="text-sm font-semibold text-indigo-300 transition hover:text-indigo-200"
        >
          もっと見る →
        </Link>
      )}
    </div>
  );
}
