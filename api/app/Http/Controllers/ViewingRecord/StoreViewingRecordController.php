<?php

namespace App\Http\Controllers\ViewingRecord;

use App\Http\Controllers\Controller;
use App\Http\Requests\ViewingRecord\StoreViewingRecordRequest;
use App\Models\ViewingRecord;
use App\Models\Work;
use Illuminate\Http\JsonResponse;

class StoreViewingRecordController extends Controller
{
    /**
     * 指定した作品をマイリストへ登録する。
     */
    public function __invoke(
        StoreViewingRecordRequest $request,
        string $mediaType,
        int $tmdbId,
    ): JsonResponse {
        $validated = $request->validated();

        // 対象作品を取得し、未登録の場合だけ works テーブルへ登録する。
        $work = Work::query()->firstOrCreate(
            [
                'tmdb_id' => $tmdbId,
                'media_type' => $mediaType,
            ],
            [
                'title' => $validated['title'],
                'overview' => $validated['overview'] ?? null,
                'poster_path' => $validated['poster_path'] ?? null,
                'release_date' => $validated['release_date'] ?? null,
            ],
        );

        $alreadyRegistered = ViewingRecord::query()
            ->where('user_id', $request->user()->id)
            ->where('work_id', $work->id)
            ->exists();

        if ($alreadyRegistered) {
            return response()->json([
                'message' => 'この作品はすでにマイリストに登録されています。',
            ], 409);
        }

        $viewingRecord = ViewingRecord::query()->create([
            'user_id' => $request->user()->id,
            'work_id' => $work->id,
            'status' => $validated['status'],
            'vod_service' => $validated['vod_service'] ?? null,
            'started_at' => $validated['started_at'] ?? null,
            'watched_at' => $validated['watched_at'] ?? null,
        ]);

        return response()->json([
            'id' => $viewingRecord->id,
            'status' => $viewingRecord->status,
            'vodService' => $viewingRecord->vod_service,
            'startedAt' => $viewingRecord->started_at?->toDateString(),
            'watchedAt' => $viewingRecord->watched_at?->toDateString(),
        ], 201);
    }
}
