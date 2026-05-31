import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
            <p className="text-8xl font-bold text-gray-100 mb-2 select-none">404</p>
            <h1 className="text-xl font-bold text-gray-800 mb-2">
                ページが見つかりません
            </h1>
            <p className="text-gray-500 text-sm mb-6">
                お探しのページは削除されたか、URL が変更された可能性があります
            </p>
            <div className="flex gap-3">
                <Link
                href="/"
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                トップへ戻る
                </Link>
                <Link
                href="/tags"
                className="px-4 py-2 border border-gray-300 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                >
                タグ一覧を見る
                </Link>
            </div>
        </div>
    )
}