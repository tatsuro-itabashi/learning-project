# Learning Project — TypeScript ポートフォリオ

---

## 目標

| 項目 | 内容 |
|------|------|
| 期間 | 30日間 |
| アプリ数 | 3本 |
| 主要スキル | TypeScript / React / Next.js / Prisma / Supabase |
| 転職目標 | 自社開発企業（年収600万円） |

---

## プロジェクト一覧

### [App 1: Kanban タスク管理アプリ](./app1-kanban-board/)

**Day 1〜9** ／ フロントエンド完結型

React × TypeScript のコンポーネント設計を習得する入門アプリ。
Trello ライクなカンバンボードで、ドラッグ&ドロップ・CRUD・localStorage 永続化を実装。

| 技術 | 用途 |
|------|------|
| React 18 + Vite | UI フレームワーク |
| TypeScript（strict） | 型安全な実装 |
| Zustand | 状態管理 |
| dnd-kit | ドラッグ&ドロップ |
| Tailwind CSS | スタイリング |
| Vitest | ユニットテスト |

---

### [App 2: フルスタックブログプラットフォーム](./app2-blog-platform/)

**Day 10〜21** ／ フルスタック型

Next.js App Router × Prisma × TypeScript によるフルスタック開発。
Laravel 経験を活かしつつ、TypeScript で DB からフロントまで E2E 型安全を実現。

| 技術 | 用途 |
|------|------|
| Next.js 14 App Router | フルスタックフレームワーク |
| TypeScript（strict） | 型安全な実装 |
| Prisma | ORM（型自動生成） |
| NextAuth.js v5 | 認証（GitHub OAuth） |
| Zod | バリデーション |
| PostgreSQL（Supabase） | データベース |

---

### [App 3: リアルタイム家計簿アプリ](./app3-household-budget/)

**Day 22〜30** ／ リアルタイム + データ可視化

Supabase Realtime × Recharts × Playwright を組み合わせた応用アプリ。
複数ユーザー間のリアルタイム同期・グラフ表示・E2E テストで実践的な設計力を示す。

| 技術 | 用途 |
|------|------|
| Next.js 14 App Router | フルスタックフレームワーク |
| TypeScript（strict） | 型安全な実装 |
| Supabase Realtime | リアルタイム同期 |
| Recharts | グラフ・データ可視化 |
| date-fns | 日付操作 |
| Playwright | E2E テスト |

---

## 30日間スケジュール

```
Week 1  (Day  1〜 7)  App1 Kanban — 基礎固め
Week 2  (Day  8〜14)  App1 完成 → App2 Blog 開始
Week 3  (Day 15〜21)  App2 Blog 完成
Week 4  (Day 22〜30)  App3 家計簿 完成・全体仕上げ
```

---

## TypeScript 学習ロードマップ

| フェーズ | アプリ | 習得概念 |
|---------|--------|---------|
| 基礎 | App1 | `interface` / `type`・Union型・Generics・Utility Types |
| 応用 | App2 | Prisma自動生成型・`z.infer<>`・条件型・`never`型 |
| 発展 | App3 | Mapped Types・Template Literal Types・`satisfies`・Type Predicates |

---

## 各アプリの詳細

各アプリフォルダの `README.md` に以下を記載しています：

- 要件定義（機能要件・非機能要件）
- 技術選定と選んだ理由
- 日次タスク一覧
- ディレクトリ構成・DB設計
- 技術選定の背景・設計メモ
