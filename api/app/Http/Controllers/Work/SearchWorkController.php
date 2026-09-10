<?php

namespace App\Http\Controllers\Work;

use App\Exceptions\TmdbRequestException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Work\SearchWorkRequest;
use App\Services\TmdbService;
use Illuminate\Http\JsonResponse;

class SearchWorkController extends Controller
{
    public function __construct(
        private readonly TmdbService $tmdbService,
    ) {}

    /**
     * タイトルキーワードで作品を検索する。
     */
    public function __invoke(SearchWorkRequest $request): JsonResponse
    {
        try {
            $result = $this->tmdbService->search(
                query: $request->validated('query'),
                mediaType: $request->validated('type'),
                page: (int) ($request->validated('page') ?? 1),
            );
        } catch (TmdbRequestException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 503);
        }

        return response()->json($result);
    }
}
