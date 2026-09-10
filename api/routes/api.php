<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Work\SearchWorkController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| 認証（未ログインユーザー向け）
|--------------------------------------------------------------------------
*/
Route::middleware('guest')->group(function () {
    Route::post('/register', RegisterController::class);
    Route::post('/login', LoginController::class);
});

/*
|--------------------------------------------------------------------------
| 認証（ログイン済みユーザー向け）
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', LogoutController::class);

    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});

/*
|--------------------------------------------------------------------------
| 作品（未ログインでも利用可能）
|--------------------------------------------------------------------------
*/
Route::get('/works/search', SearchWorkController::class);
