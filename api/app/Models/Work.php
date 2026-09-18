<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Work extends Model
{
    use HasFactory;

    protected $fillable = [
        'tmdb_id', // TMDB上の作品ID。media_typeと組み合わせて作品を識別する
        'media_type', // movie または tv
        'title',
        'overview',
        'poster_path', // TMDB画像の相対パス。画像URLそのものは保存しない
        'release_date',
    ];

    protected function casts(): array
    {
        return [
            'tmdb_id' => 'integer',
            'release_date' => 'date',
        ];
    }

    /**
     * この作品に紐づく視聴記録を取得する
     */
    public function viewingRecords(): HasMany
    {
        return $this->hasMany(ViewingRecord::class);
    }

    /**
     * この作品に紐づくレビューを取得する
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }
}
