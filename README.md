# Video Review App

映画・ドラマ・アニメなどの視聴記録とレビューを管理・共有するWebアプリケーションです。

> 現在開発中の個人開発プロジェクトです。

## アプリ概要

Netflix、Prime Video、Hulu、U-NEXTなど、複数の動画配信サービスで視聴した作品をまとめて管理できます。

作品の検索、視聴状況の管理、評価・レビューの投稿を行えるほか、他のユーザーが投稿したレビューも閲覧できるサービスを目指しています。

## 制作背景・目的

利用する動画配信サービスが増えると、次のような問題が発生します。

- どのサービスで作品を視聴したか分からなくなる
- 視聴途中の作品や、これから観たい作品を管理しにくい
- 複数サービスを横断して視聴履歴を確認できない
- 作品を観たときの感想を後から振り返りにくい

これらを解決するため、複数の動画配信サービスにまたがる視聴記録とレビューを、一か所で管理できるアプリケーションを制作します。

## 主な機能

### 基本機能

- ユーザー登録
- ログイン・ログアウト
- プロフィール表示・編集
- 映画・ドラマ・アニメの検索
- 作品詳細の表示
- マイリストへの作品登録
- 視聴状況の管理
  - 観たい
  - 視聴中
  - 視聴済み
  - 中断
- 利用した配信サービスの記録
- 視聴開始日・視聴完了日の記録
- 5段階評価とレビューの投稿
- レビューの編集・削除
- 他ユーザーのレビュー閲覧
- ネタバレを含むレビューの非表示
- レビューへの「いいね」

### 今後実装予定の応用機能

- ネタバレ防止トグル
- 配信サービス別の作品絞り込み
- 各配信サービスへの直接リンク
- 視聴履歴のグラフ表示
- 視聴リマインダー
- カレンダー連携
- レビューへのコメント

## 使用技術

### バックエンド

- PHP 8.4
- Laravel 13
- Laravel Sanctum
- PHPUnit

### フロントエンド

- TypeScript
- Next.js 16
- React 19
- Tailwind CSS 4
- ESLint

### データベース

- MySQL 8.4

### インフラ・開発環境

- Docker
- Docker Compose
- Nginx
- Git
- GitHub

### 外部API

- TMDB API（予定）

## ディレクトリ構成

```text
video-review-app/
├── api/                       # Laravel
├── node/                      # Next.js
├── docker/
│   ├── mysql/
│   │   ├── data/
│   │   └── my.cnf
│   ├── nginx/
│   │   └── default.conf
│   ├── node/
│   │   └── Dockerfile
│   └── php/
│       ├── Dockerfile
│       └── php.ini
├── docs/
│   └── er-diagram.md
├── compose.yml
├── .gitignore
└── README.md
```

## 環境構築

### 必要なもの

事前に次のソフトウェアをインストールしてください。

- Git
- Docker Desktop

### 1. リポジトリをクローン

```bash
git clone git@github.com:kazyuaki/video-review-app.git
```

```bash
cd video-review-app
```

### 2. Laravelの環境設定ファイルを作成

```bash
cp api/.env.example api/.env
```

`api/.env`のデータベース設定を、次のように変更してください。

```env
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=video_review_app
DB_USERNAME=video_review_user
DB_PASSWORD=password
```

### 3. Dockerイメージを作成

```bash
docker compose build
```

### 4. Laravelの依存パッケージをインストール

```bash
docker compose run --rm php composer install
```

### 5. Next.jsの依存パッケージをインストール

```bash
docker compose run --rm node npm install
```

### 6. Laravelのアプリケーションキーを生成

```bash
docker compose run --rm php php artisan key:generate
```

### 7. コンテナを起動

```bash
docker compose up -d
```

### 8. マイグレーションを実行

```bash
docker compose exec php php artisan migrate
```

### 9. 起動状態を確認

```bash
docker compose ps
```

## アクセスURL

| サービス | URL |
|---|---|
| Next.js | http://localhost:3000 |
| Laravel | http://localhost:8080 |
| MySQL | localhost:3306 |

## コンテナの停止

```bash
docker compose down
```

データベースのボリュームも削除する場合は、次を実行します。

```bash
docker compose down -v
```

> `-v`を付けると、Dockerが管理するボリューム内のデータも削除されるため注意してください。

## ER図

[ER図を確認する](./docs/er-diagram.md)

## テーブル構成

- `users`
- `works`
- `viewing_records`
- `reviews`
- `review_likes`

詳細は[ER図](./docs/er-diagram.md)を参照してください。

## テスト

### Laravel

```bash
docker compose exec php php artisan test
```

### Next.js

```bash
docker compose exec node npm run lint
```

フロントエンドの自動テストは今後追加予定です。

## 要件定義書

本アプリケーションの要件は、次の資料にまとめています。

[動画管理アプリ 要件定義書](https://docs.google.com/spreadsheets/d/12PhXt0fo1otrrtjXkOP4x9LF3UyFw96oJ7vN3iqy65w/edit)

## デプロイ

XServerへのデプロイを予定しています。