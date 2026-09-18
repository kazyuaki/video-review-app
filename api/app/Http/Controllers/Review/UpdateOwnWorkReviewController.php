<?php

namespace App\Http\Controllers\Review;

use App\Http\Controllers\Controller;
use App\Http\Requests\Review\UpdateWorkReviewRequest;
use App\Models\Review;
use App\Models\Work;
use Illuminate\Http\JsonResponse;

/**
 * ログイン中ユーザーが投稿したレビューを更新する。
 */
class UpdateOwnWorkReviewController extends Controller
{
    public function __invoke(
        UpdateWorkReviewRequest $request,
        string $mediaType,
        int $tmdbId,
    ): JsonResponse {
        $work = Work::query()
            ->where('tmdb_id', $tmdbId)
            ->where('media_type', $mediaType)
            ->first();

        if (! $work) {
            return response()->json([
                'message' => 'レビューが見つかりません。',
            ], 404);
        }

        $review = Review::query()
            ->where('user_id', $request->user()->id)
            ->where('work_id', $work->id)
            ->first();

        if (! $review) {
            return response()->json([
                'message' => 'レビューが見つかりません。',
            ], 404);
        }

        $validated = $request->validated();

        $review->update([
            'rating' => $validated['rating'],
            'content' => $validated['content'],
            'has_spoiler' => $request->boolean('has_spoiler'),
        ]);

        return response()->json([
            'id' => $review->id,
            'rating' => $review->rating,
            'content' => $review->content,
            'hasSpoiler' => $review->has_spoiler,
            'createdAt' => $review->created_at->toISOString(),
        ]);
    }
}
