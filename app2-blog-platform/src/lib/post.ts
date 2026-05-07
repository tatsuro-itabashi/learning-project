import { prisma } from '@/lib/db'
import type { Post, User, Tag } from '@prisma/client'

// 一覧表示に必要なフィールドだけ取得する型
export type PostSummary = Pick<Post, 'id' | 'title' | 'slug' | 'publishedAt' | 'createdAt'> & {
    author: Pick<User, 'name' | 'image'>
    tags: Pick<Tag, 'name'>[]
    _count: { likes: number }
}

// 詳細表示用の型
export type PostDetail = Post & {
    author: Pick<User, 'name' | 'image'>
    tags: Pick<Tag, 'name'>[]
    _count: { likes: number; comments: number }
}

// ───────────────────────────────────────
// 公開済み記事の一覧を取得
// ───────────────────────────────────────
export async function getPublishedPosts(): Promise<PostSummary[]> {
    return prisma.post.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { publishedAt: 'desc' },
        select: {
            id: true,
            title: true,
            slug: true,
            publishedAt: true,
            createdAt: true,
            author: { select: { name: true, image: true } },
            tags: { select: { name: true } },
            _count: { select: { likes: true } },
        },
    })
}

// ───────────────────────────────────────
// slug から記事の詳細を取得
// ───────────────────────────────────────
export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
    return prisma.post.findUnique({
        where: { slug },
        include: {
            author: { select: { name: true, image: true } },
            tags: { select: { name: true } },
            _count: { select: { likes: true, comments: true } },
        },
    })
}


// ポイント
// select で必要なフィールドだけを取得することで、不要なデータの転送を防ぎます。
// Prisma は select の内容から戻り値の型を自動推論するため、PostSummary 型が DB のスキーマと常に一致します。