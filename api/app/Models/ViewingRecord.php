<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ViewingRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'work_id',
        'status',
        'vod_service',
        'started_at',
        'watched_at',
    ];

    protected function casts(): array
    {
        return [
            'started_at' => 'date',
            'watched_at' => 'date',
        ];
    }

    /**
     * 視聴記録を登録したユーザーを取得する
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * 視聴記録の対象となる作品を取得する
     */
    public function work(): BelongsTo
    {
        return $this->belongsTo(Work::class);
    }
}
