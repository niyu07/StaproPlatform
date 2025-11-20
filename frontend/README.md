# Frontend

このプロジェクトはReact + TypeScript + Viteで構築されたフロントエンドアプリケーションです。

## 環境構築

### 必要な環境

- Docker
- Docker Compose

### セットアップ手順

1. リポジトリのルートディレクトリに移動

```bash
cd /path/to/StaproPlatform
```

1. Dockerコンテナの起動

```bash
docker-compose up -d
```

1. アプリケーションへのアクセス

```text
http://localhost:5173
```

### よく使うコマンド

```bash
# コンテナの起動
docker-compose up -d

# コンテナの停止
docker-compose down

# コンテナのログ確認
docker-compose logs -f frontend

# コンテナ内でコマンド実行
docker-compose exec frontend npm run lint
docker-compose exec frontend npm run format

# 依存関係の追加
docker-compose exec frontend npm install [package-name]
```

## プロジェクト構造

```text
src/
├─ components/     # UIコンポーネント
├─ pages/          # ページコンポーネント（ルーティング単位）
├─ hooks/          # カスタムフック
├─ store/          # 状態管理（Zustand/Recoil など）
├─ utils/          # ユーティリティ関数
└─ assets/         # 静的ファイル（画像、SVGなど）
```

## 命名規則

プロジェクト全体で統一された命名規則を使用しています：

- **コンポーネント名**: PascalCase（例: `UserProfile.tsx`, `NavigationBar.tsx`）
- **フック名**: `use`から始めるcamelCase（例: `useFetchData.ts`, `useAuth.ts`）
- **変数・関数**: camelCase（例: `fetchUserData`, `isAuthenticated`）
- **ファイル名**: camelCase（例: `userProfile.tsx`, `fetchData.ts`）
- **ディレクトリ名**: 複数形で統一（例: `components`, `hooks`, `utils`）

## 技術スタック

- **フレームワーク**: React 19
- **言語**: TypeScript
- **ビルドツール**: Vite
- **スタイリング**: Tailwind CSS v4
- **リンター**: ESLint
- **フォーマッター**: Prettier

## 開発

### スクリプト

```bash
# 開発サーバーの起動
npm run dev

# ビルド（型チェック含む）
npm run build

# リンター実行
npm run lint

# リンター自動修正
npm run lint:fix

# フォーマッターチェック
npm run format

# フォーマッター自動修正
npm run format:fix

# 型チェックのみ
npm run type-check

# プロダクションビルドのプレビュー
npm run preview
```

### コーディング規約

- コンポーネントは関数コンポーネントで記述
- TypeScriptの型定義を明示的に行う
- ESLintとPrettierの設定に従う
- コミット前に`npm run lint`と`npm run format`を実行
