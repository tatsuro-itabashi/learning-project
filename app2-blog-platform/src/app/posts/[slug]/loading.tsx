const skeletonLineWidths = ['w-full', 'w-11/12', 'w-5/6', 'w-full', 'w-4/5', 'w-3/4']

export default function Loading() {
    return (
        <div className="max-w-3xl mx-auto animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-3/4 mb-4" />
            <div className="flex gap-2 mb-4">
                <div className="h-6 w-20 bg-gray-200 rounded-full" />
                <div className="h-6 w-16 bg-gray-200 rounded-full" />
            </div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-8" />
            <hr className="border-gray-200 mb-8" />
            {skeletonLineWidths.map((width) => (
                <div key={width} className={`h-4 bg-gray-200 rounded mb-3 ${width}`} />
            ))}
        </div>
    )
}