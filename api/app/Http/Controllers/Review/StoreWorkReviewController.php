<?php

namespace App\Http\Controllers\Review;

use App\Http\Controllers\Controller;
use App\Http\Requests\Review\StoreWorkReviewRequest;
use App\Models\Review;
use App\Models\Work;
use Illuminate\Http\JsonResponse;

class StoreWorkReviewController extends Controller
{
    /**
     * 指定した作品へレビューを投稿する。
     */
    public function __invoke(
        StoreWorkReviewRequest $request,
        string $mediaType,
        int $tmdbId,
    ): JsonResponse {
        $validated = $request->validated();

        // レビュー対象の作品を取得し、未登録の場合だけ登録する。
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

        $alreadyReviewed = Review::query()
            ->where('user_id', $request->user()->id)
            ->where('work_id', $work->id)
            ->exists();

        if ($alreadyReviewed) {
            return response()->json([
                'message' => 'この作品にはすでにレビューを投稿しています。',
            ], 409);
        }

        $review = Review::query()->create([
            'user_id' => $request->user()->id,
            'work_id' => $work->id,
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
        ], 201);
    }
}
