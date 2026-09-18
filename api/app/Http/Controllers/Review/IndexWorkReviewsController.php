<?php

namespace App\Http\Controllers\Review;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Work;
use Illuminate\Http\JsonResponse;

/**
 * 指定した作品のレビュー一覧と評価集計を取得する。
 */
class IndexWorkReviewsController extends Controller
{
    public function __invoke(string $mediaType, int $tmdbId): JsonResponse
    {
        $work = Work::query()
            ->where('tmdb_id', $tmdbId)
            ->where('media_type', $mediaType)
            ->first();

        if (! $work) {
            return response()->json([
                'averageRating' => 0,
                'reviewCount' => 0,
                'reviews' => [],
            ]);
        }

        $summary = Review::query()
            ->where('work_id', $work->id)
            ->selectRaw('AVG(rating) as average_rating, COUNT(*) as review_count')
            ->first();

        $reviews = Review::query()
            ->where('work_id', $work->id)
            ->with('user:id,name')
            ->latest()
            ->take(10)
            ->get()
            ->map(fn (Review $review) => [
                'id' => $review->id,
                'userName' => $review->user->name,
                'rating' => $review->rating,
                'content' => $review->content,
                'hasSpoiler' => $review->has_spoiler,
                'createdAt' => $review->created_at->toISOString(),
            ]);

        return response()->json([
            'averageRating' => round((float) $summary->average_rating, 1),
            'reviewCount' => $summary->review_count,
            'reviews' => $reviews,
        ]);
    }
}
