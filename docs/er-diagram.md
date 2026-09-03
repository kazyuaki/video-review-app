# ER図

動画視聴管理・レビューアプリで使用するデータベースの構成です。

テーブルの詳細な定義については、[テーブル仕様書](https://docs.google.com/spreadsheets/d/12PhXt0fo1otrrtjXkOP4x9LF3UyFw96oJ7vN3iqy65w/edit?gid=1188247583#gid=1188247583)を参照してください。

```mermaid
erDiagram
    users ||--o{ viewing_records : "視聴作品を登録"
    works ||--o{ viewing_records : "視聴記録を持つ"

    users ||--o{ reviews : "レビューを投稿"
    works ||--o{ reviews : "レビューを持つ"

    users ||--o{ review_likes : "レビューにいいね"
    reviews ||--o{ review_likes : "いいねを持つ"

    users {
        bigint id PK "ユーザーID"
        varchar name "ユーザー名"
        varchar email UK "メールアドレス"
        timestamp email_verified_at "メール認証日時"
        varchar password "パスワード"
        varchar profile_image_path "プロフィール画像"
        varchar bio "自己紹介"
        varchar remember_token "ログイン保持用トークン"
        timestamp created_at "作成日時"
        timestamp updated_at "更新日時"
    }

    works {
        bigint id PK "作品ID"
        bigint tmdb_id UK "TMDB作品ID"
        varchar media_type UK "movie または tv"
        varchar title "作品名"
        text overview "作品概要"
        varchar poster_path "ポスター画像"
        date release_date "公開日・初回放送日"
        timestamp created_at "作成日時"
        timestamp updated_at "更新日時"
    }

    viewing_records {
        bigint id PK "視聴記録ID"
        bigint user_id FK,UK "ユーザーID"
        bigint work_id FK,UK "作品ID"
        varchar status "視聴状況"
        varchar vod_service "視聴した配信サービス"
        date started_at "視聴開始日"
        date watched_at "視聴完了日"
        timestamp created_at "作成日時"
        timestamp updated_at "更新日時"
    }

    reviews {
        bigint id PK "レビューID"
        bigint user_id FK,UK "ユーザーID"
        bigint work_id FK,UK "作品ID"
        tinyint rating "1〜5の評価"
        text content "レビュー本文"
        boolean has_spoiler "ネタバレの有無"
        timestamp created_at "投稿日時"
        timestamp updated_at "更新日時"
    }

    review_likes {
        bigint id PK "いいねID"
        bigint user_id FK,UK "ユーザーID"
        bigint review_id FK,UK "レビューID"
        timestamp created_at "作成日時"
        timestamp updated_at "更新日時"
    }
```

## テーブル間の関係

- ユーザーは複数の作品をマイリストへ登録できます。
- 作品は複数ユーザーの視聴記録を持ちます。
- ユーザーは複数のレビューを投稿できます。
- 作品は複数のレビューを持ちます。
- ユーザーは複数のレビューに「いいね」できます。
- レビューは複数の「いいね」を持ちます。

## 複合ユニーク制約

| テーブル | 対象カラム | 目的 |
|---|---|---|
| `works` | `tmdb_id`, `media_type` | 同じTMDB作品の重複登録を防ぐ |
| `viewing_records` | `user_id`, `work_id` | 同じユーザーによる同一作品の重複登録を防ぐ |
| `reviews` | `user_id`, `work_id` | 1ユーザーにつき1作品1レビューに制限する |
| `review_likes` | `user_id`, `review_id` | 同じレビューへの重複した「いいね」を防ぐ |

## インデックス

| テーブル | 対象カラム | 目的 |
|---|---|---|
| `viewing_records` | `user_id`, `status` | ユーザーのマイリストを視聴状況で絞り込む |
| `reviews` | `created_at` | レビューを新着順で取得する |

## カラムの補足

### `viewing_records.status`

次のいずれかを保存します。

- `want_to_watch`：観たい
- `watching`：視聴中
- `watched`：視聴済み
- `dropped`：中断

### `reviews.has_spoiler`

- `false`：ネタバレなし
- `true`：ネタバレあり
- 初期値は`false`