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



// ページあたりの記事数
export const POSTS_PER_PAGE = 9

// 検索・ページネーション用の引数型
export interface GetPostsOptions {
  query?: string    // 検索キーワード
  page?: number     // ページ番号（1始まり）
  tag?: string      // タグフィルタ
}

// 総ページ数を含む戻り値の型
export interface PaginatedPosts {
    posts: PostSummary[]
    totalCount: number
    totalPages: number
    currentPage: number
}

// ───────────────────────────────────────
// 検索・ページネーション対応の記事取得
// ───────────────────────────────────────
export async function getPaginatedPosts(
    options: GetPostsOptions = {},
): Promise<PaginatedPosts> {
    const { query = '', page = 1, tag } = options
    const skip = (page - 1) * POSTS_PER_PAGE

    // WHERE 条件を組み立てる
    const where = {
        status: 'PUBLISHED' as const,
        // キーワード検索：タイトル OR 本文
        ...(query
        ? {
            OR: [
                { title: { contains: query, mode: 'insensitive' as const } },
                { content: { contains: query, mode: 'insensitive' as const } },
            ],
            }
        : {}),
        // タグ絞り込み
        ...(tag ? { tags: { some: { name: tag } } } : {}),
    }

    // 件数取得とデータ取得を並列実行
    const [totalCount, posts] = await Promise.all([
        prisma.post.count({ where }),
        prisma.post.findMany({
            where,
            orderBy: { publishedAt: 'desc' },
            skip,
            take: POSTS_PER_PAGE,
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
        }),
    ])

    return {
        posts,
        totalCount,
        totalPages: Math.ceil(totalCount / POSTS_PER_PAGE),
        currentPage: page,
    }
}