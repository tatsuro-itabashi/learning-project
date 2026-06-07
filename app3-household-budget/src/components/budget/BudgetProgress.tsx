import type { BudgetProgress as BudgetProgressType } from '@/lib/budgets'

interface BudgetProgressProps {
    progress: BudgetProgressType
}

export function BudgetProgress({ progress }: BudgetProgressProps) {
    const fmt = (n: number) => new Intl.NumberFormat('ja-JP').format(n)

    // 100% を超えても見た目上は満タン（100%）で止める
    const barWidth = Math.min(progress.percentage, 100)

    const barColor = progress.isOverBudget
        ? 'bg-red-500'
        : progress.percentage >= 80
        ? 'bg-amber-400'
        : 'bg-blue-500'

    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1.5">
                    <span>{progress.categoryIcon}</span>
                    <span className="font-medium text-gray-700">{progress.categoryName}</span>
                    {progress.isOverBudget && (
                        <span className="text-xs text-red-500 font-medium">⚠ 予算超過</span>
                    )}
                </div>
                <span className="text-xs text-gray-400">
                ¥{fmt(progress.spentAmount)} / ¥{fmt(progress.budgetAmount)}
                </span>
            </div>

            {/* プログレスバー */}
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all ${barColor}`}
                    style={{ width: `${barWidth}%` }}
                />
            </div>
        </div>
    )
}

// ポイント
// Math.min(progress.percentage, 100)：実績が予算を超えても、バー自体は画面からはみ出さないようにする（実数値はテキストで見せる）
// 80% 以上で黄色、超過で赤、というように段階的に色を変えてユーザーへの注意喚起レベルを調整