import Link from 'next/link'

interface PaginationProps {
    currentPage: number
    totalPages: number
    searchParams: Record<string, string>   // 既存のクエリパラメータを保持
}

export function Pagination({ currentPage, totalPages, searchParams }: PaginationProps) {
    if (totalPages <= 1) return null

    // ページリンクの URL を生成（既存の q= などを保持したまま page= だけ変える）
    const createPageUrl = (page: number) => {
        const params = new URLSearchParams(searchParams)
        params.set('page', String(page))
        return `?${params.toString()}`
    }

    // 表示するページ番号の配列を生成（現在ページ周辺±2）
    const getPageNumbers = (): (number | '...')[] => {
        const range: (number | '...')[] = []
        const delta = 2

        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - delta && i <= currentPage + delta)
            ) {
                range.push(i)
            } else if (range[range.length - 1] !== '...') {
                range.push('...')
            }
        }

        return range
    }

    const pageNumbers = getPageNumbers()

    return (
        <nav className="flex items-center justify-center gap-1 mt-8" aria-label="ページネーション">
            {/* 前へ */}
            {currentPage > 1 ? (
                <Link
                href={createPageUrl(currentPage - 1)}
                className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                ← 前へ
                </Link>
            ) : (
                <span className="px-3 py-2 text-sm text-gray-300">← 前へ</span>
            )}

            {/* ページ番号 */}
            {pageNumbers.map((page, i) =>
                page === '...' ? (
                <span key={`ellipsis-${i}`} className="px-3 py-2 text-sm text-gray-400">
                    ...
                </span>
                ) : (
                <Link
                    key={page}
                    href={createPageUrl(page)}
                    className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                    page === currentPage
                        ? 'bg-blue-600 text-white font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    {page}
                </Link>
                ),
            )}

            {/* 次へ */}
            {currentPage < totalPages ? (
                <Link
                href={createPageUrl(currentPage + 1)}
                className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                次へ →
                </Link>
            ) : (
                <span className="px-3 py-2 text-sm text-gray-300">次へ →</span>
            )}
        </nav>
    )
}