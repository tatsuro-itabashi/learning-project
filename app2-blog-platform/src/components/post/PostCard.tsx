import Link from 'next/link'
import type { PostSummary } from '@/lib/post'

interface PostCardProps {
    post: PostSummary
}

export function PostCard({ post }: PostCardProps) {
    const publishedDate = post.publishedAt
        ? new Intl.DateTimeFormat('ja-JP', { dateStyle: 'medium' }).format(
            new Date(post.publishedAt),
        )
        : null

    return (
        <article className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
            <Link href={`/posts/${post.slug}`} className="block">
                <h2 className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                {post.title}
                </h2>
            </Link>

            {/* タグ */}
            {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                {post.tags.map((tag) => (
                    <span
                    key={tag.name}
                    className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full"
                    >
                    {tag.name}
                    </span>
                ))}
                </div>
            )}

            {/* フッター */}
            <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-2">
                {post.author.image && (
                    <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={post.author.image}
                            alt={post.author.name ?? ''}
                            className="w-5 h-5 rounded-full"
                        />
                    </>
                )}
                <span>{post.author.name}</span>
                </div>
                <div className="flex items-center gap-3">
                    <span>♥ {post._count.likes}</span>
                    {publishedDate && <span>{publishedDate}</span>}
                </div>
            </div>
        </article>
    )
}