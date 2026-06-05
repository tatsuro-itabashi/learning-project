interface ChartContainerProps {
    title: string
    children: React.ReactNode
    isEmpty?: boolean
    emptyMessage?: string
}

export function ChartContainer({
    title,
    children,
    isEmpty = false,
    emptyMessage = 'データがありません',
}: ChartContainerProps) {
    return (
        <div className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">{title}</h2>
            {isEmpty ? (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
                {emptyMessage}
            </div>
            ) : (
            children
            )}
        </div>
    )
}