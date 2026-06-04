// カテゴリの DB 操作関数
import { createClient } from '@/lib/supabase/client'
import type { Category, CategoryInsert } from '@/types'

// デフォルトカテゴリ（初回ログイン時に作成）
export const DEFAULT_CATEGORIES: Omit<CategoryInsert, 'user_id'>[] = [
    { name: '食費',       type: 'expense', color: '#ef4444', icon: '🍽️' },
    { name: '交通費',     type: 'expense', color: '#f97316', icon: '🚃' },
    { name: '日用品',     type: 'expense', color: '#eab308', icon: '🛒' },
    { name: '娯楽',       type: 'expense', color: '#8b5cf6', icon: '🎮' },
    { name: '医療費',     type: 'expense', color: '#06b6d4', icon: '🏥' },
    { name: 'その他支出', type: 'expense', color: '#6b7280', icon: '💸' },
    { name: '給与',       type: 'income',  color: '#22c55e', icon: '💰' },
    { name: 'その他収入', type: 'income',  color: '#10b981', icon: '📈' },
]

export async function getCategories(): Promise<Category[]> {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('type')
        .order('name')

    if (error) throw error
    return data
}

export async function initializeDefaultCategories(userId: string): Promise<void> {
    const supabase = createClient()

    // すでにカテゴリが存在する場合はスキップ
    const { count } = await supabase
        .from('categories')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)

    if (count && count > 0) return

    const { error } = await supabase.from('categories').insert(
        DEFAULT_CATEGORIES.map((c) => ({ ...c, user_id: userId })),
    )

    if (error) throw error
}
