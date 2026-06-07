'use client'

import { useState } from 'react'
import type { Category } from '@/types'
import type { Budget } from '@/lib/budgets'
import { upsertBudget, deleteBudget } from '@/lib/budgets'
import { Modal } from '@/components/ui/Modal'

interface BudgetFormProps {
    isOpen: boolean
    onClose: () => void
    categories: Category[]   // type === 'expense' のもののみ渡す想定
    budgets: Budget[]
    year: number
    month: number
    onSuccess: () => void
}

export function BudgetForm({
    isOpen,
    onClose,
    categories,
    budgets,
    year,
    month,
    onSuccess,
}: BudgetFormProps) {
    // カテゴリIDごとの入力値を保持（既存予算があれば初期値にセット）
    const [amounts, setAmounts] = useState<Record<string, string>>(() => {
        const initial: Record<string, string> = {}
        for (const cat of categories) {
            const existing = budgets.find((b) => b.category_id === cat.id)
            initial[cat.id] = existing ? String(existing.amount) : ''
        }
        return initial
    })
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (categoryId: string, value: string) => {
        setAmounts((prev) => ({ ...prev, [categoryId]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            // 入力された値だけを upsert / 削除
            for (const cat of categories) {
                const raw = amounts[cat.id]?.trim() ?? ''
                const existing = budgets.find((b) => b.category_id === cat.id)

                if (raw === '') {
                    // 空欄 = 予算を削除（既存があれば）
                    if (existing) await deleteBudget(existing.id)
                    continue
                }

                const amount = parseInt(raw, 10)
                if (isNaN(amount) || amount < 0) continue

                await upsertBudget({ category_id: cat.id, year, month, amount })
            }

            onSuccess()
            onClose()
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`${year}年${month}月の予算設定`}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <p className="text-xs text-gray-400">
                    空欄のまま保存すると、そのカテゴリの予算は削除されます。
                </p>

                <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
                    {categories.map((cat) => (
                        <div key={cat.id} className="flex items-center gap-2">
                            <span className="w-7 text-center">{cat.icon}</span>
                            <span className="flex-1 text-sm text-gray-700 truncate">{cat.name}</span>
                            <div className="relative w-32">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">¥</span>
                                <input
                                    type="number"
                                    min="0"
                                    value={amounts[cat.id] ?? ''}
                                    onChange={(e) => handleChange(cat.id, e.target.value)}
                                    placeholder="0"
                                    className="w-full border border-gray-300 rounded-lg pl-7 pr-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex gap-2 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-2.5 border border-gray-300 text-gray-600 text-sm rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        キャンセル
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {isLoading ? '保存中...' : '保存する'}
                    </button>
                </div>
            </form>
        </Modal>
    )
}

// ポイント：upsert を使う理由
// 「すでに予算があれば更新、なければ新規作成」を1回のクエリで実現できる
// onConflict: 'user_id,category_id,year,month' は Step 1 で作った unique 制約に対応している