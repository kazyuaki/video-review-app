<?php

namespace App\Http\Controllers\Review;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Work;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * ログイン中ユーザーが投稿したレビューを削除する。
 */
class DeleteOwnWorkReviewController extends Controller
{
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

        $review = Review::query()
            ->where('work_id', $work->id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (! $review) {
            return response()->json([
                'message' => 'レビューが見つかりません。',
            ], 404);
        }

        $review->delete();

        return response()->json(null, 204);
    }
}
