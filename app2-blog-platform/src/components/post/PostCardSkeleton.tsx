export function PostCardSkeleton() {
    return (
        <div className="border border-gray-200 rounded-xl p-5 bg-white animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
            <div className="flex gap-1.5 mb-3">
            <div className="h-5 w-16 bg-gray-200 rounded-full" />
            <div className="h-5 w-20 bg-gray-200 rounded-full" />
        </div>
        <div className="flex justify-between">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-4 w-20 bg-gray-200 rounded" />
        </div>
    </div>
    )
}

export function PostListSkeleton() {
    return (
    <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
        <PostCardSkeleton key={i} />
        ))}
    </div>
    )
}