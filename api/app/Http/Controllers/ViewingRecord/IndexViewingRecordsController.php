<?php

namespace App\Http\Controllers\ViewingRecord;

use App\Http\Controllers\Controller;
use App\Models\ViewingRecord;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class IndexViewingRecordsController extends Controller
{
    /**
     * ログイン中ユーザーの視聴記録一覧を取得する。
     */
    public function __invoke(Request $request): JsonResponse
    {
        $viewingRecords = ViewingRecord::query()
            ->where('user_id', $request->user()->id)
            ->with('work:id,tmdb_id,media_type,title,poster_path')
            ->latest()
            ->get()
            ->map(fn (ViewingRecord $viewingRecord) => [
                'id' => $viewingRecord->id,
                'status' => $viewingRecord->status,
                'vodService' => $viewingRecord->vod_service,
                'startedAt' => $viewingRecord->started_at?->toDateString(),
                'watchedAt' => $viewingRecord->watched_at?->toDateString(),
                'work' => [
                    'tmdbId' => $viewingRecord->work->tmdb_id,
                    'mediaType' => $viewingRecord->work->media_type,
                    'title' => $viewingRecord->work->title,
                    'posterPath' => $viewingRecord->work->poster_path,
                ],
            ]);

        return response()->json([
            'viewingRecords' => $viewingRecords,
        ]);
    }
}
