export default function DashboardLoading() {
    return (
        <div className="max-w-4xl mx-auto animate-pulse">
                {/* ヘッダー部分 */}
                <div className="flex items-center justify-between mb-6">
                <div>
                    <div className="h-8 w-48 bg-gray-200 rounded mb-2" />
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                </div>
                <div className="h-9 w-28 bg-gray-200 rounded-lg" />
                </div>

                {/* テーブル部分 */}
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="h-10 bg-gray-50 border-b border-gray-200" />
                {Array.from({ length: 5 }).map((_, i) => (
                    <div
                    key={i}
                    className="flex items-center gap-4 px-4 py-3 border-b border-gray-100"
                    >
                    <div className="h-4 bg-gray-200 rounded flex-1" />
                    <div className="h-5 w-16 bg-gray-200 rounded-full" />
                    <div className="h-4 w-8 bg-gray-200 rounded" />
                    <div className="h-4 w-8 bg-gray-200 rounded" />
                    <div className="h-4 w-20 bg-gray-200 rounded" />
                    <div className="h-4 w-16 bg-gray-200 rounded" />
                    </div>
                ))}
                </div>
        </div>
    )
}