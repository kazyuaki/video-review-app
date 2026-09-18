<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('works', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tmdb_id'); // TMDB上の作品ID
            $table->string('media_type', 20); // movie または tv
            $table->string('title');
            $table->text('overview')->nullable();
            $table->string('poster_path')->nullable();
            $table->date('release_date')->nullable();
            $table->timestamps();

            // 映画・TVシリーズを区別したうえで、TMDB作品を一意にする。
            $table->unique(['tmdb_id', 'media_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('works');
    }
};
