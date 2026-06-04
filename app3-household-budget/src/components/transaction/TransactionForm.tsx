// 収支入力フォーム
'use client'

import { useState } from 'react'
import type { Category, TransactionInsert } from '@/types'
import { createTransaction, updateTransaction } from '@/lib/transactions'
import type { TransactionWithCategory } from '@/lib/transactions'

interface TransactionFormProps {
    categories: Category[]
    editTarget?: TransactionWithCategory
    onSuccess: () => void
    onCancel: () => void
}

export function TransactionForm({
    categories,
    editTarget,
    onSuccess,
    onCancel,
}: TransactionFormProps) {
    const initialType = editTarget?.type === 'income' ? 'income' : 'expense'
    const [type, setType]     = useState<'income' | 'expense'>(initialType)
    const [amount, setAmount] = useState(editTarget?.amount.toString() ?? '')
    const [memo, setMemo]     = useState(editTarget?.memo ?? '')
    const [date, setDate]     = useState(
        editTarget?.date ?? new Date().toISOString().slice(0, 10),
    )
    const [categoryId, setCategoryId] = useState(editTarget?.category_id ?? '')
    const [isLoading, setIsLoading]   = useState(false)
    const [error, setError]           = useState<string | null>(null)

    const filteredCategories = categories.filter((c) => c.type === type)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        const amountNum = parseInt(amount, 10)
            if (!amountNum || amountNum <= 0) {
                setError('金額は1円以上の数値を入力してください')
            return
        }

        setIsLoading(true)
        try {
            const input: Omit<TransactionInsert, 'user_id'> = {
                type,
                amount: amountNum,
                memo,
                date,
                category_id: categoryId || null,
            }

            if (editTarget) {
                await updateTransaction(editTarget.id, input)
            } else {
                await createTransaction(input)
            }

            onSuccess()
        } catch (err) {
            setError(err instanceof Error ? err.message : '保存に失敗しました')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
            <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg">
            {error}
            </div>
        )}

        {/* 収支種別 */}
        <div className="flex rounded-xl overflow-hidden border border-gray-200">
            {(['expense', 'income'] as const).map((t) => (
            <button
                key={t}
                type="button"
                onClick={() => { setType(t); setCategoryId('') }}
                className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                type === t
                    ? t === 'expense'
                    ? 'bg-red-500 text-white'
                    : 'bg-green-500 text-white'
                    : 'bg-white text-gray-500 hover:bg-gray-50'
                }`}
            >
                {t === 'expense' ? '支出' : '収入'}
            </button>
            ))}
        </div>

        {/* 金額 */}
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
            金額 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">¥</span>
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                min="1"
                className="w-full border border-gray-300 rounded-lg pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
            />
            </div>
        </div>

        {/* カテゴリ */}
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">カテゴリ</label>
            <div className="flex flex-wrap gap-2">
            {filteredCategories.map((cat) => (
                <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryId(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border-2 transition-all ${
                    categoryId === cat.id
                    ? 'border-transparent text-white'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
                style={
                    categoryId === cat.id
                    ? { backgroundColor: cat.color, borderColor: cat.color }
                    : {}
                }
                >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
                </button>
            ))}
            </div>
        </div>

        {/* 日付 */}
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
            日付 <span className="text-red-500">*</span>
            </label>
            <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            />
        </div>

        {/* メモ */}
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">メモ</label>
            <input
            type="text"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="例：スーパーで買い物"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>

        {/* ボタン */}
        <div className="flex gap-2 pt-2">
            <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 border border-gray-300 text-gray-600 text-sm rounded-xl hover:bg-gray-50 transition-colors"
            >
            キャンセル
            </button>
            <button
            type="submit"
            disabled={isLoading}
            className="flex-1 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
            {isLoading ? '保存中...' : editTarget ? '更新する' : '記録する'}
            </button>
        </div>
        </form>
    )
}
