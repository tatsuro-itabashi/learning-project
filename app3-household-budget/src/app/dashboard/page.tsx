// メインダッシュボード
'use client'

import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getCategories, initializeDefaultCategories } from '@/lib/categories'
import {
    getTransactionsByMonth,
    deleteTransaction,
    calcSummary,
    type TransactionWithCategory,
} from '@/lib/transactions'
import type { Category } from '@/types'
import { TransactionForm } from '@/components/transaction/TransactionForm'
import { TransactionItem } from '@/components/transaction/TransactionItem'
import { getBudgetsByMonth, calcBudgetProgress, type Budget } from '@/lib/budgets'
import { BudgetList } from '@/components/budget/BudgetList'
import { BudgetForm } from '@/components/budget/BudgetForm'
import { useRealtimeTransactions } from '@/hooks/useRealtimeTransactions'


export default function DashboardPage() {
    const router = useRouter()
    const [now] = useState(new Date())
    const [year, setYear]   = useState(now.getFullYear())
    const [month, setMonth] = useState(now.getMonth() + 1)

    const [transactions, setTransactions] = useState<TransactionWithCategory[]>([])
    const [categories, setCategories]     = useState<Category[]>([])
    const [isLoading, setIsLoading]       = useState(true)
    const [showForm, setShowForm]         = useState(false)
    const [editTarget, setEditTarget]     = useState<TransactionWithCategory | undefined>()

    const [budgets, setBudgets] = useState<Budget[]>([])
    const [showBudgetForm, setShowBudgetForm] = useState(false)

    // データ読み込み
    const loadData = useCallback(async () => {
        setIsLoading(true)
        try {
            const [txs, cats, buds] = await Promise.all([
                getTransactionsByMonth(year, month),
                getCategories(),
                getBudgetsByMonth(year, month),
            ])
            setTransactions(txs)
            setCategories(cats)
            setBudgets(buds)
        } finally {
            setIsLoading(false)
        }
    }, [year, month])

    // 初期化
    useEffect(() => {
        const supabase = createClient()
        supabase.auth.getUser().then(({ data: { user } }) => {
        if (!user) { router.push('/login'); return }
        initializeDefaultCategories(user.id).then(loadData)
        })
    }, [router, loadData])

    const handleDelete = async (id: string) => {
        if (!confirm('この収支を削除しますか？')) return
        await deleteTransaction(id)
        await loadData()
    }

    const handleFormSuccess = async () => {
        setShowForm(false)
        setEditTarget(undefined)
        await loadData()
    }

    const { income, expense, balance } = calcSummary(transactions)
    const fmt = (n: number) => new Intl.NumberFormat('ja-JP').format(n)

    // 前月・翌月
    const goPrev = () => {
        if (month === 1) { setYear(y => y - 1); setMonth(12) }
        else setMonth(m => m - 1)
    }
    const goNext = () => {
        if (month === 12) { setYear(y => y + 1); setMonth(1) }
        else setMonth(m => m + 1)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* ヘッダー */}
            <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                <h1 className="font-bold text-gray-900">家計簿</h1>
                <Link
                    href="/dashboard/charts"
                    className="text-sm text-gray-500 hover:text-gray-700 mr-3"
                >
                📊 グラフ
                </Link>
                <div className="flex items-center gap-1.5 text-xs text-gray-400 mr-3">
                    <span
                        className={`w-2 h-2 rounded-full ${
                            realtimeStatus === 'connected'
                                ? 'bg-green-500'
                                : realtimeStatus === 'connecting'
                                    ? 'bg-amber-400 animate-pulse'
                                    : 'bg-gray-300'
                        }`}
                    />
                    {realtimeStatus === 'connected' ? 'リアルタイム同期中' : realtimeStatus === 'connecting' ? '接続中...' : '切断'}
                </div>
                <button
                    onClick={() => createClient().auth.signOut().then(() => router.push('/login'))}
                    className="text-sm text-gray-500 hover:text-gray-700"
                >
                ログアウト
                </button>
            </header>

            <main className="max-w-lg mx-auto px-4 py-6 flex flex-col gap-4">
                {/* 月選択 */}
                <div className="flex items-center justify-between">
                    <button onClick={goPrev} className="p-2 hover:bg-gray-100 rounded-lg">←</button>
                    <span className="font-bold text-gray-900">{year}年{month}月</span>
                    <button onClick={goNext} className="p-2 hover:bg-gray-100 rounded-lg">→</button>
                </div>

                {/* サマリーカード */}
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: '収入', value: income,  color: 'text-green-600' },
                        { label: '支出', value: expense, color: 'text-red-500' },
                        { label: '収支', value: balance, color: balance >= 0 ? 'text-blue-600' : 'text-red-500' },
                    ].map(({ label, value, color }) => (
                        <div key={label} className="bg-white rounded-xl p-3 text-center shadow-sm">
                        <p className="text-xs text-gray-500 mb-1">{label}</p>
                        <p className={`text-sm font-bold ${color}`}>¥{fmt(value)}</p>
                        </div>
                    ))}
                </div>
                {/* 予算 */}
                <BudgetList
                    progresses={calcBudgetProgress(budgets, transactions)}
                    onManage={() => setShowBudgetForm(true)}
                />

                <BudgetForm
                    isOpen={showBudgetForm}
                    onClose={() => setShowBudgetForm(false)}
                    categories={categories.filter((c) => c.type === 'expense')}
                    budgets={budgets}
                    year={year}
                    month={month}
                    onSuccess={loadData}
                />
                {/* 収支追加ボタン */}
                {!showForm && (
                <button
                    onClick={() => { setEditTarget(undefined); setShowForm(true) }}
                    className="w-full py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
                >
                    ＋ 収支を記録
                </button>
                )}

                {/* フォーム */}
                {showForm && (
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <TransactionForm
                        categories={categories}
                        editTarget={editTarget}
                        onSuccess={handleFormSuccess}
                        onCancel={() => { setShowForm(false); setEditTarget(undefined) }}
                    />
                </div>
                )}

                {/* 収支一覧 */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="p-8 text-center text-gray-400 text-sm">読み込み中...</div>
                ) : transactions.length === 0 ? (
                    <div className="p-8 text-center text-gray-400 text-sm">
                    この月の収支はありません
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                    {transactions.map((t) => (
                        <TransactionItem
                        key={t.id}
                        transaction={t}
                        onEdit={(t) => { setEditTarget(t); setShowForm(true) }}
                        onDelete={handleDelete}
                        />
                    ))}
                    </div>
                )}
                </div>
            </main>
        </div>
    )
}