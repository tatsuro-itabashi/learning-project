# Kanban タスク管理アプリ

React + TypeScript で構築した Kanban ボードアプリケーション。
ドラッグ&ドロップによるカード移動・CRUD・フィルタリングに対応。

## デモ

> ※ デプロイ後に URL を追記

## 機能

- カンバン形式でのタスク管理（ToDo / In Progress / Done）
- カードのドラッグ&ドロップ移動（カラム間・カラム内ソート）
- カードの作成・編集・削除（モーダル）
- ラベル・優先度・期限日の設定
- ラベル・優先度によるフィルタリング
- 優先度・期限日によるソート
- localStorage によるデータ永続化
- レスポンシブ対応（モバイル・タブレット・デスクトップ）

## 技術スタック

| 技術 | バージョン | 選定理由 |
|------|-----------|----------|
| React | 18 | 最も採用実績の多い UI ライブラリ |
| Vite | 5 | HMR が高速で開発サイクルが速い |
| TypeScript | 5（strict） | strict mode で型の抜け漏れを防ぐ |
| Zustand | 4 | Redux より設定が少なく TypeScript 親和性が高い |
| dnd-kit | 6 | 型定義が完全でアクセシビリティ対応済み |
| Tailwind CSS | 3 | クラス名を暗記せず UI 実装に集中できる |
| Vitest | 1 | Vite と統合されており追加設定不要 |

## TypeScript の工夫

### Discriminated Union でモーダルの状態を型安全に管理

```ts
type ModalState =
  | { mode: 'closed' }
  | { mode: 'create'; columnId: string }
  | { mode: 'edit'; card: Card }
```

`mode === 'edit'` のときだけ `card` プロパティにアクセスできる。
存在しない状態のプロパティを参照しようとするとコンパイルエラーになる。

### 定数から Union 型を自動導出

```ts
export const PRIORITY = { LOW: 'low', MEDIUM: 'medium', HIGH: 'high' } as const
export type Priority = (typeof PRIORITY)[keyof typeof PRIORITY]
// → 'low' | 'medium' | 'high'
```

定数と型を一か所で管理し、変更時の二重メンテを防ぐ。

### Type Predicate で unknown 型を絞り込む

```ts
function isDraggableCardData(data: unknown): data is DraggableCardData {
  return typeof data === 'object' && data !== null &&
    'type' in data && (data as DraggableCardData).type === 'card'
}
```

dnd-kit の `data.current` は `unknown` 型。型ガード関数で安全に絞り込む。

### Generics を使った汎用ソート関数

```ts
function sortBy<T>(
  items: T[],
  getValue: (item: T) => number | string | null,
  order: 'asc' | 'desc',
): T[]
```

`Card[]` に限らず任意の型の配列に使えるソート関数。

## 設計のポイント

### ストアの正規化

カードのデータを `Record<string, Card>` で持ち、カラムは `cardIds: string[]` で順序のみ管理する正規化された設計。ID での検索が O(1) になる。

### ロジックの分離

フィルタ・ソートのロジックを `utils/cardFilter.ts` の純粋関数に切り出し。コンポーネントから独立しているためユニットテストが書きやすい。

### カスタムフックによる関心の分離

- `useCardModal`：モーダルの開閉状態
- `useCardFilter`：フィルタ・ソート状態

UI コンポーネントはデータの「表示」に専念し、状態管理はフックに委譲。

## セットアップ

```bash
npm install
npm run dev
```

## テスト

```bash
npm run test       # ウォッチモード
npm run test:run   # 1回実行
```

## ディレクトリ構成

```
src/
├── types/          # 型定義・定数
├── store/          # Zustand ストア
├── hooks/          # カスタムフック
├── utils/          # 純粋関数（フィルタ・ソート）
└── components/
    ├── ui/         # 汎用コンポーネント
    ├── Board/      # ボード・フィルタ
    ├── Column/     # カラム
    └── Card/       # カード・モーダル
```