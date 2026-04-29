# App 3: リアルタイム家計簿アプリ

## 概要

WebSocket / リアルタイム通信・グラフ可視化・高度な TypeScript 型パターンを組み合わせた応用アプリケーション。
App1・App2 とは異なる技術領域（リアルタイム・データビジュアライゼーション・E2E テスト）に取り組む。

## 開発期間

**Day 22〜30**（全9日）

---

## 要件定義

### 機能要件

- 収支の記録（カテゴリ・メモ・日付・金額）
- 月別・カテゴリ別のグラフ表示（棒グラフ・円グラフ）
- 予算設定と超過アラート（プッシュ通知）
- 複数アカウント（家族間）でのリアルタイム共有
- CSV エクスポート
- 月次レポート自動生成

### 非機能要件

- Supabase Realtime でリアルタイム同期（複数タブ・複数ユーザー間）
- チャート描画は型安全な Recharts を使用
- E2E テスト（Playwright）で主要フローをカバー
- Supabase の型自動生成（`supabase gen types typescript`）を活用

---

## 技術選定

| 技術 | バージョン | 選定理由 |
|------|-----------|----------|
| Next.js App Router | 14 | App2 で習得済みのため短期間で実装に集中できる |
| TypeScript | 5（strict） | 全3アプリ共通の strict 設定。型安全を一貫して維持する |
| Supabase Realtime | - | WebSocket をゼロ設定で使える。型付きクライアントを自動生成できる |
| Recharts | 2 | TypeScript 型定義が完全。React との統合が自然で学習コストが低い |
| Playwright | 1 | E2E テストを CI と統合しやすい。Unit テストと組み合わせてテスト戦略を完結させる |
| date-fns | 3 | Tree-shaking に対応した型安全な日付操作ライブラリ。moment.js より軽量 |
| Tailwind CSS | 3 | App1・App2 から継続。統一した UI 実装 |

---

## TypeScript で習得する概念

| 概念 | 活用箇所 |
|------|---------|
| Mapped Types | カテゴリ → 色マッピング（`Record<Category, Color>`） |
| Template Literal Types | API エンドポイントの型定義（`/api/${string}`） |
| `satisfies` 演算子の実践活用 | カテゴリ定数の型チェック（値の型を保持しながら検証） |
| Type Predicates（型ガード関数） | Supabase レスポンスの型絞り込み（`isTransaction(data): data is Transaction`） |
| Declaration Merging | Supabase 自動生成型の拡張 |

---

## 日次タスク

| Day | テーマ | 成果物 |
|-----|--------|--------|
| 22 | 環境構築・Supabase スキーマ設計・型自動生成 | Supabase 型付きクライアント完成 |
| 23 | 収支 CRUD・カテゴリ管理機能 | 基本的な収支記録が動作 |
| 24 | Recharts で月別棒グラフ・カテゴリ円グラフ実装 | ダッシュボード表示完成 |
| 25 | 予算設定・超過アラート機能 | 通知 UI・バジェット管理完成 |
| 26 | Supabase Realtime でリアルタイム同期実装 | 複数タブで即時反映を確認 |
| 27 | CSV エクスポート・月次レポート生成 | データエクスポート完成 |
| 28 | Playwright で E2E シナリオテスト | 主要フロー（記録・グラフ表示・エクスポート）のテスト完成 |
| 29 | Vercel 本番デプロイ・パフォーマンス調整 | 本番 URL 取得 |
| 30 | 全3アプリの README 最終版・GitHub 公開 | 全アプリ完成・公開完了 |

---

## ディレクトリ構成（予定）

```
app3-household-budget/
├── app/
│   ├── dashboard/
│   │   ├── page.tsx        # グラフ・サマリー
│   │   └── layout.tsx
│   ├── transactions/
│   │   ├── page.tsx        # 収支一覧
│   │   └── new/
│   ├── budgets/
│   │   └── page.tsx        # 予算管理
│   ├── reports/
│   │   └── page.tsx        # 月次レポート
│   └── layout.tsx
├── components/
│   ├── charts/             # Recharts ラッパーコンポーネント
│   ├── transaction/
│   ├── budget/
│   └── ui/
├── lib/
│   ├── supabase/
│   │   ├── client.ts       # ブラウザ用クライアント
│   │   └── server.ts       # サーバー用クライアント
│   ├── realtime/           # Supabase Realtime フック
│   └── export/             # CSV エクスポートユーティリティ
├── types/
│   ├── supabase.ts         # 自動生成型（supabase gen types）
│   └── index.ts            # 追加の型定義
├── e2e/                    # Playwright テスト
├── next.config.ts
├── tsconfig.json
└── README.md
```

---

## DB スキーマ設計（Supabase）

```sql
-- カテゴリマスタ
create table categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  type text not null check (type in ('income', 'expense')),
  color text not null,
  icon text,
  user_id uuid references auth.users(id) on delete cascade
);

-- 収支トランザクション
create table transactions (
  id uuid default gen_random_uuid() primary key,
  amount integer not null,
  type text not null check (type in ('income', 'expense')),
  memo text,
  date date not null,
  category_id uuid references categories(id),
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

-- 予算
create table budgets (
  id uuid default gen_random_uuid() primary key,
  category_id uuid references categories(id),
  amount integer not null,
  month text not null,  -- "2024-01" 形式
  user_id uuid references auth.users(id) on delete cascade
);
```

---

## リアルタイム同期の仕組み

```typescript
// Supabase Realtime でトランザクションをリアルタイム購読
const channel = supabase
  .channel('transactions')
  .on<Transaction>(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'transactions' },
    (payload) => {
      // 型安全に差分更新
      if (isTransaction(payload.new)) {
        dispatch({ type: 'UPSERT', payload: payload.new });
      }
    }
  )
  .subscribe();
```

---

## 設計のポイント・振り返り

1. **リアルタイム設計の意思決定**: WebSocket をフルスクラッチで実装せず Supabase Realtime を選んだ理由（開発速度・型安全性・インフラ管理コスト削減）
2. **高度な TypeScript パターンの活用**: Mapped Types・Type Predicates・`satisfies` 演算子を実際のコードで活用
3. **テスト戦略の全体像**: Unit（Vitest）→ Integration → E2E（Playwright）の3層構造を App1〜App3 を通じて実践
4. **次に追加したい機能**: 家族間の権限管理（RLS の活用）・AI による支出分析（OpenAI API 連携）

---

## 3アプリ共通：技術比較

| 観点 | App1 Kanban | App2 Blog | App3 家計簿 |
|------|-------------|-----------|-------------|
| 主な TypeScript スキル | 基礎型・Generics・Utility Types | Prisma 型・Zod 推論・条件型 | Mapped Types・Type Predicates・satisfies |
| アーキテクチャ | フロントエンドのみ | フルスタック（RSC + Server Actions） | フルスタック + リアルタイム |
| テスト | Vitest（Unit） | - | Playwright（E2E） |
| インフラ | Vercel（静的） | Vercel + Supabase（DB） | Vercel + Supabase（DB + Realtime） |
