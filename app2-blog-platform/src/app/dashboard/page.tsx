import Link from 'next/link'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { requireAuth } from '@/lib/auth-helpers'
import { prisma } from '@/lib/db'
import { deletePost, togglePostStatus } from '@/app/posts/_actions/postActions'

export const metadata: Metadata = { title: 'ダッシュボード' }

export default async function DashboardPage() {
    const session = await requireAuth()

    const posts = await prisma.post.findMany({
        where: { authorId: session.user.id },
        orderBy: { updatedAt: 'desc' },
        select: {
            id: true,
            title: true,
            slug: true,
            status: true,
            publishedAt: true,
            updatedAt: true,
            _count: { select: { likes: true, comments: true } },
        },
    })

    const publishedCount = posts.filter((p) => p.status === 'PUBLISHED').length
    const draftCount = posts.filter((p) => p.status === 'DRAFT').length

    return (
        <div className="max-w-4xl mx-auto">
            {/* ヘッダー */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        公開済み {publishedCount} 件 ／ 下書き {draftCount} 件
                    </p>
                </div>
                <Link
                    href="/posts/new"
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                ＋ 新しい記事
                </Link>
            </div>

            {/* 記事一覧テーブル */}
            {posts.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                    <p>まだ記事がありません</p>
                    <Link href="/posts/new" className="text-blue-500 text-sm mt-2 inline-block">
                        最初の記事を書く →
                    </Link>
                </div>
            ) : (
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left px-4 py-3 text-gray-600 font-medium">タイトル</th>
                                <th className="text-left px-4 py-3 text-gray-600 font-medium">状態</th>
                                <th className="text-right px-4 py-3 text-gray-600 font-medium">♥</th>
                                <th className="text-right px-4 py-3 text-gray-600 font-medium">💬</th>
                                <th className="text-right px-4 py-3 text-gray-600 font-medium">更新日</th>
                                <th className="px-4 py-3" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {posts.map((post) => (
                                <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                                    {/* タイトル */}
                                    <td className="px-4 py-3">
                                        <div className="flex flex-col">
                                        <Link
                                            href={`/posts/${post.slug}`}
                                            className="font-medium text-gray-900 hover:text-blue-600 line-clamp-1 transition-colors"
                                        >
                                            {post.title}
                                        </Link>
                                        <span className="text-xs text-gray-400 font-mono">{post.slug}</span>
                                        </div>
                                    </td>

                                    {/* 公開ステータス切り替え */}
                                    <td className="px-4 py-3">
                                        <form
                                            action={async () => {
                                                'use server'
                                                await togglePostStatus(post.id)
                                                redirect('/dashboard')
                                            }}
                                        >
                                        <button
                                            type="submit"
                                            className={`px-2 py-0.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                                            post.status === 'PUBLISHED'
                                                ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                                                : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'
                                            }`}
                                        >
                                            {post.status === 'PUBLISHED' ? '公開中' : '下書き'}
                                        </button>
                                        </form>
                                    </td>

                                    {/* いいね数 */}
                                    <td className="px-4 py-3 text-right text-gray-500">
                                        {post._count.likes}
                                    </td>

                                    {/* コメント数 */}
                                    <td className="px-4 py-3 text-right text-gray-500">
                                        {post._count.comments}
                                    </td>

                                    {/* 更新日 */}
                                    <td className="px-4 py-3 text-right text-gray-400 text-xs whitespace-nowrap">
                                        {new Intl.DateTimeFormat('ja-JP', { dateStyle: 'short' }).format(
                                        new Date(post.updatedAt),
                                        )}
                                    </td>

                                    {/* アクション */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2 justify-end">
                                            <Link
                                                href={`/posts/${post.slug}/edit`}
                                                className="text-xs text-gray-500 hover:text-blue-600 transition-colors"
                                            >
                                                編集
                                            </Link>
                                            <form
                                                action={async () => {
                                                'use server'
                                                await deletePost(post.id)
                                                redirect('/dashboard')
                                                }}
                                            >
                                                <button
                                                type="submit"
                                                className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                                                onClick={(e) => {
                                                    if (!confirm(`「${post.title}」を削除しますか？`)) {
                                                    e.preventDefault()
                                                    }
                                                }}
                                                >
                                                削除
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}