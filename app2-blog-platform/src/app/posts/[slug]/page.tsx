import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import { Suspense } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getPostBySlug } from '@/lib/post'
import { TagBadge } from '@/components/ui/TagBadge'

// import に追加
import { LikeButton } from '@/components/post/LikeButton'
import { getLikeStatus } from '@/app/posts/_actions/likeActions'
import { CommentList } from '@/components/post/CommentList'

interface PostPageProps {
    params: Promise<{ slug: string }>
}

// 動的メタデータ（OGP 対応の準備）
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
    const { slug } = await params
    const post = await getPostBySlug(slug)
    if (!post) return { title: '記事が見つかりません' }
    return { title: post.title }
}

export default async function PostPage({ params }: PostPageProps) {
const { slug } = await params
const post = await getPostBySlug(slug)

// 存在しない slug → 404
if (!post) notFound()

// 下書きは作者本人以外に見せない（Day18 で実装）
if (post.status === 'DRAFT') notFound()

const { liked, count } = await getLikeStatus(post.id)

const publishedDate = post.publishedAt
    ? new Intl.DateTimeFormat('ja-JP', { dateStyle: 'long' }).format(
        new Date(post.publishedAt),
    )
    : null

    return (
        <article className="max-w-3xl mx-auto">
            {/* ヘッダー */}
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                {post.title}
                </h1>

                {/* タグ */}
                {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag) => (
                        <TagBadge key={tag.name} name={tag.name} size="md" />
                        ))}
                    </div>
                )}

                {/* 著者・日付 */}
                <div className="flex items-center gap-3 text-sm text-gray-500">
                    {post.author.image && (
                        <Image
                            src={post.author.image}
                            alt={post.author.name ?? ''}
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-full"
                        />
                    )}
                    <div>
                        <p className="font-medium text-gray-700">{post.author.name}</p>
                        {publishedDate && <p>{publishedDate}</p>}
                    </div>
                    <div className="ml-auto flex gap-4">
                        <span>♥ {post._count.likes}</span>
                        <span>💬 {post._count.comments}</span>
                    </div>
                </div>
            </header>

            <hr className="border-gray-200 mb-8" />

            {/* 本文（Markdown レンダリング） */}
            <div className="prose prose-gray max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content}
                </ReactMarkdown>
            </div>
            <div className="mt-10 pt-6 border-t border-gray-200 flex items-center justify-center">
                <LikeButton
                    postId={post.id}
                    initialLiked={liked}
                    initialCount={count}
                />
                <Suspense fallback={
                    <div className="mt-10 pt-8 border-t border-gray-200">
                        <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-6" />
                        {Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="flex gap-3 mb-5">
                            <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0" />
                            <div className="flex-1 space-y-2">
                            <div className="h-3 bg-gray-200 rounded w-24" />
                            <div className="h-4 bg-gray-200 rounded w-full" />
                            </div>
                        </div>
                        ))}
                    </div>
                    }>
                    <CommentList postId={post.id} postSlug={post.slug} />
                </Suspense>
            </div>

        </article>
    )
}