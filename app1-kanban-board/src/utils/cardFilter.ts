import type { Card, FilterState } from '@/types'
import { PRIORITY_ORDER } from '@/types'

// ───────────────
// フィルタ関数
// ───────────────
export function filterCards(cards: Card[], filter: FilterState): Card[] {
    return cards.filter((card) => {
        // ラベルフィルタ：選択ラベルのいずれかを持つカードのみ表示
        if (filter.labels.length > 0) {
            const hasMatchingLabel = filter.labels.some((label) =>
                card.labels.includes(label),
            )
            if (!hasMatchingLabel) return false
        }

        // 優先度フィルタ
        if (filter.priorities.length > 0) {
            if (!filter.priorities.includes(card.priority)) return false
        }

        return true
    })
}

// ───────────────
// ソート関数（ジェネリクス版）
// ───────────────

// T 型の配列を、指定されたキー関数の返り値でソートする汎用関数
function sortBy<T>(
    items: T[],
    getValue: (item: T) => number | string | null,
    order: 'asc' | 'desc',
): T[] {
    return [...items].sort((a, b) => {
        const aVal = getValue(a)
        const bVal = getValue(b)

        // null は末尾に
        if (aVal === null && bVal === null) return 0
        if (aVal === null) return 1
        if (bVal === null) return -1

        let result: number
        if (typeof aVal === 'string' && typeof bVal === 'string') {
            result = aVal.localeCompare(bVal)
        } else {
            result = (aVal as number) - (bVal as number)
        }

        return order === 'asc' ? result : -result
    })
}

export function sortCards(cards: Card[], filter: FilterState): Card[] {
    if (filter.sortKey === 'none') return cards

    if (filter.sortKey === 'priority') {
        return sortBy(cards, (card) => PRIORITY_ORDER[card.priority], filter.sortOrder)
    }

    return sortBy(cards, (card) => card.dueDate ?? '', filter.sortOrder)
}

// フィルタとソートを合成して適用
export function applyFilter(cards: Card[], filter: FilterState): Card[] {
    const filtered = filterCards(cards, filter)
    return sortCards(filtered, filter)
}

// ポイント
// （ジェネリクス）: sortBy<T> は「Card の配列」だけでなく、任意の型の配列に使える汎用ソート関数です。
// getValue 関数を注入することで「何でソートするか」を呼び出し側が決められます。
// これが Generics の典型的な活用パターンです。