import type { Board, Card, CreateCardInput, UpdateCardInput, CreateColumnInput } from '@/types'

// ===========================
// ストアの State 型
// ===========================
interface BoardState {
    board: Board
}

// ===========================
// ストアの Action 型
// ===========================
interface BoardActions {
    // カード操作
    addCard: (columnId: string, input: CreateCardInput) => void
    updateCard: (input: UpdateCardInput) => void
    deleteCard: (cardId: string) => void
    moveCard: (cardId: string, fromColumnId: string, toColumnId: string, toIndex: number) => void

    // カラム操作
    addColumn: (input: CreateColumnInput) => void
    deleteColumn: (columnId: string) => void

    // ボード操作
    updateBoardTitle: (title: string) => void
}

// State と Action を合成したストア全体の型
export type BoardStore = BoardState & BoardActions




import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { initialBoard } from './initialData'

// ID 生成ユーティリティ（crypto.randomUUID を使用）
const generateId = () => crypto.randomUUID()

export const useBoardStore = create<BoardStore>()(
    persist(
        (set) => ({
        // ───────────────
        // 初期 State
        // ───────────────
        board: initialBoard,

        // ───────────────
        // カード操作
        // ───────────────
        addCard: (columnId, input) =>
            set((state) => {
                const newCard: Card = {
                    ...input,
                    id: generateId(),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                }

                return {
                    board: {
                        ...state.board,
                        cards: {
                            ...state.board.cards,
                            [newCard.id]: newCard,
                        },
                        columns: state.board.columns.map((col) =>
                            col.id === columnId
                            ? { ...col, cardIds: [...col.cardIds, newCard.id] }
                            : col,
                        ),
                        updatedAt: new Date().toISOString(),
                    },
                }
            }),

        updateCard: (input) =>
            set((state) => {
                const existing = state.board.cards[input.id]
                if (!existing) return state

                return {
                    board: {
                        ...state.board,
                        cards: {
                            ...state.board.cards,
                            [input.id]: {
                            ...existing,
                            ...input,
                            updatedAt: new Date().toISOString(),
                            },
                        },
                        updatedAt: new Date().toISOString(),
                    },
                }
            }),

        deleteCard: (cardId) =>
            set((state) => {
                // cards オブジェクトから対象を除外
                const remainingCards = Object.fromEntries(
                    Object.entries(state.board.cards).filter(([id]) => id !== cardId),
                )

                return {
                    board: {
                    ...state.board,
                    cards: remainingCards,
                    columns: state.board.columns.map((col) => ({
                        ...col,
                        cardIds: col.cardIds.filter((id) => id !== cardId),
                    })),
                    updatedAt: new Date().toISOString(),
                    },
                }
            }),

        moveCard: (cardId, fromColumnId, toColumnId, toIndex) =>
            set((state) => {
                const card = state.board.cards[cardId]
                const toColumn = state.board.columns.find((c) => c.id === toColumnId)

                if (!card || !toColumn) return state

                return {
                    board: {
                        ...state.board,
                        columns: state.board.columns.map((col) => {
                        // 移動元：該当カードを除外
                        if (col.id === fromColumnId) {
                            return {
                            ...col,
                            cardIds: col.cardIds.filter((id) => id !== cardId),
                            }
                        }
                        // 移動先：指定インデックスに挿入
                        if (col.id === toColumnId) {
                            const newCardIds = col.cardIds.filter((id) => id !== cardId)
                            newCardIds.splice(toIndex, 0, cardId)
                            return { ...col, cardIds: newCardIds }
                        }
                        return col
                        }),
                        // カードのステータスも更新
                        cards: {
                        ...state.board.cards,
                        [cardId]: {
                            ...card,
                            status: toColumn.status,
                            updatedAt: new Date().toISOString(),
                        },
                        },
                        updatedAt: new Date().toISOString(),
                    },
                }
            }),

        // ───────────────
        // カラム操作
        // ───────────────
        addColumn: (input) =>
            set((state) => ({
                board: {
                    ...state.board,
                    columns: [
                    ...state.board.columns,
                    { ...input, id: generateId(), cardIds: [] },
                    ],
                    updatedAt: new Date().toISOString(),
                },
            })),

        deleteColumn: (columnId) =>
            set((state) => {
                const column = state.board.columns.find((c) => c.id === columnId)
                if (!column) return state

                // カラム内のカードも全て削除
                const cardIdsToDelete = new Set(column.cardIds)
                const remainingCards = Object.fromEntries(
                    Object.entries(state.board.cards).filter(([id]) => !cardIdsToDelete.has(id)),
                )

                return {
                    board: {
                    ...state.board,
                    columns: state.board.columns.filter((c) => c.id !== columnId),
                    cards: remainingCards,
                    updatedAt: new Date().toISOString(),
                    },
                }
            }),

        // ───────────────
        // ボード操作
        // ───────────────
        updateBoardTitle: (title) =>
            set((state) => ({
                board: {
                    ...state.board,
                    title,
                    updatedAt: new Date().toISOString(),
                },
            })),
        }),

        // ───────────────
        // localStorage 永続化の設定
        // ───────────────
        {
            name: 'kanban-board-storage', // localStorage のキー名
        },
    ),
)
// ポイント①
// persist ミドルウェアを使うことで、set を呼ぶたびに自動で localStorage に保存されます。
// ページをリロードしても状態が復元されます。

// ポイント②
// deleteCard の const { [cardId]: _removed, ...remainingCards } = state.board.cards は分割代入で特定キーを除外するイディオムです。
// _removed の _ プレフィックスは「使わない変数」を ESLint に伝える慣習です。