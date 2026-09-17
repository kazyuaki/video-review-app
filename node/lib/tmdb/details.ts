import { fetchTmdb } from "./client";
import type { WorkMediaType } from "@/types/work";

import type {
  TmdbCredits,
  TmdbWatchProvider,
  TmdbWatchProviderResponse,
  TmdbWorkDetail,
} from "./types";

const RECENT_RELEASE_PERIOD_DAYS = 90;

export type WorkDetail = {
  id: number;
  title: string;
  mediaType: WorkMediaType;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseYear?: string;
  genres: string[];
  cast: {
    id: number;
    name: string;
    character: string;
    profilePath: string | null;
  }[];
  streamingServices: TmdbWatchProvider[];
  watchProviderUrl?: string;
  isRecentRelease: boolean;
};

/**
 * 公開日から一定期間内の作品か判定する。
 */
function isRecentRelease(releaseDate?: string): boolean {
  if (!releaseDate) {
    return false;
  }

  const releasedAt = new Date(`${releaseDate}T00:00:00`);
  const elapsedDays = (Date.now() - releasedAt.getTime()) / 86_400_000;

  return elapsedDays >= 0 && elapsedDays <= RECENT_RELEASE_PERIOD_DAYS;
}

/**
 * TMDBから映画またはTVシリーズの詳細情報と、
 * 日本国内で利用できる定額制配信サービスを取得する。
 */
export async function getWorkDetail(
  id: number,
  mediaType: WorkMediaType,
): Promise<WorkDetail> {
  // 作品詳細情報と配信サービス情報を並行して取得する
  const [detail, providerData] = await Promise.all([
    fetchTmdb<TmdbWorkDetail & { credits: TmdbCredits }>(
      `/${mediaType}/${id}?language=ja-JP&append_to_response=credits`,
    ),
    fetchTmdb<TmdbWatchProviderResponse>(`/${mediaType}/${id}/watch/providers`),
  ]);

  const japanProviders = providerData.results.JP;

  return {
    id: detail.id,
    title: detail.title ?? detail.name ?? "タイトル不明",
    mediaType,
    overview: detail.overview,
    posterPath: detail.poster_path,
    backdropPath: detail.backdrop_path,
    releaseYear: (detail.release_date ?? detail.first_air_date)?.slice(0, 4),
    genres: detail.genres.map((genre) => genre.name),
    cast: detail.credits.cast.map((member) => ({
      id: member.id,
      name: member.name,
      character: member.character,
      profilePath: member.profile_path,
    })),
    streamingServices: japanProviders?.flatrate ?? [],
    watchProviderUrl: japanProviders?.link,
    isRecentRelease:
      mediaType === "movie" && isRecentRelease(detail.release_date),
  };
}
