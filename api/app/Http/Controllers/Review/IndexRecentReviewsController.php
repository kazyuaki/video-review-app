<?php

namespace App\Http\Controllers\Review;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\JsonResponse;

/**
 * 全作品から新着レビューを取得する。
 */
class IndexRecentReviewsController extends Controller
{
    public function __invoke(): JsonResponse
    {
        // 投稿者と作品情報をまとめて取得し、新着順で3件に絞る。
        $reviews = Review::query()
            ->with([
                'user:id,name',
                'work:id,tmdb_id,media_type,title',
            ])
            ->latest()
            ->take(3)
            ->get()
            ->map(fn (Review $review) => [
                'id' => $review->id,
                'userName' => $review->user->name,
                'workTitle' => $review->work->title,
                'tmdbId' => $review->work->tmdb_id,
                'mediaType' => $review->work->media_type,
                'rating' => $review->rating,
                'content' => $review->content,
                'createdAt' => $review->created_at->toISOString(),
            ]);

        return response()->json([
            'reviews' => $reviews,
        ]);
    }
}
