# 転職ポートフォリオ 学習ロードマップ（12週計画）

## 概要

| 項目 | 内容 |
|------|------|
| 目標 | 自社開発企業へ転職（9〜12ヶ月以内） |
| 年収目標 | 450万円 → 600万円 |
| 計画期間 | 3ヶ月（12週） |
| 学習時間 | 平日 1〜2h/日、休日 3〜4h/日（週 約14〜15h） |
| 成果物 | ポートフォリオ3本 |
| 最終更新 | 2026-04-28 |

---

## ロードマップ全体図

```
Month 1 (Week 1-4)     Month 2 (Week 5-8)     Month 3 (Week 9-12)
├── Phase 1 ───────────┤                        
│   TypeScript         ├── Phase 2 ─────────────┤
│                      │   React / Next.js       ├── Phase 3（並行）
│                      │                         │   AI / LLM連携
▼                      ▼                         ▼
type-safe-task-api     vue-to-react-             ai-knowledge-
(Express+TS+Zod+Prisma) bookmark-app             assistant
                       (Next.js 15+Supabase)     (Next.js 16+AI SDK v6+RAG)
```

---

## 成果物（ポートフォリオ）定義

### 成果物 1: `type-safe-task-api`
**Phase 1 | Month 1**

| 項目 | 内容 |
|------|------|
| 技術スタック | Node.js + TypeScript + Express + Prisma + Zod + PostgreSQL |
| デプロイ先 | Railway または Render（無料枠） |
| リポジトリ | `github.com/[user]/type-safe-task-api` |

**概要:** タスク管理 REST API。LaravelのEloquentとの設計比較をREADMEに記載し、
PHPからTypeScriptへの型システム的移行を言語化して語れる形にする。

**技術選定の理由:**
> LaravelのPHPは動的型付けであり、6年間の経験で「型がないゆえのバグ」を肌で感じてきた。
> TypeScriptはその課題を解決する静的型システムを持ち、現代のフロントエンド・バックエンド両方で必須。
> Expressを選ぶ理由はLaravelのMVCに慣れた開発者がNode.jsエコシステムに入る最短ルートであるため。
> ZodはPHPのバリデーションルールをより型安全に表現でき、Prismaは
> EloquentのDX（スキーマ定義 → マイグレーション → 型生成）に最も近いORM。

**差別化ポイント:**
- Laravel/Eloquent との設計対比ドキュメント（README内に専用セクション）
- Zod によるランタイムバリデーション + TypeScript の静的型の二重防衛
- Prisma マイグレーション管理（Laravel Migrations との比較コメント付き）
- GitHub Actions による CI（lint + test）

**エンドポイント設計:**
```
GET    /tasks          タスク一覧（フィルタ・ページネーション付き）
POST   /tasks          タスク作成（Zodバリデーション）
GET    /tasks/:id      タスク詳細
PATCH  /tasks/:id      部分更新
DELETE /tasks/:id      削除
GET    /tasks/stats    集計API（完了率・優先度別件数）
```

---

### 成果物 2: `vue-to-react-bookmark-app`
**Phase 2 | Month 2〜3**

| 項目 | 内容 |
|------|------|
| 技術スタック | Next.js 15 App Router + TypeScript + Tailwind CSS + Supabase |
| デプロイ先 | Vercel（無料枠） |
| リポジトリ | `github.com/[user]/vue-to-react-bookmark-app` |

**概要:** ブックマーク管理アプリ。Vue.js版（簡易実装）→ React/Next.js版（フル実装）の
移植過程をドキュメント化し、「Vue.jsエンジニアがReactを習得する過程」として学習証明とする。

**技術選定の理由:**
> Vue Composition API の経験があるため、React Hooks との対比学習で習得速度が上がる。
> Next.js App Router は最新の React Server Components を活用した業界標準であり、
> 自社開発企業での採用率が高い。Supabase は Firebase に近い開発体験で Auth・DB・Storage を
> 一括管理でき、Laravel + AWS のフルスタック経験と対比しやすく語りやすい。

**差別化ポイント:**
- Vue Composition API ↔ React Hooks の対比コメント（コード内に明示）
- Nuxt.js 的なルーティングと Next.js App Router の比較 README
- Supabase RLS + Auth（AWS Cognito 比較も記載）
- Zenn/Qiita 対比記事を公開し学習プロセスを可視化

**機能一覧:**
- ブックマーク登録・タグ付け・検索
- ユーザー認証（Supabase Auth）
- タグ別フィルタリング
- OGP 自動取得（Route Handler でスクレイピング）

---

### 成果物 3: `ai-knowledge-assistant`
**Phase 3 | Month 3（並行）**

| 項目 | 内容 |
|------|------|
| 技術スタック | Next.js 16 + AI SDK v6 + pgvector（Supabase）+ Tailwind CSS + shadcn/ui |
| デプロイ先 | Vercel |
| リポジトリ | `github.com/[user]/ai-knowledge-assistant` |

**概要:** ドキュメント（PDF/テキスト）をアップロードしてAIに質問できる RAGアプリ。
AI SDK v6 のストリーミング API と Vercel AI Gateway を活用し、モデル非依存の設計にする。

**技術選定の理由:**
> AI連携スキルは現在の Webエンジニア市場で最大の差別化要因。
> Vercel AI SDK v6 は最新のストリーミング対応 API（`streamText`・`toUIMessageStreamResponse`）を持ち、
> Vercel AI Gateway 経由でプロバイダー非依存（OpenAI/Anthropic/Gemini 切替可能）にできる。
> pgvector は Supabase で利用可能でインフラ追加不要。Next.js 16 の App Router との親和性が高く、
> 現時点で最も実戦的な LLM アプリの技術スタック。

**差別化ポイント:**
- AI SDK v6 最新パターン（`toUIMessageStreamResponse`・`useChat` with `@ai-sdk/react`）
- RAG アーキテクチャ（pgvector + embedding + retrieval）の全工程を実装
- Vercel AI Gateway によるプロバイダー抽象化
- 引用元ドキュメント・チャンク表示で回答根拠を可視化
- アーキテクチャ図付き README（設計力のアピール）

---

## 12週間 週次タスク

---

### Phase 1: TypeScript（Week 1〜4）

---

#### Week 1: TypeScript基礎 + 開発環境構築

**目標:** TS型システムの基礎を習得し、`type-safe-task-api` の開発環境を整える

**平日タスク（各1〜2h）:**
- [ ] Day 1: TypeScript公式Handbook「基本型・インターフェース・型エイリアス・`type` vs `interface`」
- [ ] Day 2: ジェネリクス（`Array<T>`・`Promise<T>`）+ ユーティリティ型（`Partial`・`Pick`・`Omit`・`Required`）
- [ ] Day 3: 型推論・型ガード（`typeof`・`instanceof`・カスタムガード）・`unknown` vs `any`
- [ ] Day 4: Node.js + TypeScript プロジェクト初期化（`tsconfig.json` の主要オプション理解）
- [ ] Day 5: Express + TypeScript セットアップ（`@types/express`）、Hello World API 動作確認

**休日タスク（各3〜4h）:**
- [ ] Sat: PHP と TS の型システム対比メモ作成（自分の言葉で説明できるレベルに）
- [ ] Sun: `type-safe-task-api` リポジトリ作成、フォルダ構成設計（`src/routes/`・`src/controllers/`・`src/services/`・`src/middlewares/`）

**週末チェックポイント:**
- [ ] TypeScript の基本型・ジェネリクスが書けるか
- [ ] `tsconfig.json` の主要オプション（`strict`・`paths`・`target`）を説明できるか
- [ ] Express + TS で Hello World API が動くか

---

#### Week 2: Prisma + PostgreSQL + 要件定義・設計

**目標:** Prisma でスキーマ設計・マイグレーションを理解し、API の要件定義・設計を完了する

**平日タスク（各1〜2h）:**
- [ ] Day 1: Prisma 公式ドキュメント（スキーマ定義・リレーション・`@relation`）
- [ ] Day 2: PostgreSQL + Docker Compose セットアップ、`prisma init` 実行
- [ ] Day 3: `Task` モデル・スキーマ設計（Laravel の Migration 構文と対比しながらコメント記述）
- [ ] Day 4: `prisma migrate dev` 実行・Prisma Client の型を確認（型が自動生成される感動を体感）
- [ ] Day 5: REST API 設計（OpenAPI 形式で仕様書ドラフト作成、`docs/api-spec.yaml`）

**休日タスク（各3〜4h）:**
- [ ] Sat: Eloquent vs Prisma の設計比較ドキュメント作成（README 草稿 `docs/eloquent-vs-prisma.md`）
- [ ] Sun: Express ルーター・コントローラー・サービス層のディレクトリ構成実装開始

**週末チェックポイント:**
- [ ] Prisma で CRUD が動くか（`prisma studio` で確認）
- [ ] スキーマ変更 → マイグレーション → 型反映の流れが理解できるか
- [ ] API 仕様書のドラフトが存在するか

---

#### Week 3: Zod + API 全エンドポイント実装

**目標:** Zod バリデーションと全エンドポイントの実装完了

**平日タスク（各1〜2h）:**
- [ ] Day 1: Zod の基本（`z.object`・`z.string`・`z.enum`・`.parse`・`.safeParse`・`.infer`）
- [ ] Day 2: リクエストバリデーションミドルウェア実装（Zod エラー → HTTP 400 変換）
- [ ] Day 3: タスク一覧 API（クエリパラメータによるフィルタ・ページネーション）実装
- [ ] Day 4: タスク作成・更新・削除 API 実装
- [ ] Day 5: 統計 API 実装（`GET /tasks/stats`：完了率・優先度別件数）

**休日タスク（各3〜4h）:**
- [ ] Sat: グローバルエラーハンドラー実装・カスタムエラークラス設計（`AppError` クラス）
- [ ] Sun: API の結合テスト（Thunder Client / Bruno）・バグ修正・リファクタリング

**週末チェックポイント:**
- [ ] 全 6 エンドポイントが正常動作するか
- [ ] Zod エラーが HTTP 400 で適切に返るか
- [ ] 型エラーが 0 件か（`tsc --noEmit` が通るか）

---

#### Week 4: テスト + デプロイ + ドキュメント完成

**目標:** `type-safe-task-api` をポートフォリオとして公開できる状態にする

**平日タスク（各1〜2h）:**
- [ ] Day 1: Vitest でユニットテスト（サービス層：バリデーション・ビジネスロジック）
- [ ] Day 2: Supertest で E2E テスト（全エンドポイントのハッピーパス + エラーケース）
- [ ] Day 3: Railway または Render へのデプロイ設定・環境変数管理
- [ ] Day 4: `.env.example` 整備・`Dockerfile` 作成（任意）・`.gitignore` 確認
- [ ] Day 5: README 完成（技術選定理由・Eloquent 比較・API 仕様・デモ URL・セットアップ手順）

**休日タスク（各3〜4h）:**
- [ ] Sat: GitHub Actions で CI（lint + type-check + test）設定
- [ ] Sun: ポートフォリオサイト用の「このプロジェクトで何を学んだか」ライティング（200字以上）

**週末チェックポイント:**
- [ ] デプロイ URL が存在し API が動作するか
- [ ] README を見て他者がセットアップできるか
- [ ] CI が緑になっているか（Actions のバッジを README に貼る）

**🎉 Phase 1 マイルストーン: `type-safe-task-api` デプロイ・公開完了**

---

### Phase 2: React / Next.js（Week 5〜10）

---

#### Week 5: React 基礎 + Vue ↔ React 概念マッピング

**目標:** Vue Composition API → React Hooks の概念マッピングを完成させる

**平日タスク（各1〜2h）:**
- [ ] Day 1: `useState` / `useEffect`（`ref()` / `onMounted()` / `watch()` との対比）
- [ ] Day 2: `useContext` + `useReducer`（`provide/inject` + Pinia/Vuex との対比）
- [ ] Day 3: カスタム Hooks 作成（Vue の Composables との対比・`use` プレフィックス規約）
- [ ] Day 4: `React.memo`・`useCallback`・`useMemo`（Vue `computed` との対比）
- [ ] Day 5: フォーム管理（React Hook Form ≈ Vue `v-model`、Zod との連携）

**休日タスク（各3〜4h）:**
- [ ] Sat: Vue ↔ React 対比チートシート作成（GitHub に公開する Markdown として整形）
- [ ] Sun: Next.js 公式チュートリアル完走（App Router 版）

**週末チェックポイント:**
- [ ] Vue Composition API のコードを React に書き直せるか（小さなカウンターアプリで確認）
- [ ] Next.js の `app/` ディレクトリ構成・ファイル規約（`page.tsx`・`layout.tsx`・`loading.tsx`）が理解できるか

---

#### Week 6: Next.js App Router 深掘り + ブックマークアプリ 要件定義・設計

**目標:** App Router の主要機能を理解し、成果物の要件定義・設計を完了する

**平日タスク（各1〜2h）:**
- [ ] Day 1: Server Components vs Client Components（`'use client'` の境界設計・Props のシリアライズ制約）
- [ ] Day 2: Route Handlers（`app/api/` ディレクトリ・`NextRequest`/`NextResponse`）
- [ ] Day 3: Next.js 15 の `async params`・`async searchParams`（非同期 API への変更点）
- [ ] Day 4: Supabase セットアップ（プロジェクト作成・Auth・DB テーブル・RLS ポリシー設定）
- [ ] Day 5: ブックマークアプリ 要件定義書作成（ユーザーストーリー・画面一覧・機能優先度）

**休日タスク（各3〜4h）:**
- [ ] Sat: DB スキーマ設計（`bookmarks`・`tags`・`bookmark_tags`・`users` テーブル、ER 図作成）
- [ ] Sun: コンポーネント設計（ディレクトリ構成・Props 型定義・Server/Client 分割方針）

**週末チェックポイント:**
- [ ] 要件定義書・ER 図・コンポーネント設計が揃っているか
- [ ] Supabase プロジェクトが作成され RLS が設定されているか
- [ ] Next.js プロジェクトが初期化されローカルで動くか

---

#### Week 7: 認証 + 基本機能実装

**目標:** ユーザー認証とブックマーク CRUD の実装完了

**平日タスク（各1〜2h）:**
- [ ] Day 1: Supabase Auth（メール認証）実装 + Next.js Middleware でルート保護
- [ ] Day 2: ブックマーク一覧画面（Server Components + Suspense + `loading.tsx`）
- [ ] Day 3: ブックマーク登録フォーム（React Hook Form + Zod + Server Actions）
- [ ] Day 4: OGP 自動取得（Route Handler でメタデータスクレイピング）
- [ ] Day 5: タグ管理（多対多リレーション・Supabase クエリ）

**休日タスク（各3〜4h）:**
- [ ] Sat: ブックマーク検索機能（Supabase の `ilike` クエリ）
- [ ] Sun: Tailwind CSS で UI 整備（レスポンシブ対応・ダークモード任意）

**週末チェックポイント:**
- [ ] ログイン・ログアウトが動作するか
- [ ] ブックマークの CRUD が動作するか
- [ ] 未ログイン時にログインページへリダイレクトされるか

---

#### Week 8: 仕上げ + 最適化 + Vercel デプロイ

**目標:** `vue-to-react-bookmark-app` を Vercel にデプロイし、記事を公開する

**平日タスク（各1〜2h）:**
- [ ] Day 1: `error.tsx`・`not-found.tsx` 実装、エラーバウンダリ整備
- [ ] Day 2: Vercel へのデプロイ・環境変数（Supabase URL・Anon Key）設定
- [ ] Day 3: Lighthouse スコア確認・Core Web Vitals 改善（`next/image` 使用確認）
- [ ] Day 4: Playwright で E2E テスト（認証フロー・ブックマーク追加フロー）
- [ ] Day 5: README 完成（Vue→React 移植過程・技術選定理由・デモ URL）

**休日タスク（各3〜4h）:**
- [ ] Sat: 「Vue.js エンジニアが React を学んだ」対比記事を Zenn に投稿
- [ ] Sun: GitHub Actions CI/CD 設定（lint + type-check + test → Vercel 自動デプロイ）

**週末チェックポイント:**
- [ ] Vercel URL が存在し動作するか
- [ ] Zenn 記事が公開されているか
- [ ] CI が緑になっているか

**🎉 Phase 2 マイルストーン: `vue-to-react-bookmark-app` + Zenn 記事 公開完了**

---

### Phase 3: AI / LLM 連携（Week 9〜12）※ Phase 2 後半と並行

---

#### Week 9: AI SDK v6 基礎 + RAG アーキテクチャ設計

**目標:** AI SDK v6 の基本を習得し、RAG システムの設計を完了する

**平日タスク（各1〜2h）:**
- [ ] Day 1: Vercel AI SDK v6 公式ドキュメント精読（`streamText`・`generateText`・`CoreMessage`）
- [ ] Day 2: `useChat`（`@ai-sdk/react`）でチャット UI Hello World（Next.js App Router + Route Handler）
- [ ] Day 3: RAG の概念理解（Embedding・Vector Store・Retrieval・Augmented Generation の流れ）
- [ ] Day 4: Supabase pgvector セットアップ（拡張機能 ON・`embeddings` テーブル作成）
- [ ] Day 5: `ai-knowledge-assistant` 要件定義・画面設計（チャット画面・ドキュメント管理画面）

**休日タスク（各3〜4h）:**
- [ ] Sat: アーキテクチャ図作成（Upload→Chunk→Embed→Store→Query→Retrieve→Generate フロー）
- [ ] Sun: Next.js 16 + AI SDK v6 プロジェクト初期化・ディレクトリ構成設計・shadcn/ui セットアップ

**週末チェックポイント:**
- [ ] RAG の流れを図で説明できるか
- [ ] AI SDK の `streamText` でストリーミング応答が動作するか
- [ ] Supabase pgvector で `cosine_similarity` クエリが動くか

---

#### Week 10: ドキュメント処理 + Embedding パイプライン実装

**目標:** ファイルアップロード → テキスト抽出 → ベクトル化 → 保存のパイプライン完成

**平日タスク（各1〜2h）:**
- [ ] Day 1: ファイルアップロード UI（`<input type="file">`・Route Handler での受け取り）
- [ ] Day 2: PDF/テキスト抽出（`pdf-parse` ライブラリ）
- [ ] Day 3: テキストチャンキング実装（オーバーラップ付き固定長チャンク）
- [ ] Day 4: AI SDK v6 の `embed`（`@ai-sdk/openai` の `text-embedding-3-small`）で Embedding 生成
- [ ] Day 5: Supabase pgvector への保存・類似検索クエリ実装（`<=>` 演算子）

**休日タスク（各3〜4h）:**
- [ ] Sat: Embedding パイプラインの結合テスト・デバッグ（実際の PDF でテスト）
- [ ] Sun: 類似文書検索の精度確認・チャンクサイズ調整（500〜1000 トークンで比較）

**週末チェックポイント:**
- [ ] PDF をアップロードしてベクトル DB に保存できるか
- [ ] 類似検索が期待通りの文書チャンクを返すか

---

#### Week 11: チャット UI + RAG 統合（エンドツーエンド実装）

**目標:** 質問 → 検索 → LLM 回答のエンドツーエンド動作完成

**平日タスク（各1〜2h）:**
- [ ] Day 1: `useChat`（`@ai-sdk/react`）でチャット UI 実装（ストリーミング表示）
- [ ] Day 2: Route Handler で質問受付 → pgvector 類似検索 → コンテキスト組み立て
- [ ] Day 3: `streamText` + `toUIMessageStreamResponse` でストリーミング回答生成
- [ ] Day 4: 引用元ドキュメント表示（どのチャンクから回答したかをツールコールで返す）
- [ ] Day 5: 会話履歴管理（`messages` テーブルへの保存・セッション管理）

**休日タスク（各3〜4h）:**
- [ ] Sat: エラーハンドリング（API エラー・レート制限・タイムアウト）・ローディング UI 整備
- [ ] Sun: UI デザイン仕上げ（shadcn/ui コンポーネント活用・モバイル対応）

**週末チェックポイント:**
- [ ] 質問 → ストリーミング回答が動作するか
- [ ] 引用元チャンクが表示されるか
- [ ] 会話履歴が保持されているか

---

#### Week 12: デプロイ + ドキュメント + ポートフォリオ総仕上げ

**目標:** 全 3 成果物を公開し、転職活動を開始できる状態にする

**平日タスク（各1〜2h）:**
- [ ] Day 1: Vercel へのデプロイ・環境変数（`OPENAI_API_KEY`・Supabase 接続情報）設定
- [ ] Day 2: README 完成（RAG アーキテクチャ図・技術選定理由・デモ動画 GIF・セットアップ手順）
- [ ] Day 3: GitHub プロフィール整備（README プロフィール・Pinned repos に 3 成果物を設定）
- [ ] Day 4: 職務経歴書のスキルセクション更新（TypeScript・React・Next.js・AI SDK・RAG 追記）
- [ ] Day 5: ポートフォリオサイト（GitHub Pages または Vercel）更新・3 成果物を追加

**休日タスク（各3〜4h）:**
- [ ] Sat: 技術記事「Next.js 16 + AI SDK v6 で作る RAG システム入門」Zenn に投稿
- [ ] Sun: 転職エージェント登録（レバテック・Findy・Green 等）・応募企業リサーチ開始

**週末チェックポイント:**
- [ ] 全 3 成果物がデプロイ済みで動作するか
- [ ] GitHub プロフィールが整備されているか
- [ ] 技術記事が 2 本以上公開されているか
- [ ] 転職エージェントに登録済みか

**🎉 Phase 3 マイルストーン: 全ポートフォリオ公開完了・転職活動開始**

---

## マイルストーン一覧

| # | 期限 | マイルストーン | 確認方法 |
|---|------|----------------|---------|
| M1 | Week 4 末 | `type-safe-task-api` デプロイ完了 | デプロイ URL 動作確認 + CI バッジ 緑 |
| M2 | Week 8 末 | `vue-to-react-bookmark-app` デプロイ + Zenn 記事公開 | Vercel URL + 記事 URL |
| M3 | Week 12 末 | `ai-knowledge-assistant` デプロイ完了 + 全成果物整備 | 全 URL 確認 + 職務経歴書更新済み |
| M4 | Month 4〜 | 転職活動本格開始 | 書類通過率で PDCA |

---

## 進捗確認コマンド

```bash
# 未完了タスク一覧を表示（直近 20 件）
grep -n "\- \[ \]" PROGRESS.md | head -20

# 完了タスク数
grep -c "\- \[x\]" PROGRESS.md

# 未完了タスク数
grep -c "\- \[ \]" PROGRESS.md

# 完了率（%）を計算
python3 -c "
import subprocess
done = int(subprocess.check_output('grep -c \"\- \[x\]\" PROGRESS.md', shell=True).strip())
todo = int(subprocess.check_output('grep -c \"\- \[ \]\" PROGRESS.md', shell=True).strip())
total = done + todo
print(f'完了: {done} / {total} ({done/total*100:.1f}%)')
"

# 特定の週の進捗確認（例: Week 3）
grep -A 40 "#### Week 3:" PROGRESS.md | grep -E "\- \[.\]"

# マイルストーン確認
grep -E "^\| M[0-9]" PROGRESS.md

# チェックポイント確認（現在の週）
grep -A 5 "週末チェックポイント" PROGRESS.md | grep "\- \[ \]"
```

---

## 学習リソース

### Phase 1: TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Prisma ドキュメント](https://www.prisma.io/docs)
- [Zod ドキュメント](https://zod.dev)
- [Total TypeScript（Matt Pocock）](https://www.totaltypescript.com)

### Phase 2: React / Next.js
- [React 公式ドキュメント（日本語）](https://ja.react.dev)
- [Next.js 公式ドキュメント](https://nextjs.org/docs)
- [Supabase ドキュメント](https://supabase.com/docs)
- [React Hook Form](https://react-hook-form.com)

### Phase 3: AI / LLM
- [Vercel AI SDK ドキュメント](https://sdk.vercel.ai/docs)
- [Supabase pgvector ガイド](https://supabase.com/docs/guides/database/extensions/pgvector)
- [shadcn/ui](https://ui.shadcn.com)

---

## 運用ルール

1. **タスク完了時:** `- [ ]` を `- [x]` に変更する
2. **週次レビュー:** 毎週日曜夜に翌週のタスクを確認・翌週に持ち越すタスクを明記する
3. **詰まったら 30 分ルール:** 30 分悩んだら AI（Claude 等）に聞く、1 時間悩んだら翌日に持ち越す
4. **記録を残す:** 学んだことはコミットメッセージか README に必ず残す
5. **公開ファースト:** 完璧主義を捨て、動くものを早く公開する
6. **比較記録:** Vue.js との対比メモを随時更新し、面接で語れるエピソードを蓄積する
