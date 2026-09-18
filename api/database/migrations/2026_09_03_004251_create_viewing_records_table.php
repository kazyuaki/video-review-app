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
        Schema::create('viewing_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('work_id')->constrained()->cascadeOnDelete(); // works テーブルの内部ID
            $table->string('status', 20);
            $table->string('vod_service', 50)->nullable(); // 視聴に利用した配信サービス名
            $table->date('started_at')->nullable();
            $table->date('watched_at')->nullable();
            $table->timestamps();

            // 1ユーザーにつき、1作品の視聴記録は1件にする。
            $table->unique(['user_id', 'work_id']);
            $table->index(['user_id', 'status']);

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('viewing_records');
    }
};
