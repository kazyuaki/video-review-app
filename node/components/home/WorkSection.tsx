import SectionHeading from "@/components/home/SectionHeading";
import WorkCard, { type Work } from "@/components/home/WorkCard";

export type WorkSectionProps = {
  title: string;
  subtitle: string;
  works: Work[];
};

/**
 * 作品一覧セクションを表示する。
 * セクション見出しと横スクロール可能な作品カード一覧を表示する。
 */
export default function WorkSection({
  title,
  subtitle,
  works,
}: WorkSectionProps) {
  return (
    <section>
      <SectionHeading title={title} subtitle={subtitle} showMoreLink />

      <div className="flex gap-4 overflow-x-auto pb-4">
        {works.map((work) => (
          <WorkCard key={work.id} work={work} />
        ))}
      </div>
    </section>
  );
}
