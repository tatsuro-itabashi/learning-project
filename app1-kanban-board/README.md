# App 1: Kanban タスク管理アプリ

## 概要

PHP/Laravel + Vue.js の知識を持つエンジニアが「TypeScript × React のコンポーネント設計」を習得したことを示すアプリケーション。
バックエンドなし・localStorage 永続化のフロントエンド完結型で、React と TypeScript の基礎を徹底的に習得する。

## 開発期間

**Day 1〜9**（全9日）

---

## 要件定義

### 機能要件

- ボード / カラム / カードの3層構造（Trello ライクなカンバン）
- カードのドラッグ&ドロップ（カラム間移動）
- カードの CRUD（作成・編集・削除・アーカイブ）
- ラベル・優先度・期限日の設定
- localStorage によるデータ永続化

### 非機能要件

- TypeScript strict mode を有効化（`"strict": true`）
- コンポーネント単位のテスト（Vitest）
- レスポンシブ対応（モバイル〜デスクトップ）

---

## 技術選定

| 技術 | バージョン | 選定理由 | 面接でのアピールポイント |
|------|-----------|----------|------------------------|
| React | 18 | 最も求人数が多い UI ライブラリ。Vue.js との比較で差別化できる | 「Vue.js と React のメンタルモデルの違いを語れる」 |
| Vite | 5 | 高速な開発サーバー。CRA より設定が少なく学習に集中できる | 「モダンなビルドツールへの理解」 |
| TypeScript | 5（strict） | 甘い設定では意味がない。Portfolio は厳格な型設定で実装 | 「any を使わない設計を徹底した」 |
| Zustand | 4 | Redux より軽量で TypeScript 親和性が高い。Vue の Pinia に近い感覚 | 「状態管理ライブラリの選定基準を語れる」 |
| dnd-kit | 6 | 型定義が完全で学習コストが低い。アクセシビリティ対応済み | 「型安全なドラッグ&ドロップの実装経験」 |
| Tailwind CSS | 3 | クラス名を暗記せず UI に集中できる。コンポーネント設計に注力可能 | 「ユーティリティファーストの CSS 設計を理解している」 |
| Vitest | 1 | Vite と統合されており設定不要。Jest 互換の API | 「テスト文化への理解・実践」 |

---

## TypeScript で習得する概念

| 概念 | 活用箇所 |
|------|---------|
| `interface` vs `type` の使い分け | Board, Column, Card のデータ型定義 |
| Union 型・Discriminated Union | カードのステータス管理（`"todo" \| "doing" \| "done"`） |
| Generics（`useState<Card[]>` など） | 汎用コンポーネント・フック |
| Utility Types（`Partial<>`, `Pick<>`, `Omit<>`） | フォーム入力型・更新用型 |
| `as const` と `satisfies` 演算子 | 定数定義（優先度・ラベル色） |

---

## 日次タスク

| Day | テーマ | 成果物 |
|-----|--------|--------|
| 1 | 環境構築・TypeScript 設定・ディレクトリ設計 | Vite + React + TS の動作確認 |
| 2 | データ型設計（Board, Column, Card の interface 定義） | `src/types/` ディレクトリ完成 |
| 3 | Zustand で状態管理層を実装 | store 完成・型安全な状態操作 |
| 4 | Column コンポーネントと Card コンポーネントの UI 実装 | 静的な Kanban ボード表示 |
| 5 | カード CRUD 機能の実装（モーダル） | 作成・編集・削除が動作 |
| 6 | dnd-kit でドラッグ&ドロップ実装 | カラム間移動が動作 |
| 7 | ラベル・優先度・期限日の機能追加 | カードの詳細機能完成 |
| 8 | Vitest でコンポーネントテスト・ストアテスト | テスト10本以上 |
| 9 | レスポンシブ対応・README 最終版・GitHub 公開 | ポートフォリオ掲載完了 |

---

## ディレクトリ構成（予定）

```
app1-kanban-board/
├── src/
│   ├── types/          # 型定義（Board, Column, Card など）
│   ├── store/          # Zustand ストア
│   ├── components/     # React コンポーネント
│   │   ├── Board/
│   │   ├── Column/
│   │   ├── Card/
│   │   └── ui/         # 汎用UIパーツ
│   ├── hooks/          # カスタムフック
│   ├── utils/          # ユーティリティ関数
│   └── App.tsx
├── tests/              # Vitest テスト
├── index.html
├── vite.config.ts
├── tsconfig.json
└── README.md
```

---

## 面接でのアピール戦略

1. **なぜ React を選んだか**: Vue.js との比較（コンポーネントモデル・状態管理・エコシステム）を自分の言葉で説明できる
2. **TypeScript strict で工夫した箇所**: Discriminated Union でカードのステータス管理を型安全にした設計を提示する
3. **詰まった問題と解決策**: dnd-kit の型定義の理解に時間がかかった → 公式ドキュメントと型定義ファイルを直接読んで解決
4. **次に追加したい機能**: サーバー同期（App2 の技術を流用）・チームメンバー招待機能
