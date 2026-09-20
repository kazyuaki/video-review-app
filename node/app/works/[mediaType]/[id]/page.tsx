import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getWorkDetail } from "@/lib/tmdb";
import type { WorkMediaType } from "@/types/work";
import { WorkReviewArea } from "@/components/review/WorkReviewArea";
import { getWorkReviews } from "@/lib/reviews";


type WorkDetailPageProps = {
  params: Promise<{
    mediaType: string;
    id: string;
  }>;
};

const TMDB_IMAGE_URL = "https://image.tmdb.org/t/p";

/**
 * 作品詳細画面を表示する。
 * 映画またはTVシリーズの詳細情報と配信サービス情報を表示する。
 */
export default async function WorkDetailPage({ params }: WorkDetailPageProps) {
  const { mediaType, id } = await params;
  const workId = Number(id);

  // URLで指定された作品種別とIDが正しい形式か確認する。
  if (
    (mediaType !== "movie" && mediaType !== "tv") ||
    !Number.isInteger(workId) ||
    workId <= 0
  ) {
    notFound();
  }

  const workMediaType = mediaType as WorkMediaType;

  const [work, reviewData] = await Promise.all([
    getWorkDetail(workId, workMediaType),
    getWorkReviews(workMediaType, workId),
  ]);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
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

      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <section className="border-t border-white/10 py-10">
          <h2 className="text-2xl font-bold">出演者</h2>

          {work.cast.length > 0 ? (
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {work.cast.slice(0, 12).map((member) => (
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
            <p className="mt-4 text-slate-400">
              出演者情報は登録されていません。
            </p>
          )}
        </section>

        <section className="border-t border-white/10 py-10">
          <h2 className="text-2xl font-bold">配信サービス</h2>

          {work.streamingServices.length > 0 ? (
            <>
              <p className="mt-3 text-sm text-slate-400">
                日本で定額制配信されているサービスです。
              </p>

              <ul className="mt-6 flex flex-wrap gap-4">
                {work.streamingServices.map((service) => (
                  <li
                    key={service.provider_id}
                    className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3"
                  >
                    <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-slate-800">
                      {service.logo_path ? (
                        <Image
                          src={`${TMDB_IMAGE_URL}/w92${service.logo_path}`}
                          alt={`${service.provider_name}のロゴ`}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          📺
                        </div>
                      )}
                    </div>

                    <span className="font-medium">{service.provider_name}</span>
                  </li>
                ))}
              </ul>

              {work.watchProviderUrl && (
                <a
                  href={work.watchProviderUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex rounded-lg border border-indigo-400 px-4 py-2 text-sm font-semibold text-indigo-300 transition hover:bg-indigo-400 hover:text-slate-950"
                >
                  視聴先を確認する
                </a>
              )}
            </>
          ) : (
            <p className="mt-4 text-slate-400">
              日本国内の定額制配信サービス情報は見つかりませんでした。
            </p>
          )}
        </section>

        <WorkReviewArea
          mediaType={work.mediaType}
          tmdbId={work.id}
          title={work.title}
          reviewData={reviewData}
        />
      </div>
    </main>
  );
}
