import type { BudgetProgress as BudgetProgressType } from '@/lib/budgets'
import { BudgetProgress } from './BudgetProgress'

interface BudgetListProps {
    progresses: BudgetProgressType[]
    onManage: () => void
}

export function BudgetList({ progresses, onManage }: BudgetListProps) {
    return (
        <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-700">今月の予算</h2>
                <button
                    onClick={onManage}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                    予算を設定
                </button>
            </div>

            {progresses.length === 0 ? (
                <p className="text-sm text-gray-400 py-2">
                    まだ予算が設定されていません
                </p>
            ) : (
                <div className="flex flex-col gap-3">
                    {progresses.map((p) => (
                        <BudgetProgress key={p.categoryId} progress={p} />
                    ))}
                </div>
            )}
        </div>
    )
}