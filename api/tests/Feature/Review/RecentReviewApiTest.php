<?php

namespace Tests\Feature\Review;

use App\Models\Review;
use App\Models\User;
use App\Models\Work;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class RecentReviewApiTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function 全作品から新着3件のレビューを取得できる(): void
    {
        $firstWork = Work::query()->create([
            'tmdb_id' => 12345,
            'media_type' => 'movie',
            'title' => 'テスト映画',
        ]);

        $secondWork = Work::query()->create([
            'tmdb_id' => 67890,
            'media_type' => 'tv',
            'title' => 'テストTVシリーズ',
        ]);

        $reviews = [];

        foreach ([
            [
                'userName' => 'ユーザーA',
                'work' => $firstWork,
                'rating' => 3,
                'content' => '最も古いレビューです。',
            ],
            [
                'userName' => 'ユーザーB',
                'work' => $secondWork,
                'rating' => 4,
                'content' => '2番目に古いレビューです。',
            ],
            [
                'userName' => 'ユーザーC',
                'work' => $firstWork,
                'rating' => 5,
                'content' => '3番目に古いレビューです。',
            ],
            [
                'userName' => 'ユーザーD',
                'work' => $secondWork,
                'rating' => 4,
                'content' => '最も新しいレビューです。',
            ],
        ] as $index => $reviewData) {
            $user = User::factory()->create([
                'name' => $reviewData['userName'],
            ]);

            $review = Review::query()->create([
                'user_id' => $user->id,
                'work_id' => $reviewData['work']->id,
                'rating' => $reviewData['rating'],
                'content' => $reviewData['content'],
                'has_spoiler' => false,
            ]);

            // 新着順を確認できるよう、投稿日時を1分ずつずらす。
            $review->forceFill([
                'created_at' => now()->subMinutes(4 - $index),
            ])->save();

            $reviews[] = $review;
        }

        $response = $this->getJson('/api/reviews/recent');

        $response
            ->assertOk()
            ->assertJsonCount(3, 'reviews')
            ->assertJsonPath('reviews.0.id', $reviews[3]->id)
            ->assertJsonPath('reviews.0.userName', 'ユーザーD')
            ->assertJsonPath('reviews.0.workTitle', 'テストTVシリーズ')
            ->assertJsonPath('reviews.0.tmdbId', 67890)
            ->assertJsonPath('reviews.0.mediaType', 'tv')
            ->assertJsonPath('reviews.0.rating', 4)
            ->assertJsonPath('reviews.0.content', '最も新しいレビューです。')
            ->assertJsonPath('reviews.2.id', $reviews[1]->id)
            ->assertJsonMissing([
                'content' => '最も古いレビューです。',
            ]);
    }
}
