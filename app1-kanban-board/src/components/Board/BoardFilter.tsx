import type { FilterState, LabelKey, Priority, SortKey } from '@/types'
import { LABEL_CONFIG, PRIORITY_CONFIG } from '@/types'

interface BoardFilterProps {
    filter: FilterState
    onToggleLabel: (label: LabelKey) => void
    onTogglePriority: (priority: Priority) => void
    onSetSortKey: (key: SortKey) => void
    onReset: () => void
    isFiltering: boolean
}

export function BoardFilter({
    filter,
    onToggleLabel,
    onTogglePriority,
    onSetSortKey,
    onReset,
    isFiltering,
}: BoardFilterProps) {
    return (
        <div className="flex flex-wrap items-center gap-3 px-4 md:px-6 pb-3">

        {/* ラベルフィルタ */}
        <div className="flex items-center gap-1.5">
            <span className="text-white/70 text-xs font-medium">ラベル:</span>
            {(Object.entries(LABEL_CONFIG) as [LabelKey, typeof LABEL_CONFIG[LabelKey]][]).map(
            ([key, config]) => (
                <button
                key={key}
                onClick={() => {
                    onToggleLabel(key)
                }}
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium transition-all ${
                    filter.labels.includes(key)
                    ? `${config.color} scale-105`
                    : 'bg-white/20 text-white/70 hover:bg-white/30'
                }`}
                >
                {config.label}
                </button>
            ),
            )}
        </div>

        {/* 優先度フィルタ */}
        <div className="flex items-center gap-1.5">
            <span className="text-white/70 text-xs font-medium">優先度:</span>
            {(Object.entries(PRIORITY_CONFIG) as [Priority, typeof PRIORITY_CONFIG[Priority]][]).map(
            ([key, config]) => (
                <button
                key={key}
                onClick={() => {
                    onTogglePriority(key)
                }}
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium transition-all ${
                    filter.priorities.includes(key)
                    ? `${config.color} scale-105`
                    : 'bg-white/20 text-white/70 hover:bg-white/30'
                }`}
                >
                {config.label}
                </button>
            ),
            )}
        </div>

        {/* ソート */}
        <div className="flex items-center gap-1.5">
            <span className="text-white/70 text-xs font-medium">並び替え:</span>
            {(
            [
                { key: 'priority', label: '優先度' },
                { key: 'dueDate',  label: '期限日' },
            ] as { key: SortKey; label: string }[]
            ).map(({ key, label }) => (
            <button
                key={key}
                onClick={() => {
                    onSetSortKey(key)
                }}
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium transition-all ${
                filter.sortKey === key
                    ? 'bg-white text-blue-600'
                    : 'bg-white/20 text-white/70 hover:bg-white/30'
                }`}
            >
                {label}
                {filter.sortKey === key && (
                <span className="ml-1">{filter.sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
            </button>
            ))}
        </div>

        {/* リセット */}
        {isFiltering && (
            <button
            onClick={onReset}
            className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/30 text-white hover:bg-white/40 transition-all"
            >
            ✕ リセット
            </button>
        )}
        </div>
    )
}