// 収支1件
import type { TransactionWithCategory } from '@/lib/transactions'

interface TransactionItemProps {
    transaction: TransactionWithCategory
    onEdit: (t: TransactionWithCategory) => void
    onDelete: (id: string) => void
}

export function TransactionItem({ transaction: t, onEdit, onDelete }: TransactionItemProps) {
    const isExpense = t.type === 'expense'
    const formattedDate = new Intl.DateTimeFormat('ja-JP', {
        month: 'numeric',
        day: 'numeric',
    }).format(new Date(t.date))

    const formattedAmount = new Intl.NumberFormat('ja-JP').format(t.amount)

    return (
        <div className="flex items-center gap-3 py-3 px-4 hover:bg-gray-50 rounded-xl group transition-colors">
        {/* カテゴリアイコン */}
        <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
            style={{ backgroundColor: t.categories?.color ? `${t.categories.color}20` : '#f3f4f6' }}
        >
            {t.categories?.icon ?? '📦'}
        </div>

        {/* 内容 */}
        <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">
                {t.memo || t.categories?.name || '未分類'}
            </p>
            <p className="text-xs text-gray-400">
                {t.categories?.name} · {formattedDate}
            </p>
        </div>

        {/* 金額 */}
        <div className="text-right shrink-0">
            <p className={`text-sm font-bold ${isExpense ? 'text-red-500' : 'text-green-600'}`}>
                {isExpense ? '-' : '+'}¥{formattedAmount}
            </p>
        </div>

        {/* 操作ボタン（ホバー時に表示） */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button
                onClick={() => onEdit(t)}
                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                aria-label="編集"
            >
            ✏️
            </button>
            <button
                onClick={() => onDelete(t.id)}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                aria-label="削除"
            >
            🗑️
            </button>
        </div>
        </div>
    )
}