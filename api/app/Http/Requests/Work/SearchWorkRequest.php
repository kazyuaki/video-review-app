<?php

namespace App\Http\Requests\Work;

use Illuminate\Foundation\Http\FormRequest;

class SearchWorkRequest extends FormRequest
{
    /**
     * リクエストの実行を許可する。
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * 作品検索のバリデーションルールを定義する。
     *
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'query' => ['required', 'string', 'max:255'],
            'type' => ['nullable', 'string', 'in:movie,tv'],
            'page' => ['nullable', 'integer', 'min:1'],
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
            'query.required' => '検索キーワードを入力してください。',
            'query.max' => '検索キーワードは255文字以内で入力してください。',
            'type.in' => '作品種別はmovieまたはtvを指定してください。',
            'page.integer' => 'ページは整数で指定してください。',
            'page.min' => 'ページは1以上で指定してください。',
        ];
    }
}
