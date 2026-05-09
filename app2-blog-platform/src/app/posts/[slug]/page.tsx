import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getPostBySlug } from '@/lib/post'
import { TagBadge } from '@/components/ui/TagBadge'

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
        </article>
    )
}