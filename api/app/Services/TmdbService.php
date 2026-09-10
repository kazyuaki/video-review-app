<?php

namespace App\Services;

use App\Exceptions\TmdbRequestException;
use Illuminate\Support\Facades\Http;

class TmdbService
{
    public function __construct(
        private readonly string $baseUrl,
        private readonly string $apiKey,
    ) {}

    /**
     * タイトルキーワードで作品を検索する。
     *
     * @return array{results: array<int, array<string, mixed>>, page: int, total_pages: int, total_results: int}
     *
     * @throws TmdbRequestException
     */
    public function search(string $query, ?string $mediaType, int $page): array
    {
        $endpoint = match ($mediaType) {
            'movie' => '/search/movie',
            'tv' => '/search/tv',
            default => '/search/multi',
        };

        $response = Http::baseUrl($this->baseUrl)
            ->withToken($this->apiKey)
            ->acceptJson()
            ->get($endpoint, [
                'query' => $query,
                'page' => $page,
                'include_adult' => false,
                'language' => 'ja-JP',
            ]);

        if ($response->failed()) {
            throw new TmdbRequestException('作品情報の取得に失敗しました。');
        }

        $data = $response->json();

        $results = collect($data['results'] ?? [])
            ->filter(fn (array $item) => $mediaType !== null || ($item['media_type'] ?? null) !== 'person')
            ->map(fn (array $item) => $this->formatResult($item, $mediaType))
            ->values()
            ->all();

        return [
            'results' => $results,
            'page' => $data['page'] ?? $page,
            'total_pages' => $data['total_pages'] ?? 1,
            'total_results' => $data['total_results'] ?? count($results),
        ];
    }

    /**
     * TMDBのレスポンス項目をアプリ共通の形式へ整形する。
     *
     * @param  array<string, mixed>  $item
     * @return array<string, mixed>
     */
    private function formatResult(array $item, ?string $mediaType): array
    {
        $type = $mediaType ?? ($item['media_type'] ?? 'movie');

        return [
            'external_id' => $item['id'],
            'media_type' => $type,
            'title' => $type === 'tv' ? ($item['name'] ?? '') : ($item['title'] ?? ''),
            'overview' => $item['overview'] ?? null,
            'poster_path' => $item['poster_path'] ?? null,
            'release_date' => $type === 'tv' ? ($item['first_air_date'] ?? null) : ($item['release_date'] ?? null),
        ];
    }
}
