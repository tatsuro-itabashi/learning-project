import Link from 'next/link'

export default function ForbiddenPage() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
            <p className="text-6xl font-bold text-gray-200 mb-4">403</p>
            <h1 className="text-xl font-bold text-gray-800 mb-2">アクセス権限がありません</h1>
            <p className="text-gray-500 text-sm mb-6">
                このページを表示する権限がありません
            </p>
            <Link
                href="/"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
            >
                トップへ戻る
            </Link>
        </div>
    )
}