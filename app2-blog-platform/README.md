# App 2: フルスタックブログプラットフォーム

## 概要

Next.js App Router × Prisma × TypeScript によるフルスタック構成を実践的に習得するアプリケーション。
Laravel でのバックエンド開発経験を活かしつつ、TypeScript による E2E 型安全性（フロント〜DB まで型が一貫する設計）を実現する。

## 開発期間

**Day 10〜21**（全12日）

---

## 要件定義

### 機能要件

- 記事の投稿・編集・削除（MDX エディタ）
- 認証（メール・パスワード + GitHub OAuth）
- タグ・カテゴリ分類
- いいね・コメント機能
- 記事の公開 / 下書き管理
- ページネーション・全文検索

### 非機能要件

- Server Actions によるフォーム処理（API Route を最小化）
- Suspense + Streaming による段階的レンダリング
- Zod によるバリデーション（フロント・サーバー共通スキーマ）
- エラーバウンダリ（`error.tsx`）・ローディング UI（`loading.tsx`）

---

## 技術選定

| 技術 | バージョン | 選定理由 |
|------|-----------|----------|
| Next.js App Router | 14 | RSC・Server Actions・Streaming をフル活用できるフルスタックフレームワーク |
| TypeScript | 5（strict） | App1 に続き strict mode を継続。フロント〜サーバー〜DB まで型を一貫させる |
| Prisma | 5 | スキーマから TypeScript 型を自動生成できる。Laravel の Eloquent から移行しやすい |
| NextAuth.js | v5 | OAuth 統合とセッション管理を型安全に扱える |
| Zod | 3 | フロント・サーバー共通のバリデーションスキーマ。`z.infer<>` で型定義の重複をなくす |
| PostgreSQL（Supabase） | - | 本番環境を想定したクラウド RDB。無料枠で運用可能 |
| Tailwind CSS | 3 | App1 から継続。UI 実装の速度を維持する |

---

## TypeScript で習得する概念

| 概念 | 活用箇所 |
|------|---------|
| Prisma の自動生成型の活用 | `Post`, `User`, `Comment` の型をスキーマから自動生成して再利用 |
| Zod スキーマから型推論（`z.infer<>`） | フォームの入力型・API リクエスト型を Zod スキーマから導出 |
| Server / Client コンポーネントの型設計 | Props に `"use client"` 境界を意識した型設計 |
| `never` 型・Exhaustiveness checking | switch 文での網羅性チェック（記事ステータスの処理など） |
| 条件型（Conditional Types） | 認証状態によって異なる型を返すユーティリティ型 |

---

## 日次タスク

| Day | テーマ | 成果物 |
|-----|--------|--------|
| 10 | Next.js 環境構築・Prisma スキーマ設計・DB マイグレーション | DB 設計完成・接続確認 |
| 11 | NextAuth.js 設定・GitHub OAuth 認証フロー実装 | ログイン / ログアウト動作 |
| 12 | 記事投稿・編集フォーム（Zod + Server Actions） | フォームバリデーション完成 |
| 13 | 記事一覧・詳細ページ（RSC + Suspense） | SSR 表示確認 |
| 14 | タグ・カテゴリ機能実装 | 分類・フィルタリング完成 |
| 15 | いいね機能（楽観的更新） | UX を意識したリアクティブ UI |
| 16 | コメント機能実装（ネスト構造） | コメントスレッド表示 |
| 17 | 全文検索・ページネーション | URL パラメータ連動の検索 |
| 18 | 公開 / 下書き管理・権限チェック（ロールベース制御） | 認可機能完成 |
| 19 | エラーハンドリング・Loading UI（`error.tsx` / `loading.tsx`） | 堅牢な UX 完成 |
| 20 | Supabase 本番 DB 接続・Vercel デプロイ | 本番 URL 取得 |
| 21 | README 最終版（設計意図・技術選定の理由を詳記）・スクリーンショット撮影 | アプリ完成・公開完了 |

---

## ディレクトリ構成（予定）

```
app2-blog-platform/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (blog)/
│   │   ├── posts/
│   │   │   ├── [slug]/
│   │   │   └── new/
│   │   └── page.tsx
│   ├── api/
│   │   └── auth/
│   ├── error.tsx
│   ├── loading.tsx
│   └── layout.tsx
├── components/
│   ├── editor/
│   ├── post/
│   └── ui/
├── lib/
│   ├── auth.ts         # NextAuth 設定
│   ├── db.ts           # Prisma クライアント
│   └── validations/    # Zod スキーマ
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── types/              # 追加の型定義
├── next.config.ts
├── tsconfig.json
└── README.md
```

---

## DB スキーマ設計（Prisma）

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  posts     Post[]
  comments  Comment[]
  likes     Like[]
  createdAt DateTime @default(now())
}

model Post {
  id          String    @id @default(cuid())
  title       String
  slug        String    @unique
  content     String
  status      PostStatus @default(DRAFT)
  author      User      @relation(fields: [authorId], references: [id])
  authorId    String
  tags        Tag[]
  comments    Comment[]
  likes       Like[]
  publishedAt DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

enum PostStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}
```

---

## 設計のポイント・振り返り

1. **Laravel との比較**: Eloquent vs Prisma、Blade vs RSC、Laravel Sanctum vs NextAuth.js の違いを整理する
2. **E2E 型安全性の設計**: Zod スキーマ → `z.infer<>` → Prisma 型 → API レスポンス型まで `any` を使わない設計
3. **Server Actions の選択理由**: なぜ API Route ではなく Server Actions を使ったか（キャッシュ・再検証の観点）
4. **次に追加したい機能**: 全文検索エンジン（Algolia or pg_search）・RSS フィード・OGP 画像自動生成
