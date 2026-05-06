import { z } from 'zod'

// ───────────────────────────────────────
// フォームの入力値スキーマ
// ───────────────────────────────────────
export const postFormSchema = z.object({
    title: z
        .string()
        .min(1, 'タイトルは必須です')
        .max(100, 'タイトルは100文字以内で入力してください'),
    content: z
        .string()
        .min(1, '本文は必須です')
        .max(50000, '本文は50,000文字以内で入力してください'),
    slug: z
        .string()
        .min(1, 'スラッグは必須です')
        .max(100)
        .regex(/^[a-z0-9-]+$/, 'スラッグは半角英数字とハイフンのみ使用できます'),
    tags: z.string().optional(),    // "typescript,react" のようにカンマ区切り文字列で受け取る
    status: z.enum(['DRAFT', 'PUBLISHED']),
})

// ───────────────────────────────────────
// スキーマから型を導出（型定義の重複なし）
// ───────────────────────────────────────
export type PostFormValues = z.infer<typeof postFormSchema>

// ───────────────────────────────────────
// Server Actions の戻り値の型
// ───────────────────────────────────────
export type ActionResult =
    | { success: true; slug: string }
    | { success: false; errors: Partial<Record<keyof PostFormValues | 'general', string>> }

// ポイント（z.infer<>）: PostFormValues = z.infer<typeof postFormSchema> とすることで、
// Zod スキーマから TypeScript の型が自動生成されます。
// スキーマを変えると型も自動で追従するため、「型定義」と「バリデーションルール」を別々に管理する必要がなくなります。