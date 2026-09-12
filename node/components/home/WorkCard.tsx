import Image from "next/image";
import type { Work } from "@/types/work";

const TMDB_IMAGE_URL = "https://image.tmdb.org/t/p/w500";

/**
 * 作品情報をカード形式で表示する。
 * 作品のポスター、タイトル、ランキング対象の場合は順位を表示する。
 */
export default function WorkCard({ work }: { work: Work }) {
  return (
    <article className="group relative w-44 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:bg-white/10">
      <div className="relative flex aspect-[2/3] items-center justify-center bg-gradient-to-br from-indigo-500/30 to-purple-500/20">
        {work.posterPath ? (
          <Image
            src={`${TMDB_IMAGE_URL}${work.posterPath}`}
            alt={`${work.title}のポスター`}
            fill
            sizes="176px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-4xl">🎬</span>
          </div>
        )}

        {work.rank !== undefined && (
          <span className="absolute bottom-2 left-3 z-10 text-5xl font-black text-white/90 drop-shadow-lg">
            {work.rank}
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="truncate font-semibold text-white">{work.title}</h3>
      </div>
    </article>
  );
}
