<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Work extends Model
{
    use HasFactory;

    protected $fillable = [
        'tmdb_id',
        'media_type',
        'title',
        'overview',
        'poster_path',
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
