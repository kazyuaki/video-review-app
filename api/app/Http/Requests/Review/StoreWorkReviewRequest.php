<?php

namespace App\Http\Requests\Review;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreWorkReviewRequest extends FormRequest
{
    /**
     * リクエストの実行を許可する。
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * レビュー投稿時のバリデーションルールを定義する。
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'overview' => ['nullable', 'string'],
            'poster_path' => ['nullable', 'string', 'max:255'],
            'release_date' => ['nullable', 'date'],
            'rating' => ['required', 'integer', 'between:1,5'],
            'content' => ['required', 'string', 'max:2000'],
            'has_spoiler' => ['nullable', 'boolean'],
        ];
    }

    /**
     * バリデーションエラーメッセージを定義する。
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => '作品タイトルを入力してください。',
            'title.max' => '作品タイトルは255文字以内で入力してください。',

            'rating.required' => '評価を選択してください。',
            'rating.integer' => '評価は整数で指定してください。',
            'rating.between' => '評価は1から5の間で選択してください。',

            'content.required' => 'レビュー本文を入力してください。',
            'content.max' => 'レビュー本文は2000文字以内で入力してください。',
        ];
    }
}
