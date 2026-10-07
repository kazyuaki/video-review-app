<?php

namespace App\Http\Controllers\ViewingRecord;

use App\Http\Controllers\Controller;
use App\Models\ViewingRecord;
use App\Models\Work;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ShowOwnViewingRecordController extends Controller
{
    /**
     * ログイン中ユーザーの指定作品に対する視聴記録を取得する。
     */
    public function __invoke(
        Request $request,
        string $mediaType,
        int $tmdbId,
    ): JsonResponse {
        $work = Work::query()
            ->where('tmdb_id', $tmdbId)
            ->where('media_type', $mediaType)
            ->first();

        if (! $work) {
            return response()->json([
                'message' => '作品が見つかりません。',
            ], 404);
        }

        $viewingRecord = ViewingRecord::query()
            ->where('user_id', $request->user()->id)
            ->where('work_id', $work->id)
            ->first();

        if (! $viewingRecord) {
            return response()->json([
                'message' => '視聴記録が見つかりません。',
            ], 404);
        }

        return response()->json([
            'id' => $viewingRecord->id,
            'status' => $viewingRecord->status,
            'vodService' => $viewingRecord->vod_service,
            'startedAt' => $viewingRecord->started_at?->toDateString(),
            'watchedAt' => $viewingRecord->watched_at?->toDateString(),
        ]);
    }
}
