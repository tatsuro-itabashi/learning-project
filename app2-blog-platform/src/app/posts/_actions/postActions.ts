'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { postFormSchema, type ActionResult } from '@/lib/validations/post'
import { generateSlug } from '@/lib/utils/slug'

// ───────────────────────────────────────
// 記事作成
// ───────────────────────────────────────
export async function createPost(formData: FormData): Promise<ActionResult> {
    const session = await auth()
    const user = session?.user
    if (!user) return { success: false, errors: { general: 'ログインが必要です' } }

    // FormData を Object に変換してバリデーション
    const rawData = {
        title:   formData.get('title'),
        content: formData.get('content'),
        slug:    formData.get('slug') || generateSlug(String(formData.get('title') ?? '')),
        tags:    formData.get('tags'),
        status:  formData.get('status'),
    }

    const result = postFormSchema.safeParse(rawData)

    if (!result.success) {
        // Zod のエラーを { フィールド名: エラーメッセージ } の形に変換
        const errors = Object.fromEntries(
        Object.entries(result.error.flatten().fieldErrors).map(([key, msgs]) => [
            key,
            msgs?.[0] ?? 'エラー',
        ]),
        ) as ActionResult extends { success: false } ? ActionResult['errors'] : never

        return { success: false, errors }
    }

    const { title, content, slug, tags, status } = result.data

    // slug の重複チェック
    const existing = await prisma.post.findUnique({ where: { slug } })
    if (existing) {
        return { success: false, errors: { slug: 'このスラッグはすでに使われています' } }
    }

    // タグを処理（カンマ区切り文字列 → 配列 → upsert）
    const tagNames = tags
        ? tags.split(',').map((t) => t.trim()).filter(Boolean)
        : []

    await prisma.post.create({
        data: {
        title,
        content,
        slug,
        status,
        author: { connect: { id: user.id } },
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
        tags: {
            connectOrCreate: tagNames.map((name) => ({
                where: { name },
                create: { name, slug: generateSlug(name) },
            })),
        },
        },
    })

    revalidatePath('/')
    revalidatePath('/posts')

    return { success: true, slug }
}

// ───────────────────────────────────────
// 記事更新
// ───────────────────────────────────────
export async function updatePost(postId: string, formData: FormData): Promise<ActionResult> {
    const session = await auth()
    const user = session?.user
    if (!user) return { success: false, errors: { general: 'ログインが必要です' } }

    const post = await prisma.post.findUnique({ where: { id: postId } })
    if (!post || post.authorId !== user.id) {
        return { success: false, errors: { general: '編集権限がありません' } }
    }

    const rawData = {
        title:   formData.get('title'),
        content: formData.get('content'),
        slug:    formData.get('slug'),
        tags:    formData.get('tags'),
        status:  formData.get('status'),
    }

    const result = postFormSchema.safeParse(rawData)
    if (!result.success) {
        const errors = Object.fromEntries(
            Object.entries(result.error.flatten().fieldErrors).map(([key, msgs]) => [
                key,
                msgs?.[0] ?? 'エラー',
            ]),
        ) as ActionResult extends { success: false } ? ActionResult['errors'] : never
        return { success: false, errors }
    }

    const { title, content, slug, tags, status } = result.data
    const tagNames = tags
        ? tags.split(',').map((t) => t.trim()).filter(Boolean)
        : []

    await prisma.post.update({
        where: { id: postId },
        data: {
        title,
        content,
        slug,
        status,
        publishedAt:
            status === 'PUBLISHED' && !post.publishedAt ? new Date() : post.publishedAt,
        tags: {
            set: [],    // 既存タグをいったんリセット
            connectOrCreate: tagNames.map((name) => ({
                where: { name },
                create: { name, slug: generateSlug(name) },
            })),
        },
        updatedAt: new Date(),
        },
    })

    revalidatePath('/')
    revalidatePath(`/posts/${slug}`)

    return { success: true, slug }
}