<?php

namespace Database\Seeders;

use App\Models\Review;
use App\Models\User;
use App\Models\Work;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoWorkReviewSeeder extends Seeder
{
    /**
     * レビュー一覧・ページネーション確認用のダミーデータを登録する。
     */
    public function run(): void
    {
        $work = Work::query()->firstOrCreate(
            [
                'tmdb_id' => 969681,
                'media_type' => 'movie',
            ],
            [
                'title' => 'スパイダーマン：ブランド・ニュー・デイ',
            ],
        );

        $demoReviews = [
            ['name' => 'レビュー投稿者1', 'rating' => 5, 'content' => '最高でした。'],
            ['name' => 'レビュー投稿者2', 'rating' => 4, 'content' => '映像がとても良かったです。'],
            ['name' => 'レビュー投稿者3', 'rating' => 4, 'content' => 'アクションが楽しめました。'],
            ['name' => 'レビュー投稿者4', 'rating' => 3, 'content' => '期待どおりの作品でした。'],
            ['name' => 'レビュー投稿者5', 'rating' => 5, 'content' => '何度でも観たくなります。'],
            ['name' => 'レビュー投稿者6', 'rating' => 4, 'content' => '物語に引き込まれました。'],
            ['name' => 'レビュー投稿者7', 'rating' => 3, 'content' => '気軽に楽しめる作品です。'],
            ['name' => 'レビュー投稿者8', 'rating' => 5, 'content' => 'キャストが素晴らしいです。'],
            ['name' => 'レビュー投稿者9', 'rating' => 4, 'content' => '音楽も印象に残りました。'],
            ['name' => 'レビュー投稿者10', 'rating' => 3, 'content' => '家族で楽しめました。'],
            ['name' => 'レビュー投稿者11', 'rating' => 4, 'content' => '続編にも期待しています。'],
        ];

        foreach ($demoReviews as $index => $demoReview) {
            $user = User::query()->firstOrCreate(
                ['email' => "demo-reviewer-{$index}@example.com"],
                [
                    'name' => $demoReview['name'],
                    'password' => Hash::make('password'),
                ],
            );

            $review = Review::query()->updateOrCreate(
                [
                    'user_id' => $user->id,
                    'work_id' => $work->id,
                ],
                [
                    'rating' => $demoReview['rating'],
                    'content' => $demoReview['content'],
                    'has_spoiler' => false,
                ],
            );

            // 新着順とページ切替を確認できるよう、投稿日時を1分ずつずらす。
            $review->forceFill([
                'created_at' => now()->subMinutes(11 - $index),
            ])->save();
        }
    }
}
