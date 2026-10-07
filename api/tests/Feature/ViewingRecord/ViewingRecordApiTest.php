<?php

namespace Tests\Feature\ViewingRecord;

use App\Models\User;
use App\Models\ViewingRecord;
use App\Models\Work;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ViewingRecordApiTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function 作品を観たいとして登録できる(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $response = $this->postJson(
            '/api/works/movie/12345/viewing-records',
            [
                'title' => 'テスト映画',
                'status' => 'want_to_watch',
            ],
        );

        $response
            ->assertCreated()
            ->assertJsonPath('status', 'want_to_watch');

        $work = Work::query()
            ->where('tmdb_id', 12345)
            ->where('media_type', 'movie')
            ->firstOrFail();

        $this->assertDatabaseHas('works', [
            'id' => $work->id,
            'title' => 'テスト映画',
        ]);

        $this->assertDatabaseHas('viewing_records', [
            'user_id' => $user->id,
            'work_id' => $work->id,
            'status' => 'want_to_watch',
        ]);
    }

    #[Test]
    public function 未認証ユーザーはマイリストへ登録できない(): void
    {
        $response = $this->postJson(
            '/api/works/movie/12345/viewing-records',
            [
                'title' => 'テスト映画',
                'status' => 'want_to_watch',
            ],
        );

        $response->assertUnauthorized();

        $this->assertDatabaseMissing('viewing_records', [
            'status' => 'want_to_watch',
        ]);
    }

    #[Test]
    public function 同じ作品は重複してマイリストへ登録できない(): void
    {
        $user = User::factory()->create();

        $work = Work::query()->create([
            'tmdb_id' => 12345,
            'media_type' => 'movie',
            'title' => 'テスト映画',
        ]);

        ViewingRecord::query()->create([
            'user_id' => $user->id,
            'work_id' => $work->id,
            'status' => 'watching',
        ]);

        Sanctum::actingAs($user);

        $response = $this->postJson(
            '/api/works/movie/12345/viewing-records',
            [
                'title' => 'テスト映画',
                'status' => 'want_to_watch',
            ],
        );

        $response
            ->assertConflict()
            ->assertJsonPath(
                'message',
                'この作品はすでにマイリストに登録されています。',
            );

        $this->assertDatabaseCount('viewing_records', 1);

        $this->assertDatabaseHas('viewing_records', [
            'user_id' => $user->id,
            'work_id' => $work->id,
            'status' => 'watching',
        ]);
    }

    #[Test]
    public function 視聴状況を変更できる(): void
    {
        $user = User::factory()->create();

        $work = Work::query()->create([
            'tmdb_id' => 12345,
            'media_type' => 'movie',
            'title' => 'テスト映画',
        ]);

        $viewingRecord = ViewingRecord::query()->create([
            'user_id' => $user->id,
            'work_id' => $work->id,
            'status' => 'want_to_watch',
        ]);

        Sanctum::actingAs($user);

        $response = $this->putJson(
            '/api/works/movie/12345/viewing-records/me',
            [
                'status' => 'watched',
                'vod_service' => 'Netflix',
                'started_at' => '2026-10-01',
                'watched_at' => '2026-10-07',
            ],
        );

        $response
            ->assertOk()
            ->assertJsonPath('id', $viewingRecord->id)
            ->assertJsonPath('status', 'watched')
            ->assertJsonPath('vodService', 'Netflix')
            ->assertJsonPath('startedAt', '2026-10-01')
            ->assertJsonPath('watchedAt', '2026-10-07');

        $this->assertDatabaseHas('viewing_records', [
            'id' => $viewingRecord->id,
            'status' => 'watched',
            'vod_service' => 'Netflix',
            'started_at' => '2026-10-01 00:00:00',
            'watched_at' => '2026-10-07 00:00:00',
        ]);
    }

    #[Test]
    public function 定義外の視聴状況へ変更できない(): void
    {
        $user = User::factory()->create();

        $work = Work::query()->create([
            'tmdb_id' => 12345,
            'media_type' => 'movie',
            'title' => 'テスト映画',
        ]);

        $viewingRecord = ViewingRecord::query()->create([
            'user_id' => $user->id,
            'work_id' => $work->id,
            'status' => 'want_to_watch',
        ]);

        Sanctum::actingAs($user);

        $response = $this->putJson(
            '/api/works/movie/12345/viewing-records/me',
            [
                'status' => 'invalid_status',
            ],
        );

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'status' => '視聴状況が不正です。',
            ]);

        $this->assertDatabaseHas('viewing_records', [
            'id' => $viewingRecord->id,
            'status' => 'want_to_watch',
        ]);
    }

    #[Test]
    public function 自分の視聴記録を削除できる(): void
    {
        $user = User::factory()->create();

        $work = Work::query()->create([
            'tmdb_id' => 12345,
            'media_type' => 'movie',
            'title' => 'テスト映画',
        ]);

        $viewingRecord = ViewingRecord::query()->create([
            'user_id' => $user->id,
            'work_id' => $work->id,
            'status' => 'want_to_watch',
        ]);

        Sanctum::actingAs($user);

        $response = $this->deleteJson(
            '/api/works/movie/12345/viewing-records/me',
        );

        $response->assertNoContent();

        $this->assertDatabaseMissing('viewing_records', [
            'id' => $viewingRecord->id,
        ]);
    }

    #[Test]
    public function 他人の視聴記録は削除できない(): void
    {
        $recordOwner = User::factory()->create();
        $otherUser = User::factory()->create();

        $work = Work::query()->create([
            'tmdb_id' => 12345,
            'media_type' => 'movie',
            'title' => 'テスト映画',
        ]);

        $viewingRecord = ViewingRecord::query()->create([
            'user_id' => $recordOwner->id,
            'work_id' => $work->id,
            'status' => 'want_to_watch',
        ]);

        Sanctum::actingAs($otherUser);

        $response = $this->deleteJson(
            '/api/works/movie/12345/viewing-records/me',
        );

        $response
            ->assertNotFound()
            ->assertJsonPath('message', '視聴記録が見つかりません。');

        $this->assertDatabaseHas('viewing_records', [
            'id' => $viewingRecord->id,
            'user_id' => $recordOwner->id,
        ]);
    }

    #[Test]
    public function 自分の視聴記録だけを取得できる(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        $ownWork = Work::query()->create([
            'tmdb_id' => 12345,
            'media_type' => 'movie',
            'title' => '自分の登録作品',
            'poster_path' => '/own-work.jpg',
        ]);

        $otherWork = Work::query()->create([
            'tmdb_id' => 67890,
            'media_type' => 'tv',
            'title' => '他人の登録作品',
        ]);

        ViewingRecord::query()->create([
            'user_id' => $user->id,
            'work_id' => $ownWork->id,
            'status' => 'watching',
            'vod_service' => 'Netflix',
            'started_at' => '2026-10-01',
        ]);

        ViewingRecord::query()->create([
            'user_id' => $otherUser->id,
            'work_id' => $otherWork->id,
            'status' => 'watched',
        ]);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/viewing-records');

        $response
            ->assertOk()
            ->assertJsonCount(1, 'viewingRecords')
            ->assertJsonPath('viewingRecords.0.status', 'watching')
            ->assertJsonPath('viewingRecords.0.vodService', 'Netflix')
            ->assertJsonPath('viewingRecords.0.startedAt', '2026-10-01')
            ->assertJsonPath('viewingRecords.0.work.tmdbId', 12345)
            ->assertJsonPath('viewingRecords.0.work.mediaType', 'movie')
            ->assertJsonPath('viewingRecords.0.work.title', '自分の登録作品')
            ->assertJsonPath('viewingRecords.0.work.posterPath', '/own-work.jpg')
            ->assertJsonMissing([
                'title' => '他人の登録作品',
            ]);
    }
}
