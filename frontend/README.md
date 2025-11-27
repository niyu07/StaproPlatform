# Stapro Platform Frontend

Staproプラットフォームのフロントエンドアプリケーション

## 技術スタック

- **フレームワーク**: React 19.2.0
- **ビルドツール**: Vite 7.2.2
- **言語**: TypeScript 5.9.3
- **スタイリング**: Tailwind CSS 3.4.0
- **UIコンポーネント**: shadcn/ui
- **ルーティング**: React Router DOM 7.9.6
- **アイコン**: Lucide React

## セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build

# 型チェック
npm run type-check

# リント
npm run lint

# フォーマット
npm run format:fix
```

## プロジェクト構成

```
frontend/
├── public/                 # 静的ファイル
├── src/
│   ├── assets/            # 画像などのアセット
│   ├── components/        # コンポーネント
│   │   ├── layout/        # レイアウトコンポーネント
│   │   │   ├── sidebar.tsx
│   │   │   └── sidebar-item.tsx
│   │   └── ui/            # 汎用UIコンポーネント（shadcn/ui + カスタム）
│   │       ├── avatar.tsx
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── icons.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── logo.tsx
│   │       ├── logout-button.tsx
│   │       ├── mobile-menu.tsx
│   │       ├── search-bar.tsx
│   │       ├── section-title.tsx
│   │       ├── select.tsx
│   │       ├── sheet.tsx
│   │       └── user-profile.tsx
│   ├── features/          # 機能別コンポーネント
│   │   └── students/      # 生徒管理機能
│   │       ├── student-card.tsx
│   │       └── student-edit-modal.tsx
│   ├── layouts/           # レイアウト
│   │   ├── MainLayout.tsx
│   │   └── MainLayout.css
│   ├── lib/               # ユーティリティ関数
│   │   └── utils.ts
│   ├── mock/              # モックデータ
│   │   └── data.ts
│   ├── pages/             # ページコンポーネント
│   │   ├── Dashboard.tsx
│   │   ├── StudentsList.tsx
│   │   └── StudentsList.css
│   ├── types/             # TypeScript型定義
│   │   └── database.ts
│   ├── App.tsx            # アプリケーションルート
│   ├── main.tsx           # エントリーポイント
│   └── index.css          # グローバルスタイル
├── components.json        # shadcn/ui設定
├── tailwind.config.js     # Tailwind設定
├── tsconfig.json          # TypeScript設定
├── vite.config.ts         # Vite設定
└── package.json
```

## ディレクトリ構造の説明

### `/src/components/ui/`
shadcn/uiのコンポーネントと、アプリケーション全体で使用する汎用UIコンポーネントを配置します。

### `/src/components/layout/`
レイアウト関連のコンポーネント（サイドバーなど）を配置します。

### `/src/features/`
機能別にコンポーネントを整理します。各機能は独立したディレクトリに配置します。
- `students/`: 生徒管理機能

### `/src/pages/`
ルーティングで使用するページコンポーネントを配置します。

### `/src/lib/`
アプリケーション全体で使用するユーティリティ関数を配置します。

## 開発ガイドライン

### コンポーネントの命名規則
- UIコンポーネント: `PascalCase`（例: `Button.tsx`）
- カスタムコンポーネント: `Custom`プレフィックス（例: `CustomTable.tsx`）

### スタイリング
- Tailwind CSSを使用
- CSSファイルは可能な限り避け、Tailwindクラスを使用
- shadcn/uiのテーマシステム（CSS変数）を活用

### 型定義
- すべてのコンポーネントにTypeScript型を定義
- 型定義は`/src/types/`に集約

## コマンド

- `npm run dev`: 開発サーバーを起動
- `npm run build`: プロダクションビルド
- `npm run lint`: ESLintでコードチェック
- `npm run lint:fix`: ESLintで自動修正
- `npm run format`: Prettierでフォーマットチェック
- `npm run format:fix`: Prettierで自動フォーマット
- `npm run type-check`: TypeScriptの型チェック
