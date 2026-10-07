<?php

namespace App\Http\Controllers\ViewingRecord;

use App\Http\Controllers\Controller;
use App\Models\ViewingRecord;
use App\Models\Work;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class DeleteOwnViewingRecordController extends Controller
{
    /**
     * ログイン中ユーザーの視聴記録を削除する。
     */
    public function __invoke(
        Request $request,
        string $mediaType,
        int $tmdbId,
    ): Response {
        $work = Work::query()
            ->where('tmdb_id', $tmdbId)
            ->where('media_type', $mediaType)
            ->first();

        if (! $work) {
            abort(404, '作品が見つかりません。');
        }

        $viewingRecord = ViewingRecord::query()
            ->where('user_id', $request->user()->id)
            ->where('work_id', $work->id)
            ->first();

        if (! $viewingRecord) {
            abort(404, '視聴記録が見つかりません。');
        }

        $viewingRecord->delete();

        return response()->noContent();
    }
}
