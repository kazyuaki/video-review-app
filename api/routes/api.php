<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Review\IndexWorkReviewsController;
use App\Http\Controllers\Review\StoreWorkReviewController;
use App\Http\Controllers\Review\UpdateOwnWorkReviewController;
use App\Http\Controllers\Work\SearchWorkController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| 認証（未ログインユーザー向け）
|--------------------------------------------------------------------------
*/
Route::middleware('guest')->group(function () {
    // 会員登録
    Route::post('/register', RegisterController::class);
    // ログイン
    Route::post('/login', LoginController::class);
});

/*
|--------------------------------------------------------------------------
| 認証（ログイン済みユーザー向け）
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    // ログアウト
    Route::post('/logout', LogoutController::class);

    // ログイン中のユーザー情報を取得
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // レビュー投稿
    Route::post('/works/{mediaType}/{tmdbId}/reviews', StoreWorkReviewController::class)
        ->whereIn('mediaType', ['movie', 'tv'])
        ->whereNumber('tmdbId');
    // 自身のレビューを更新
    Route::put(
        '/works/{mediaType}/{tmdbId}/reviews/me',
        UpdateOwnWorkReviewController::class,
    )->whereIn('mediaType', ['movie', 'tv'])
        ->whereNumber('tmdbId');
});

/*
|--------------------------------------------------------------------------
| 作品（未ログインでも利用可能）
|--------------------------------------------------------------------------
*/
// 作品検索
Route::get('/works/search', SearchWorkController::class);
// 作品ごとのレビュー一覧・評価集計を取得
Route::get('/works/{mediaType}/{tmdbId}/reviews', IndexWorkReviewsController::class)
    ->whereIn('mediaType', ['movie', 'tv'])
    ->whereNumber('tmdbId');
