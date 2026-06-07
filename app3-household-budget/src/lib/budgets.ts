// 予算の DB 操作関数
import { createClient } from '@/lib/supabase/client'
import type { TransactionWithCategory } from '@/lib/transactions'

// ───────────────────────────────────────
// 予算の型
// ───────────────────────────────────────
export interface Budget {
    id: string
    category_id: string
    year: number
    month: number
    amount: number
}

// 予算 + 実際の使用額をまとめた表示用の型
export interface BudgetProgress {
    categoryId: string
    categoryName: string
    categoryIcon: string
    categoryColor: string
    budgetAmount: number
    spentAmount: number
    percentage: number   // 0-100+
    isOverBudget: boolean
}

// ───────────────────────────────────────
// 指定月の予算一覧を取得
// ───────────────────────────────────────
export async function getBudgetsByMonth(
    year: number,
    month: number,
): Promise<Budget[]> {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('budgets')
        .select('id, category_id, year, month, amount')
        .eq('year', year)
        .eq('month', month)

    if (error) throw error
    return data
}

// ───────────────────────────────────────
// 予算を作成・更新（upsert）
// ───────────────────────────────────────
export async function upsertBudget(input: {
    category_id: string
    year: number
    month: number
    amount: number
}): Promise<Budget> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('ログインが必要です')

    const { data, error } = await supabase
        .from('budgets')
        .upsert(
            { ...input, user_id: user.id },
            { onConflict: 'user_id,category_id,year,month' },
        )
        .select('id, category_id, year, month, amount')
        .single()

    if (error) throw error
    return data
}

// ───────────────────────────────────────
// 予算を削除
// ───────────────────────────────────────
export async function deleteBudget(id: string): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase.from('budgets').delete().eq('id', id)
    if (error) throw error
}

// ───────────────────────────────────────
// 予算 + 実績をまとめて算出
// ───────────────────────────────────────
export function calcBudgetProgress(
    budgets: Budget[],
    transactions: TransactionWithCategory[],
): BudgetProgress[] {
  // カテゴリごとの支出額を集計
    const spentMap = new Map<string, number>()
    for (const t of transactions) {
        if (t.type !== 'expense' || !t.category_id) continue
        spentMap.set(t.category_id, (spentMap.get(t.category_id) ?? 0) + t.amount)
    }

    return budgets
        .map((b) => {
            // budgets には category 情報が JOIN されていないため
            // 該当する取引からカテゴリ情報を拾う（なければ既定値）
            const sample = transactions.find((t) => t.category_id === b.category_id)

            const spentAmount = spentMap.get(b.category_id) ?? 0
            const percentage = b.amount > 0
                ? Math.round((spentAmount / b.amount) * 100)
                : 0

            return {
                categoryId: b.category_id,
                categoryName: sample?.categories?.name ?? '未分類',
                categoryIcon: sample?.categories?.icon ?? '📦',
                categoryColor: sample?.categories?.color ?? '#6b7280',
                budgetAmount: b.amount,
                spentAmount,
                percentage,
                isOverBudget: spentAmount > b.amount,
            }
        })
        .sort((a, b) => b.percentage - a.percentage)
}

// Note
// sample でカテゴリ情報を補完しているのは、
// budgets テーブルが categories と JOIN されていないためです。
// 実際にはカテゴリ一覧（categories）を別途引いて補完する方が安全ですが、
// 今回は簡略化のためトランザクションから拾っています。