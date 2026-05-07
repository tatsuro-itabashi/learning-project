import { getPublishedPosts } from '@/lib/post'
import { PostCard } from './PostCard'

// async をつけるだけで Server Component として DB アクセスできる
export async function PostList() {
    const posts = await getPublishedPosts()

    if (posts.length === 0) {
        return (
        <div className="text-center py-16 text-gray-400">
            <p className="text-lg">まだ記事がありません</p>
            <p className="text-sm mt-1">最初の記事を書いてみましょう</p>
        </div>
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