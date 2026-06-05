import { createClient } from '@/lib/supabase/client'
import type { TransactionWithCategory } from '@/lib/transactions'

// ───────────────────────────────────────
// 月別グラフ用の型
// ───────────────────────────────────────
export interface MonthlyData {
    month: string      // "5月" 形式
    income: number
    expense: number
}

// ───────────────────────────────────────
// カテゴリ別グラフ用の型
// ───────────────────────────────────────
export interface CategoryData {
    name: string
    value: number
    color: string
    percentage: number
}

// ───────────────────────────────────────
// 直近 N ヶ月分のデータを取得
// ───────────────────────────────────────
export async function getMonthlyData(months: number = 6): Promise<MonthlyData[]> {
    const supabase = createClient()

    // N ヶ月前の開始日を計算
    const now = new Date()
    const startDate = new Date(now.getFullYear(), now.getMonth() - months + 1, 1)
        .toISOString()
        .slice(0, 10)

    const { data, error } = await supabase
        .from('transactions')
        .select('amount, type, date')
        .gte('date', startDate)
        .order('date', { ascending: true })

    if (error) throw error

    // 月ごとに集計するための Map
    const monthMap = new Map<string, { income: number; expense: number }>()

    // 直近 N ヶ月分のキーを先に作成（データがない月も表示するため）
    for (let i = months - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        monthMap.set(key, { income: 0, expense: 0 })
    }

    // トランザクションを月ごとに集計
    for (const tx of data) {
        const key = tx.date.slice(0, 7)  // "2024-05"
        const existing = monthMap.get(key)
        if (!existing) continue

        if (tx.type === 'income') {
            existing.income += tx.amount
        } else {
            existing.expense += tx.amount
        }
    }

    // Map を配列に変換
    return Array.from(monthMap.entries()).map(([key, values]) => {
        const [, month] = key.split('-')
        return {
            month: `${parseInt(month ?? '1')}月`,
            ...values,
        }
    })
}

// ───────────────────────────────────────
// カテゴリ別支出を集計（現在月）
// ───────────────────────────────────────
export function getCategoryData(
    transactions: TransactionWithCategory[],
): CategoryData[] {
    // 支出のみを対象に
    const expenses = transactions.filter((t) => t.type === 'expense')
    const total = expenses.reduce((sum, t) => sum + t.amount, 0)

    if (total === 0) return []

    // カテゴリごとに集計
    const categoryMap = new Map<string, { amount: number; color: string }>()

    for (const tx of expenses) {
        const name = tx.categories?.name ?? '未分類'
        const color = tx.categories?.color ?? '#6b7280'
        const existing = categoryMap.get(name)

        if (existing) {
            existing.amount += tx.amount
        } else {
            categoryMap.set(name, { amount: tx.amount, color })
        }
    }

  // 金額の多い順にソートして配列化
    return Array.from(categoryMap.entries())
        .map(([name, { amount, color }]) => ({
            name,
            value: amount,
            color,
            percentage: Math.round((amount / total) * 100),
        })
    ).sort((a, b) => b.value - a.value)
}