import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllTagsWithCount } from '@/lib/tags'

export const metadata: Metadata = { title: 'タグ一覧' }

export default async function TagsPage() {
    const tags = await getAllTagsWithCount()

    return (
        <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">タグ一覧</h1>

        {tags.length === 0 ? (
            <p className="text-gray-400">まだタグはありません</p>
        ) : (
            <div className="flex flex-wrap gap-3">
                {tags.map((tag) => (
                    <Link
                        key={tag.id}
                        href={`/tags/${encodeURIComponent(tag.name)}`}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full hover:border-blue-400 hover:bg-blue-50 transition-colors group"
                    >
                        <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">
                            {tag.name}
                        </span>
                        <span className="text-xs text-gray-400 group-hover:text-blue-500">
                            {tag._count.posts}
                        </span>
                    </Link>
                ))}
            </div>
        )}
        </div>
    )
}