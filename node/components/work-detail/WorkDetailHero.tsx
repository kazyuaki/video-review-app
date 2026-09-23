import Image from "next/image";
import Link from "next/link";
import type { WorkDetail } from "@/lib/tmdb/details";

type WorkDetailHeroProps = {
  work: WorkDetail;
};

const TMDB_IMAGE_URL = "https://image.tmdb.org/t/p";

/**
 * 作品のポスター、基本情報、あらすじを表示する。
 */
export function WorkDetailHero({ work }: WorkDetailHeroProps) {
  return (
    <div className="relative isolate overflow-hidden">
      {work.backdropPath && (
        <>
          <Image
            src={`${TMDB_IMAGE_URL}/original${work.backdropPath}`}
            alt=""
            fill
            priority
            sizes="100vw"
            className="-z-20 object-cover object-top opacity-30"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-950/30 via-slate-950/80 to-slate-950" />
        </>
      )}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <Link
          href="/works/search"
          className="inline-flex text-sm text-slate-300 transition hover:text-indigo-300"
        >
          ← 作品を探す
        </Link>

        <section className="mt-8 grid gap-8 md:grid-cols-[280px_1fr]">
          <div className="mx-auto w-full max-w-[280px]">
            <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-slate-800 shadow-2xl">
              {work.posterPath ? (
                <Image
                  src={`${TMDB_IMAGE_URL}/w500${work.posterPath}`}
                  alt={`${work.title}のポスター`}
                  fill
                  priority
                  sizes="(max-width: 767px) 280px, 280px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-6xl">
                  🎬
                </div>
              )}
            </div>

            {work.mediaType === "movie" && work.isRecentRelease && (
              <div className="mt-4 flex justify-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-400/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-amber-200 shadow-lg shadow-amber-500/10 backdrop-blur">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-300 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-300" />
                  </span>
                  劇場公開作品
                </span>
              </div>
            )}
          </div>

          <div className="self-center">
            <p className="text-sm font-semibold tracking-widest text-indigo-300">
              {work.mediaType === "movie" ? "MOVIE" : "TV SERIES"}
            </p>

            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
              {work.title}
            </h1>

            <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-300">
              {work.releaseYear && <span>{work.releaseYear}</span>}

              {work.genres.map((genre) => (
                <span
                  key={genre}
                  className="rounded-full bg-white/10 px-3 py-1"
                >
                  {genre}
                </span>
              ))}
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold">あらすじ</h2>

              <p className="mt-3 whitespace-pre-line leading-8 text-slate-300">
                {work.overview || "あらすじは登録されていません。"}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
