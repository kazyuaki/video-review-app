import Image from "next/image";
import type { WorkDetail } from "@/lib/tmdb/details";

type WorkCastSectionProps = {
  cast: WorkDetail["cast"];
};

const TMDB_IMAGE_URL = "https://image.tmdb.org/t/p";

/**
 * 作品の出演者一覧を表示する。
 */
export function WorkCastSection({ cast }: WorkCastSectionProps) {
  return (
    <section className="border-t border-white/10 py-10">
      <h2 className="text-2xl font-bold">出演者</h2>

      {cast.length > 0 ? (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cast.slice(0, 12).map((member) => (
            <li
              key={member.id}
              className="flex items-center gap-4 rounded-xl bg-white/5 p-3"
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-slate-800">
                {member.profilePath ? (
                  <Image
                    src={`${TMDB_IMAGE_URL}/w185${member.profilePath}`}
                    alt={member.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    👤
                  </div>
                )}
              </div>

              <div>
                <p className="font-semibold">{member.name}</p>

                {member.character && (
                  <p className="mt-1 text-sm text-slate-400">
                    {member.character}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-slate-400">出演者情報は登録されていません。</p>
      )}
    </section>
  );
}
