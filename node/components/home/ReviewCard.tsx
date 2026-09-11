export type Review = {
  id: number;
  user: string;
  title: string;
  rating: number;
};

/**
 * ユーザーのレビューをカード形式で表示する。
 * 評価、レビュータイトル、投稿ユーザー名を表示する。
 */
export default function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:bg-white/10">
      <div className="text-amber-300">
        {"★".repeat(review.rating)}

        <span className="text-slate-600">{"★".repeat(5 - review.rating)}</span>
      </div>

      <p className="mt-4 font-semibold">{review.title}</p>

      <p className="mt-3 text-sm text-slate-400">{review.user}</p>
    </article>
  );
}
