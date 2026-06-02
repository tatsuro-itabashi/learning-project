# フルスタックブログプラットフォーム

Next.js App Router + Prisma + NextAuth.js + TypeScript で構築したフルスタックブログ。
記事の投稿・タグ管理・いいね・コメント・検索・ページネーションに対応。

## デモ

**本番 URL**: 未公開

- テストアカウント: GitHub OAuth でログイン可能

## 機能一覧

### 記事
- 記事の作成・編集・削除（Markdown 対応）
- 公開 / 下書き管理
- スラッグベースの URL

### 検索・フィルタ
- キーワード全文検索（タイトル・本文）
- タグによる絞り込み
- ページネーション（9件/ページ）
- URL パラメータ連動（検索結果の共有可能）

### ユーザー機能
- GitHub OAuth 認証（NextAuth.js v5）
- いいね（楽観的更新）
- コメント
- ダッシュボード（自分の記事管理）

### 品質
- エラーバウンダリ（スコープ別 `error.tsx`）
- Loading UI（スコープ別 `loading.tsx`・スケルトン）
- カスタム 404 / 403 ページ
- Zod による型安全なバリデーション（フロント・サーバー共通）
- Middleware による認証保護

## 技術スタック

| 技術 | バージョン | 選定理由 |
|------|-----------|----------|
| Next.js App Router | 14 | RSC・Server Actions・Streaming をフル活用できるフルスタックフレームワーク |
| TypeScript | 5（strict） | フロント〜サーバー〜DB まで型を一貫させる |
| Prisma | 5 | スキーマから TypeScript 型を自動生成。Laravel Eloquent からの移行もしやすい |
| NextAuth.js | v5 | OAuth 統合とセッション管理を型安全に扱える |
| Zod | 3 | フロント・サーバー共通スキーマ。`z.infer<>` で型定義の重複をなくす |
| PostgreSQL（Supabase） | - | 本番環境を想定したクラウド RDB。無料枠で運用可能 |
| Tailwind CSS | 3 | ユーティリティファーストで UI 実装に集中できる |

## TypeScript の工夫

### `z.infer<>` でスキーマと型を一元管理

```ts
export const postFormSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です').max(100),
  content: z.string().min(1, '本文は必須です'),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'スラッグは半角英数字とハイフンのみ'),
  status: z.enum(['DRAFT', 'PUBLISHED']),
})

// スキーマから型を導出（型定義とバリデーションを二重管理しない）
export type PostFormValues = z.infer<typeof postFormSchema>
```

### Declaration Merging で NextAuth の型を拡張

```ts
declare module 'next-auth' {
  interface Session {
    user: { id: string } & DefaultSession['user']
  }
}
```

NextAuth のデフォルト型に `id` フィールドを追加。既存の型を壊さずに拡張できる TypeScript の Declaration Merging を活用。

### `never` 型で認可エラーの網羅性を保証

```ts
export type AuthError =
  | { type: 'UNAUTHENTICATED' }
  | { type: 'FORBIDDEN' }
  | { type: 'NOT_FOUND' }

function handleAuthError(error: AuthError): never {
  switch (error.type) {
    case 'UNAUTHENTICATED': redirect('/login')
    case 'FORBIDDEN':       redirect('/403')
    case 'NOT_FOUND':       redirect('/404')
    default:
      // AuthError に新しい種別を追加したとき、
      // ここに到達するとコンパイルエラーになる
      const _: never = error
      redirect('/500')
  }
}
```

### Prisma の `select` で型安全な部分取得

```ts
// select した内容から戻り値の型が自動推論される
export type PostSummary = Awaited<ReturnType<typeof getPublishedPosts>>[number]
```

`any` を使わずに DB の取得結果の型を保証。

### `useOptimistic` で楽観的更新

```tsx
const [optimisticState, addOptimistic] = useOptimistic<LikeState, 'toggle'>(
  { liked: initialLiked, count: initialCount },
  (current, action) => ({
    liked: !current.liked,
    count: current.liked ? current.count - 1 : current.count + 1,
  }),
)
```

Server Action の完了を待たずにUIを即時更新。失敗時は自動ロールバック。

## 設計のポイント

### Server Components と Client Components の使い分け

```
RSC（Server Component）     → データ取得・認証チェック・静的 UI
Client Component ('use client') → インタラクション・フォーム・楽観的更新
```

`Header`・`PostList`・各ページは RSC で実装し、`LikeButton`・`PostForm`・`SearchBar` のみ Client Component にすることで、JavaScript のバンドルサイズを最小化。

### URL 駆動の検索設計

```
/posts?q=typescript&page=2
```

検索条件を URL パラメータで管理することで：
- ブラウザの「戻る」ボタンで検索結果に戻れる
- URL を共有するだけで同じ検索結果を再現できる
- サーバーサイドで直接 DB クエリに渡せる（クライアント状態不要）

### エラーバウンダリのスコープ設計

```
app/error.tsx          ← 全体の最終砦
app/posts/[slug]/
  error.tsx            ← 記事詳細のエラーのみ補足
  not-found.tsx        ← 記事 not found のカスタム UI
app/dashboard/
  error.tsx            ← ダッシュボードのエラーのみ補足
```

スコープを絞ることで、一部のエラーがアプリ全体をクラッシュさせない設計。

## ローカル環境のセットアップ

```bash
npm install

# 環境変数を設定
cp .env.example .env.local
# .env.local に DB 接続文字列・Auth 設定を記入

# DB マイグレーション
npx prisma migrate dev

# 開発サーバー起動
npm run dev
```

**必要な環境変数**

```env
DATABASE_URL=
DIRECT_URL=
AUTH_SECRET=
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=
```

## DB スキーマ

```
User ──< Post ──< Comment
              ──< Like
              >── Tag（多対多）
```

## ディレクトリ構成

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # 認証関連ページ
│   ├── posts/              # 記事ページ・Server Actions
│   ├── tags/               # タグページ
│   ├── dashboard/          # マイ記事管理
│   ├── error.tsx           # グローバルエラーバウンダリ
│   └── not-found.tsx       # グローバル 404
├── components/
│   ├── layout/             # Header など
│   ├── post/               # 記事関連コンポーネント
│   ├── search/             # 検索バー
│   └── ui/                 # 汎用 UI（TagBadge など）
├── lib/
│   ├── posts.ts            # 記事の DB アクセス関数
│   ├── tags.ts             # タグの DB アクセス関数
│   ├── auth-helpers.ts     # 認証・認可ヘルパー
│   ├── db.ts               # Prisma クライアント
│   └── validations/        # Zod スキーマ
├── types/
│   └── next-auth.d.ts      # NextAuth 型拡張
└── auth.ts                 # NextAuth 設定
```