# CLAUDE.md

このファイルは Claude Code がこのプロジェクトで作業するときの手引きです。

## プロジェクト概要

パチンコ・スロット好きのための **空き台情報共有サイト**。
近くのホールの空き台状況や人気機種の稼働状況をチェックでき、ユーザー同士でリアルタイムに情報を投稿・共有できる。機種スペック（払い出し・演出・解析）の閲覧機能も持つ。

## コスト方針（最重要・絶対条件）

- **基本はコスト0で実装まで進めること**を絶対条件とする。無料の手段（無料枠・OSS・APIキー不要のサービス等）を最優先で選ぶ。
- **課金・費用が発生する恐れがある場合は、実装前に必ず報告し、ユーザーの承認を得てから実装する。** 黙って有料の手段を採用しない。
- 承認が**却下**された場合は、**無料の代替案を提示**する。
- 例: 地図は従量課金の Google Maps を避け、無料の Leaflet + OpenStreetMap を採用済み。

## 技術スタック

- **フレームワーク**: Next.js 16（App Router）/ React 19 / TypeScript
- **スタイリング**: Tailwind CSS v4
- **DB**: Firebase Firestore
- **認証**: Firebase 匿名ログイン（`signInAnonymously`）
- **画像・動画ストレージ**: Cloudflare R2（S3互換、AWS SDK + 署名付きURL）
- **地図**: Leaflet + OpenStreetMap（`react-leaflet`、APIキー不要・無料）へ移行予定。現状コードは `@react-google-maps/api`（Google Maps）だが従量課金を避けるため使わない
- **投稿バックエンド**: Cloudflare Worker（`NEXT_PUBLIC_WORKER_URL` 経由）
- **デプロイ先**: Vercel

## 開発コマンド

作業ディレクトリは `pachinko-empty-finder/`（Next.js プロジェクトのルート）。

```bash
npm run dev          # 開発サーバー起動
npm run build        # 本番ビルド
npm run start        # 本番サーバー起動
npm run lint         # ESLint
npm run import-data  # Firestore へ機種データを流し込み（scripts/import-machine.ts）
```

## ディレクトリ構成

```
app/                     # App Router のページ・APIルート
  api/upload-url/        # R2 への署名付きアップロードURL発行
  api/delete-media/      # R2 のメディア削除
  area/                  # 都道府県・市区町村別ページ
  hall/                  # ホール一覧・詳細
  machine/               # 機種一覧・詳細（[slug]）
  map/                   # 地図表示（Leaflet + OpenStreetMap へ移行予定）
  post/ posts/           # 投稿・投稿一覧・投稿詳細
  layout.tsx             # ルートレイアウト（Header + AuthProvider）
components/
  AuthProvider.tsx       # 匿名ログインを行うラッパー
  Header.tsx
  VideoPlayer.tsx
  machine/               # 機種詳細の表示コンポーネント
lib/
  firebase.ts            # クライアント用 Firebase 初期化（db / auth / analytics）
  firebase/getMachine.ts # 機種データ取得（Machine 型の定義もここ）
scripts/                 # firebase-admin を使ったデータ投入・検証スクリプト
```

## データモデル（Firestore）

- `machines` コレクション … 各ドキュメントID = slug（例: `l-isekai-quartet`）
  - 主なフィールド: `name`, `maker`, `releaseDate`, `modelName`, `category`（`'slot' | 'pachinko'`）, `type[]`, `images`, `payoutData[]`, `features[]`
  - `sections` サブコレクション … 機種詳細の解析・演出セクション（`orderBy("updatedAt", "asc")` で順序管理）
- 型定義の正は `lib/firebase/getMachine.ts` の `Machine` interface。データ構造を変えるときはここを起点に合わせる。

## 環境変数

`.env.local` に設定（コミットしない）。

| 変数 | 用途 |
| --- | --- |
| `NEXT_PUBLIC_FIREBASE_API_KEY` ほか `NEXT_PUBLIC_FIREBASE_*` | Firebase クライアント設定 |
| `R2_ACCOUNT_ID` / `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` / `R2_BUCKET_NAME` | Cloudflare R2（サーバー側のみ） |
| `NEXT_PUBLIC_WORKER_URL` | 投稿処理の Cloudflare Worker エンドポイント |

- `firebase-adminsdk.json` … データ投入スクリプト用のサービスアカウント鍵。**機密情報なのでコミットしない。**
- 地図は **Leaflet + OpenStreetMap** を使う方針（APIキー・課金不要）。`app/map/page.tsx` は現在 Google Maps（`"YOUR_API_KEY"` 仮置き）なので react-leaflet へ置き換える。

## コーディング規約・命名規則

- **コメントは日本語で書く**（既存コードに合わせる）。
- **ファイル名**: コンポーネントは PascalCase（例: `Header.tsx` / `VideoPlayer.tsx`）。
- **変数・関数名**: camelCase（例: `getMachineData`）。
- 周囲のコードのスタイル（命名・コメントの粒度・イディオム）に合わせる。
- `NEXT_PUBLIC_` を付けた環境変数のみクライアントに露出する。R2 のシークレットなど機密値は `NEXT_PUBLIC_` を付けず、サーバー側（APIルート / スクリプト）でのみ使う。

## 作業の進め方

- **小さく進める**。1回の変更は1つの目的に絞り、大きな改修は分割する。
- **こまめに GitHub へプッシュする**。動く単位ができたら都度コミット＆プッシュ。
- **コミットメッセージは日本語の自由記述**で簡潔に（例:「機種詳細にアコーディオン追加」「地図をLeafletに置き換え」）。
