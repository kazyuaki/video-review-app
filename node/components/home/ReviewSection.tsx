import ReviewCard, { type Review } from "@/components/home/ReviewCard";
import SectionHeading from "./SectionHeading";

/**
 * 新着レビュー一覧セクションを表示する。
 * セクション見出しとレビューカード一覧を表示する。
 */
export default function ReviewSection({ reviews }: { reviews: Review[] }) {
  return (
    <section>
      <SectionHeading title="新着レビュー" subtitle="RECENT REVIEWS" />

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </section>
  );
}
