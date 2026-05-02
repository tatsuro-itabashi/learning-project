// ===========================
// 定数定義
// ===========================

// カードの優先度
export const PRIORITY = {
    LOW : 'low',
    MEDIUM : 'medium',
    HIGH : 'high',
} as const satisfies Record<string, string>

// カードのステータス（カラムの並び順と対応）
export const CARD_STATUS = {
    TODO: 'todo',
    IN_PROGRESS : 'in_progress',
    DONE: 'done',
} as const satisfies Record<string, string>

// ラベルの定義（色情報も一緒に持つ）
export const LABEL_CONFIG = {
    bug: { label: 'Bug', color: 'bg-red-100 text-red-700' },
    feature: { label: 'Feature', color: 'bg-blue-100 text-blue-700' },
    docs: { label: 'Docs', color: 'bg-green-100 text-green-700' },
    refactor: { label: 'Refactor', color: 'bg-yellow-100 text-yellow-700' },
} as const satisfies Record<string, { label: string; color: string }>

// ポイント
// as const だけだと値から型を推論した際に string に広がってしまいます。
// satisfies を追加することで「Record<string, string> の形を満たしているか検証しつつ、値の型（'low' など）を保持」できます。



// ===========================
// Union 型（定数から自動導出）
// ===========================

// typeof + keyof で定数オブジェクトの値を Union 型に変換
export type Priority = (typeof PRIORITY)[keyof typeof PRIORITY]
// → 'low' | 'medium' | 'high'

export type CardStatus = (typeof CARD_STATUS)[keyof typeof CARD_STATUS]
// → 'todo' | 'in_progress' | 'done'

export type LabelKey = keyof typeof LABEL_CONFIG
// → 'bug' | 'feature' | 'docs' | 'refactor'

// ポイント
// 文字列リテラルを直接 type Priority = 'low' | 'medium' | 'high' と書いても動きますが、定数と型が二か所に分散してメンテしづらくなります。
// 定数から型を導出することで「定数を変えれば型も自動で変わる」設計になります。



// ===========================
// エンティティ型
// ===========================

export interface Card {
    id: string
    title: string
    description: string
    priority: Priority
    labels: LabelKey[]
    dueDate: string | null  // ISO 8601形式 "2024-12-31" or null
    status: CardStatus
    createdAt: string       // ISO 8601形式
    updatedAt: string
}

export interface Column {
    id: string
    title: string
    status: CardStatus // このカラムが受け持つステータス
    cardIds: string[] // Card の id 一覧（順序を管理）
}

export interface Board {
    id: string
    title: string
    columns: Column[]
    cards: Record<string, Card> // id → Card のマップ（高速アクセス用）
    createdAt: string
    updatedAt: string
}

// ポイント
// cards を配列でなく Record<string, Card> にするのは設計上の工夫です。
// カードを ID で検索するとき、配列なら O(n)・Recordなら O(1) になります。
// またカラムは cardIds で順序だけを管理し、カードのデータ本体は Board が一元管理する「正規化」された設計です。



// ===========================
// 操作用の型（Utility Types 活用）
// ===========================

// カード作成時：id・createdAt・updatedAt はシステムが付与するので不要
export type CreateCardInput = Omit<Card, 'id' | 'createdAt' | 'updatedAt'>

// カード更新時：id は必須・その他は任意
export type UpdateCardInput = Pick<Card, 'id'> & Partial<Omit<Card, 'id'>>

// カラム作成時
export type CreateColumnInput = Omit<Column, 'id' | 'cardIds'>

// ボード作成時
export type CreateBoardInput = Pick<Board, 'title'>

// ポイント
// Omit<Card, 'id' | 'createdAt' | 'updatedAt'> は「Card から3フィールドを取り除いた型」です。
// Card の定義を変えると CreateCardInput も自動で追従します。
// 型定義の重複がなくなり、メンテナンスが楽になります。



// ===========================
// 型テスト（確認後に削除する）
// ===========================

// 正しい Card オブジェクト
// const validCard: Card = {
//     id: 'card-1',
//     title: 'TypeScript を学ぶ',
//     description: '型システムの基礎から応用まで',
//     priority: PRIORITY.HIGH,        // 'high'
//     labels: ['feature'],
//     dueDate: '2024-12-31',
//     status: CARD_STATUS.TODO,       // 'todo'
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
// }

// ❌ 存在しない priority を入れると型エラーになることを確認
// const invalidCard: Card = {
//   ...validCard,
//   priority: 'urgent',  // ← TS エラー: Type '"urgent"' is not assignable to type 'Priority'
// }

// CreateCardInput は id・日付フィールドを持たない
// const createInput: CreateCardInput = {
//     title: '新しいカード',
//     description: '',
//     priority: PRIORITY.LOW,
//     labels: [],
//     dueDate: null,
//     status: CARD_STATUS.TODO,
// }

// console.log(validCard, createInput)



// 優先度ごとの表示設定
export const PRIORITY_CONFIG = {
    high:   { label: '高',  color: 'bg-red-100 text-red-700' },
    medium: { label: '中',  color: 'bg-yellow-100 text-yellow-700' },
    low:    { label: '低',  color: 'bg-gray-100 text-gray-600' },
} as const satisfies Record<Priority, { label: string; color: string }>



// カードフォームの入力値の型
export interface CardFormValues {
    title: string
    description: string
    priority: Priority
    labels: LabelKey[]
    dueDate: string | null // input[type="date"] は string で扱う
}

export type CardFormErrors = Partial<Record<keyof CardFormValues, string>>



// ドラッグアイテムの識別データ
// dnd-kit の data に乗せるカスタムデータ
export interface DraggableCardData {
    type: 'card'
    cardId: string
    columnId: string
}

// ドロップ先カラムの識別データ
export interface DroppableColumnData {
    type: 'column'
    columnId: string
}