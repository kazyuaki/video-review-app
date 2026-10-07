<?php

namespace App\Http\Requests\ViewingRecord;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateViewingRecordRequest extends FormRequest
{
    /**
     * リクエストの実行を許可する。
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * 視聴記録更新時のバリデーションルールを定義する。
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'status' => [
                'required',
                'string',
                Rule::in(['want_to_watch', 'watching', 'watched', 'dropped']),
            ],
            'vod_service' => ['nullable', 'string', 'max:50'],
            'started_at' => ['nullable', 'date'],
            'watched_at' => ['nullable', 'date'],
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
            'status.required' => '視聴状況を選択してください。',
            'status.in' => '視聴状況が不正です。',
        ];
    }
}
