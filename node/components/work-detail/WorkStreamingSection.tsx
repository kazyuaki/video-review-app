import Image from "next/image";
import type { WorkDetail } from "@/lib/tmdb/details";

type WorkStreamingSectionProps = {
  streamingServices: WorkDetail["streamingServices"];
};

const TMDB_IMAGE_URL = "https://image.tmdb.org/t/p";

/**
 * 配信サービス名から公式サイトのURLを取得する。
 * 同じサービスの広告付きプラン・Amazon Channelも親サービスへ案内する。
 */
function getStreamingServiceUrl(providerName: string): string | undefined {
  if (providerName.includes("Netflix")) {
    return "https://www.netflix.com/jp/";
  }

  if (providerName.includes("Amazon")) {
    return "https://www.amazon.co.jp/primevideo";
  }

  if (providerName.includes("Disney")) {
    return "https://www.disneyplus.com/ja-jp";
  }

  if (providerName === "Hulu") {
    return "https://www.hulu.jp/";
  }

  if (providerName === "U-NEXT") {
    return "https://video.unext.jp/";
  }

  if (providerName === "FOD") {
    return "https://fod.fujitv.co.jp/";
  }

  return undefined;
}

/**
 * 日本国内で利用できる定額制配信サービスを表示する。
 */
export function WorkStreamingSection({
  streamingServices,
}: WorkStreamingSectionProps) {
  return (
    <section className="border-t border-white/10 py-10">
      <h2 className="text-2xl font-bold">配信サービス</h2>

      {streamingServices.length > 0 ? (
        <>
          <p className="mt-3 text-sm text-slate-400">
            日本で定額制配信されているサービスです。
          </p>

          <ul className="mt-6 flex flex-wrap gap-4">
            {streamingServices.map((service) => {
              const serviceUrl = getStreamingServiceUrl(service.provider_name);
              const serviceContent = (
                <>
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-slate-800">
                    {service.logo_path ? (
                      <Image
                        src={`${TMDB_IMAGE_URL}/w92${service.logo_path}`}
                        alt=""
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
                </>
              );

              return (
                <li key={service.provider_id}>
                  {serviceUrl ? (
                    <a
                      href={serviceUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${service.provider_name}の公式サイトを開く`}
                      className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3 transition hover:bg-white/10 hover:text-indigo-200"
                    >
                      {serviceContent}
                    </a>
                  ) : (
                    <div className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3">
                      {serviceContent}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <p className="mt-4 text-slate-400">
          日本国内の定額制配信サービス情報は見つかりませんでした。
        </p>
      )}
    </section>
  );
}
