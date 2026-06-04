// 収支の DB 操作関数
import { createClient } from '@/lib/supabase/client'
import type { Transaction, TransactionInsert, TransactionUpdate } from '@/types'

// カテゴリ情報を JOIN した型
export type TransactionWithCategory = Transaction & {
    categories: {
        name: string
        color: string
        icon: string
    } | null
}

// ───────────────────────────────────────
// 月別収支一覧を取得
// ───────────────────────────────────────
export async function getTransactionsByMonth(
    year: number,
    month: number,
): Promise<TransactionWithCategory[]> {
    const supabase = createClient()

    // 月の開始・終了日を計算
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`
    const endDate = new Date(year, month, 0)
        .toISOString()
        .slice(0, 10)  // その月の最終日

    const { data, error } = await supabase
        .from('transactions')
        .select(`
        *,
            categories (
                name,
                color,
                icon
            )
        `)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: false })

    if (error) throw error
    return data as TransactionWithCategory[]
}

// ───────────────────────────────────────
// 収支を作成
// ───────────────────────────────────────
export async function createTransaction(
    input: Omit<TransactionInsert, 'user_id'>,
): Promise<Transaction> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('ログインが必要です')

    const { data, error } = await supabase
        .from('transactions')
        .insert({ ...input, user_id: user.id })
        .select()
        .single()

    if (error) throw error
    return data
}

// ───────────────────────────────────────
// 収支を更新
// ───────────────────────────────────────
export async function updateTransaction(
    id: string,
    input: TransactionUpdate,
): Promise<Transaction> {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('transactions')
        .update(input)
        .eq('id', id)
        .select()
        .single()

    if (error) throw error
    return data
}

// ───────────────────────────────────────
// 収支を削除
// ───────────────────────────────────────
export async function deleteTransaction(id: string): Promise<void> {
    const supabase = createClient()

    const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)

    if (error) throw error
}

// ───────────────────────────────────────
// 月の収支合計を計算
// ───────────────────────────────────────
export function calcSummary(transactions: TransactionWithCategory[]) {
    const income  = transactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)

    const expense = transactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)

    return { income, expense, balance: income - expense }
}