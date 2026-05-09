import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import type { Metadata } from 'next'
import { getTagByName, getPostsByTag } from '@/lib/tags'
import { PostCard } from '@/components/post/PostCard'
import { PostListSkeleton } from '@/components/post/PostCardSkeleton'

interface TagPageProps {
    params: Promise<{ name: string }>
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
    const { name } = await params
    const tagName = decodeURIComponent(name)
    return { title: `#${tagName} の記事` }
}

// ──────────────────────────────────────
// 記事一覧部分を別コンポーネントに分離
// → Suspense でラップするため
// ──────────────────────────────────────
async function TagPostList({ tagName }: { tagName: string }) {
    const posts = await getPostsByTag(tagName)

    if (posts.length === 0) {
        return (
            <p className="text-gray-400 py-8 text-center">
                このタグの公開済み記事はありません
            </p>
        )
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2">
            {posts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    )
}

// ──────────────────────────────────────
// ページ本体
// ──────────────────────────────────────
export default async function TagPage({ params }: TagPageProps) {
    const { name } = await params
    const tagName = decodeURIComponent(name)

    // タグの存在チェック（なければ 404）
    const tag = await getTagByName(tagName)
    if (!tag) notFound()

    return (
        <div>
            {/* ヘッダー */}
            <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl font-bold text-gray-900">
                    <span className="text-blue-500">#</span>
                    {tagName}
                </span>
                <a
                    href="/tags"
                    className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
                >
                ← タグ一覧へ
                </a>
            </div>

            {/* 記事一覧（Suspense でラップ） */}
            <Suspense fallback={<PostListSkeleton />}>
                <TagPostList tagName={tagName} />
            </Suspense>
        </div>
    )
}