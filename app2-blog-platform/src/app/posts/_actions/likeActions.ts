'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'

type LikeResult =
  | { success: true; liked: boolean; count: number }
  | { success: false; error: 'UNAUTHORIZED' | 'NOT_FOUND' | 'SERVER_ERROR' }

export async function toggleLike(postId: string): Promise<LikeResult> {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return { success: false, error: 'UNAUTHORIZED' }

  try {
    const post = await prisma.post.findUnique({ where: { id: postId } })
    if (!post) return { success: false, error: 'NOT_FOUND' }

    // すでにいいねしているか確認
    const existing = await prisma.like.findUnique({
      where: {
        userId_postId: { userId, postId },
      },
    })

    if (existing) {
      // いいね解除
      await prisma.like.delete({
        where: { userId_postId: { userId, postId } },
      })
    } else {
      // いいね追加
      await prisma.like.create({
        data: { postId, userId },
      })
    }

    // 最新のいいね数を取得
    const count = await prisma.like.count({ where: { postId } })

    revalidatePath(`/posts/${post.slug}`)

    return { success: true, liked: !existing, count }
  } catch {
    return { success: false, error: 'SERVER_ERROR' }
  }
}

// 初期表示用：ユーザーがいいね済みか確認
export async function getLikeStatus(
  postId: string,
): Promise<{ liked: boolean; count: number }> {
  const session = await auth()
  const userId = session?.user?.id

  const count = await prisma.like.count({ where: { postId } })

  if (!userId) return { liked: false, count }

  const existing = await prisma.like.findUnique({
    where: { userId_postId: { userId, postId } },
  })

  return { liked: !!existing, count }
}