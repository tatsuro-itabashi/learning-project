'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { commentSchema } from '@/lib/validations/post'

type CommentActionResult =
    | { success: true }
    | { success: false; error: string }

// コメント投稿
export async function addComment(
    postId: string,
    formData: FormData,
): Promise<CommentActionResult> {
    const session = await auth()
    const userId = session?.user?.id
    if (!userId) return { success: false, error: 'ログインが必要です' }

    const result = commentSchema.safeParse({
        content: formData.get('content'),
    })

    if (!result.success) {
        return { success: false, error: result.error.issues[0]?.message ?? 'エラー' }
    }

    const post = await prisma.post.findUnique({ where: { id: postId } })
    if (!post) return { success: false, error: '記事が見つかりません' }

    await prisma.comment.create({
        data: {
            content: result.data.content,
            postId,
            authorId: userId,
        },
    })

    revalidatePath(`/posts/${post.slug}`)
    return { success: true }
}

// コメント削除
export async function deleteComment(
    commentId: string,
    slug: string,
): Promise<CommentActionResult> {
    const session = await auth()
    const userId = session?.user?.id
    if (!userId) return { success: false, error: 'ログインが必要です' }

    const comment = await prisma.comment.findUnique({ where: { id: commentId } })
    if (!comment) return { success: false, error: 'コメントが見つかりません' }

    // 本人のみ削除可能
    if (comment.authorId !== userId) {
        return { success: false, error: '削除権限がありません' }
    }

    await prisma.comment.delete({ where: { id: commentId } })

    revalidatePath(`/posts/${slug}`)
    return { success: true }
}