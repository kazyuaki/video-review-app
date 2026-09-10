<?php

namespace Tests\Feature\Work;

use Illuminate\Support\Facades\Http;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class SearchWorkTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $this->withHeader('Origin', 'http://localhost:3000');
    }

    #[Test]
    public function キーワードで作品を検索できる(): void
    {
        Http::fake([
            'api.themoviedb.org/*' => Http::response([
                'page' => 1,
                'results' => [
                    [
                        'id' => 123,
                        'media_type' => 'movie',
                        'title' => 'テスト映画',
                        'overview' => 'あらすじです。',
                        'poster_path' => '/poster.jpg',
                        'release_date' => '2026-01-01',
                    ],
                ],
                'total_pages' => 1,
                'total_results' => 1,
            ]),
        ]);

        $response = $this->getJson('/api/works/search?query=テスト');

        $response
            ->assertOk()
            ->assertJsonPath('results.0.external_id', 123)
            ->assertJsonPath('results.0.title', 'テスト映画');
    }

    #[Test]
    public function キーワードが未入力の場合を処理できる(): void
    {
        $response = $this->getJson('/api/works/search');

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['query']);
    }

    #[Test]
    public function 外部_ap_i失敗時に適切なエラーを返す(): void
    {
        Http::fake([
            'api.themoviedb.org/*' => Http::response([], 500),
        ]);

        $response = $this->getJson('/api/works/search?query=テスト');

        $response
            ->assertStatus(503)
            ->assertJsonPath('message', '作品情報の取得に失敗しました。');
    }
}
