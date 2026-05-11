import { prisma } from '@/lib/db'
import type { Comment, User } from '@prisma/client'

export type CommentWithAuthor = Comment & {
    author: Pick<User, 'id' | 'name' | 'image'>
}

export async function getCommentsByPostId(postId: string): Promise<CommentWithAuthor[]> {
    return prisma.comment.findMany({
        where: { postId },
        orderBy: { createdAt: 'asc' },
        include: {
            author: { select: { id: true, name: true, image: true } },
        },
    })
}