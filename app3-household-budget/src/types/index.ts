import type { Database } from './supabase'

// テーブルの Row 型をエイリアスで使いやすくする
export type Category   = Database['public']['Tables']['categories']['Row']
export type Transaction = Database['public']['Tables']['transactions']['Row']
export type Budget     = Database['public']['Tables']['budgets']['Row']

// Insert / Update 用の型
export type CategoryInsert    = Database['public']['Tables']['categories']['Insert']
export type TransactionInsert = Database['public']['Tables']['transactions']['Insert']
export type BudgetInsert      = Database['public']['Tables']['budgets']['Insert']

export type CategoryUpdate    = Database['public']['Tables']['categories']['Update']
export type TransactionUpdate = Database['public']['Tables']['transactions']['Update']
export type BudgetUpdate      = Database['public']['Tables']['budgets']['Update']

// type フィールドの Union 型（check 制約から自動導出）
export type TransactionType = Transaction['type']   // 'income' | 'expense'
export type CategoryType    = Category['type']      // 'income' | 'expense'