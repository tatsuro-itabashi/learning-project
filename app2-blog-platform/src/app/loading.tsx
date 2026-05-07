import { PostListSkeleton } from '@/components/post/PostCardSkeleton'

// ページ遷移中に自動で表示される Loading UI
export default function Loading() {
    return (
        <div>
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-6" />
            <PostListSkeleton />
        </div>
    )
}