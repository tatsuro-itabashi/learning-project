// import { getPublishedPosts } from '@/lib/post'
// import { PostCard } from './PostCard'

// // async をつけるだけで Server Component として DB アクセスできる
// export async function PostList() {
//     const posts = await getPublishedPosts()

//     if (posts.length === 0) {
//         return (
//         <div className="text-center py-16 text-gray-400">
//             <p className="text-lg">まだ記事がありません</p>
//             <p className="text-sm mt-1">最初の記事を書いてみましょう</p>
//         </div>
//         )
//     }

//     return (
//         <div className="grid gap-4 sm:grid-cols-2">
//             {posts.map((post) => (
//                 <PostCard key={post.id} post={post} />
//             ))}
//         </div>
//     )
// }

import { getPaginatedPosts, type GetPostsOptions } from '@/lib/post'
import { PostCard } from './PostCard'
import { Pagination } from './Pagination'

interface PostListProps {
    options: GetPostsOptions
    searchParams: Record<string, string>
}

export async function PostList({ options, searchParams }: PostListProps) {
    const { posts, totalCount, totalPages, currentPage } = await getPaginatedPosts(options)

    if (posts.length === 0) {
        return (
        <div className="text-center py-16 text-gray-400">
            <p className="text-lg">記事が見つかりません</p>
            {options.query && (
            <p className="text-sm mt-1">「{options.query}」に一致する記事はありませんでした</p>
            )}
        </div>
        )
    }

    return (
        <div>
            {/* 件数表示 */}
            <p className="text-sm text-gray-500 mb-4">
                {totalCount} 件中 {(currentPage - 1) * 9 + 1}〜
                {Math.min(currentPage * 9, totalCount)} 件を表示
            </p>

            {/* 記事グリッド */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                <PostCard key={post.id} post={post} />
                ))}
            </div>

            {/* ページネーション */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                searchParams={searchParams}
            />
        </div>
    )
}