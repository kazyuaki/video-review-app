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
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('work_id')->constrained()->cascadeOnDelete(); // works テーブルの内部ID
            $table->unsignedTinyInteger('rating');
            $table->text('content');
            $table->boolean('has_spoiler')->default(false); // ネタバレを含むレビューかどうか
            $table->timestamps();

            // 1ユーザーにつき、1作品のレビューは1件にする。
            $table->unique(['user_id', 'work_id']);
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
