<?php

namespace Tests\Feature\Review;

use App\Models\Review;
use App\Models\User;
use App\Models\Work;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class WorkReviewApiTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function 評価と本文を投稿できる(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/works/movie/12345/reviews', [
            'title' => 'テスト映画',
            'rating' => 4,
            'content' => 'とても楽しめた作品でした。',
            'has_spoiler' => true,
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('rating', 4)
            ->assertJsonPath('content', 'とても楽しめた作品でした。')
            ->assertJsonPath('hasSpoiler', true);

        $work = Work::query()
            ->where('tmdb_id', 12345)
            ->where('media_type', 'movie')
            ->firstOrFail();

        $this->assertDatabaseHas('reviews', [
            'user_id' => $user->id,
            'work_id' => $work->id,
            'rating' => 4,
            'content' => 'とても楽しめた作品でした。',
            'has_spoiler' => true,
        ]);
    }

    #[Test]
    public function 未認証ユーザーはレビューを投稿できない(): void
    {
        $response = $this->postJson('/api/works/movie/12345/reviews', [
            'title' => 'テスト映画',
            'rating' => 4,
            'content' => 'とても楽しめた作品でした。',
            'has_spoiler' => false,
        ]);

        $response->assertUnauthorized();

        $this->assertDatabaseMissing('reviews', [
            'content' => 'とても楽しめた作品でした。',
        ]);
    }

    #[Test]
    public function 評価が未入力の場合は投稿できない(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/works/movie/12345/reviews', [
            'title' => 'テスト映画',
            'content' => '評価なしのレビューです。',
            'has_spoiler' => false,
        ]);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'rating' => '評価を選択してください。',
            ]);

        $this->assertDatabaseMissing('reviews', [
            'user_id' => $user->id,
            'content' => '評価なしのレビューです。',
        ]);
    }

    #[Test]
    public function 評価が範囲外の場合は投稿できない(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/works/movie/12345/reviews', [
            'title' => 'テスト映画',
            'rating' => 6,
            'content' => '評価が範囲外のレビューです。',
            'has_spoiler' => false,
        ]);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'rating' => '評価は1から5の間で選択してください。',
            ]);

        $this->assertDatabaseMissing('reviews', [
            'user_id' => $user->id,
            'content' => '評価が範囲外のレビューです。',
        ]);
    }

    #[Test]
    public function 本文が上限文字数を超える場合は投稿できない(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $content = str_repeat('あ', 2001);

        $response = $this->postJson('/api/works/movie/12345/reviews', [
            'title' => 'テスト映画',
            'rating' => 4,
            'content' => $content,
            'has_spoiler' => false,
        ]);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'content' => 'レビュー本文は2000文字以内で入力してください。',
            ]);

        $this->assertDatabaseMissing('reviews', [
            'user_id' => $user->id,
            'content' => $content,
        ]);
    }

    #[Test]
    public function 投稿者本人がレビューを編集できる(): void
    {
        $user = User::factory()->create();

        $work = Work::query()->create([
            'tmdb_id' => 12345,
            'media_type' => 'movie',
            'title' => 'テスト映画',
        ]);

        $review = Review::query()->create([
            'user_id' => $user->id,
            'work_id' => $work->id,
            'rating' => 3,
            'content' => '更新前のレビューです。',
            'has_spoiler' => false,
        ]);

        Sanctum::actingAs($user);

        $response = $this->putJson('/api/works/movie/12345/reviews/me', [
            'rating' => 5,
            'content' => '更新後のレビューです。',
            'has_spoiler' => true,
        ]);

        $response
            ->assertOk()
            ->assertJsonPath('id', $review->id)
            ->assertJsonPath('rating', 5)
            ->assertJsonPath('content', '更新後のレビューです。')
            ->assertJsonPath('hasSpoiler', true);

        $this->assertDatabaseHas('reviews', [
            'id' => $review->id,
            'rating' => 5,
            'content' => '更新後のレビューです。',
            'has_spoiler' => true,
        ]);
    }

    #[Test]
    public function 他人のレビューは編集できない(): void
    {
        $reviewOwner = User::factory()->create();
        $otherUser = User::factory()->create();

        $work = Work::query()->create([
            'tmdb_id' => 12345,
            'media_type' => 'movie',
            'title' => 'テスト映画',
        ]);

        $review = Review::query()->create([
            'user_id' => $reviewOwner->id,
            'work_id' => $work->id,
            'rating' => 3,
            'content' => '他人のレビューです。',
            'has_spoiler' => false,
        ]);

        Sanctum::actingAs($otherUser);

        $response = $this->putJson('/api/works/movie/12345/reviews/me', [
            'rating' => 5,
            'content' => '不正に更新しようとした内容です。',
            'has_spoiler' => true,
        ]);

        $response
            ->assertNotFound()
            ->assertJsonPath('message', 'レビューが見つかりません。');

        $this->assertDatabaseHas('reviews', [
            'id' => $review->id,
            'rating' => 3,
            'content' => '他人のレビューです。',
            'has_spoiler' => false,
        ]);
    }

    #[Test]
    public function 投稿者本人がレビューを削除できる(): void
    {
        $user = User::factory()->create();

        $work = Work::query()->create([
            'tmdb_id' => 12345,
            'media_type' => 'movie',
            'title' => 'テスト映画',
        ]);

        $review = Review::query()->create([
            'user_id' => $user->id,
            'work_id' => $work->id,
            'rating' => 4,
            'content' => '削除対象のレビューです。',
            'has_spoiler' => false,
        ]);

        Sanctum::actingAs($user);

        $response = $this->deleteJson('/api/works/movie/12345/reviews/me');

        $response->assertNoContent();

        $this->assertDatabaseMissing('reviews', [
            'id' => $review->id,
        ]);
    }

    #[Test]
    public function 他人のレビューは削除できない(): void
    {
        $reviewOwner = User::factory()->create();
        $otherUser = User::factory()->create();

        $work = Work::query()->create([
            'tmdb_id' => 12345,
            'media_type' => 'movie',
            'title' => 'テスト映画',
        ]);

        $review = Review::query()->create([
            'user_id' => $reviewOwner->id,
            'work_id' => $work->id,
            'rating' => 4,
            'content' => '他人の削除対象レビューです。',
            'has_spoiler' => false,
        ]);

        Sanctum::actingAs($otherUser);

        $response = $this->deleteJson('/api/works/movie/12345/reviews/me');

        $response
            ->assertNotFound()
            ->assertJsonPath('message', 'レビューが見つかりません。');

        $this->assertDatabaseHas('reviews', [
            'id' => $review->id,
            'content' => '他人の削除対象レビューです。',
        ]);
    }

    #[Test]
    public function 作品に投稿されたレビューを取得できる(): void
    {
        $firstUser = User::factory()->create([
            'name' => 'ユーザーA',
        ]);
        $secondUser = User::factory()->create([
            'name' => 'ユーザーB',
        ]);

        $targetWork = Work::query()->create([
            'tmdb_id' => 12345,
            'media_type' => 'movie',
            'title' => '対象作品',
        ]);

        $otherWork = Work::query()->create([
            'tmdb_id' => 67890,
            'media_type' => 'movie',
            'title' => '別作品',
        ]);

        $olderReview = Review::query()->create([
            'user_id' => $firstUser->id,
            'work_id' => $targetWork->id,
            'rating' => 3,
            'content' => '先に投稿されたレビューです。',
            'has_spoiler' => false,
        ]);

        $newerReview = Review::query()->create([
            'user_id' => $secondUser->id,
            'work_id' => $targetWork->id,
            'rating' => 4,
            'content' => '後に投稿されたレビューです。',
            'has_spoiler' => true,
        ]);

        $olderReview->forceFill([
            'created_at' => now()->subMinute(),
        ])->save();

        Review::query()->create([
            'user_id' => $firstUser->id,
            'work_id' => $otherWork->id,
            'rating' => 1,
            'content' => '別作品のレビューです。',
            'has_spoiler' => false,
        ]);

        $response = $this->getJson('/api/works/movie/12345/reviews');

        $response
            ->assertOk()
            ->assertJsonPath('averageRating', 3.5)
            ->assertJsonPath('reviewCount', 2)
            ->assertJsonCount(2, 'reviews')
            ->assertJsonPath('reviews.0.id', $newerReview->id)
            ->assertJsonPath('reviews.0.userName', 'ユーザーB')
            ->assertJsonPath('reviews.0.content', '後に投稿されたレビューです。')
            ->assertJsonPath('reviews.1.id', $olderReview->id)
            ->assertJsonPath('reviews.1.userName', 'ユーザーA')
            ->assertJsonMissing([
                'content' => '別作品のレビューです。',
            ]);
    }

    #[Test]
    public function 同じユーザーは同じ作品へ重複投稿できない(): void
    {
        $user = User::factory()->create();

        $work = Work::query()->create([
            'tmdb_id' => 12345,
            'media_type' => 'movie',
            'title' => 'テスト映画',
        ]);

        Review::query()->create([
            'user_id' => $user->id,
            'work_id' => $work->id,
            'rating' => 4,
            'content' => '最初のレビューです。',
            'has_spoiler' => false,
        ]);

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/works/movie/12345/reviews', [
            'title' => 'テスト映画',
            'rating' => 5,
            'content' => '重複投稿しようとしたレビューです。',
            'has_spoiler' => false,
        ]);

        $response
            ->assertConflict()
            ->assertJsonPath(
                'message',
                'この作品にはすでにレビューを投稿しています。',
            );

        $this->assertDatabaseCount('reviews', 1);

        $this->assertDatabaseHas('reviews', [
            'user_id' => $user->id,
            'work_id' => $work->id,
            'content' => '最初のレビューです。',
        ]);
    }
}
