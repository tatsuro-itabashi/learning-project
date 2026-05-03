import { useState, useCallback } from 'react'
import type { FilterState, LabelKey, Priority, SortKey } from '@/types'

const initialFilter: FilterState = {
    labels: [],
    priorities: [],
    sortKey: 'none',
    sortOrder: 'asc',
}

export function useCardFilter() {
    const [filter, setFilter] = useState<FilterState>(initialFilter)

    // ラベルのトグル（選択中なら解除・未選択なら追加）
    const toggleLabel = useCallback((label: LabelKey) => {
        setFilter((prev) => ({
        ...prev,
        labels: prev.labels.includes(label)
            ? prev.labels.filter((l) => l !== label)
            : [...prev.labels, label],
        }))
    }, [])

    // 優先度のトグル
    const togglePriority = useCallback((priority: Priority) => {
        setFilter((prev) => ({
        ...prev,
        priorities: prev.priorities.includes(priority)
            ? prev.priorities.filter((p) => p !== priority)
            : [...prev.priorities, priority],
        }))
    }, [])

    // ソート基準の変更（同じキーを選択したら昇順/降順を切り替え）
    const setSortKey = useCallback((key: SortKey) => {
        setFilter((prev) => ({
        ...prev,
        sortKey: key,
        sortOrder:
            prev.sortKey === key && prev.sortOrder === 'asc' ? 'desc' : 'asc',
        }))
    }, [])

    // フィルタのリセット
    const resetFilter = useCallback(() => {
        setFilter(initialFilter)
    }, [])

    const isFiltering =
        filter.labels.length > 0 ||
        filter.priorities.length > 0 ||
        filter.sortKey !== 'none'

    return { filter, toggleLabel, togglePriority, setSortKey, resetFilter, isFiltering }
}