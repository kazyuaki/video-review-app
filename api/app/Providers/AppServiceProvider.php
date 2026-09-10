<?php

namespace App\Providers;

use App\Services\TmdbService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(TmdbService::class, function () {
            return new TmdbService(
                baseUrl: config('services.tmdb.base_url'),
                apiKey: config('services.tmdb.key'),
            );
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
