import { prisma } from '@/lib/db'
import type { Tag } from '@prisma/client'

// タグと記事数の型
export type TagWithCount = Tag & {
    _count: { posts: number }
}

// ───────────────────────────────────────
// 全タグを記事数付きで取得（記事数の多い順）
// ───────────────────────────────────────
export async function getAllTagsWithCount(): Promise<TagWithCount[]> {
    return prisma.tag.findMany({
        include: {
            _count: { select: { posts: true } },
        },
        orderBy: {
            posts: { _count: 'desc' },
        },
    })
}

// ───────────────────────────────────────
// タグ名からタグ情報を取得
// ───────────────────────────────────────
export async function getTagByName(name: string): Promise<Tag | null> {
    return prisma.tag.findUnique({ where: { name } })
}

// ───────────────────────────────────────
// タグ名でフィルタした公開済み記事を取得
// ───────────────────────────────────────
export async function getPostsByTag(tagName: string) {
    return prisma.post.findMany({
        where: {
            status: 'PUBLISHED',
            tags: { some: { name: tagName } },
        },
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