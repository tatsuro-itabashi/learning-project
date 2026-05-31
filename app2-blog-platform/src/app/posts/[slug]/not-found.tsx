import Link from 'next/link'

export default function PostNotFound() {
    return (
        <div className="max-w-3xl mx-auto text-center py-16">
            <p className="text-6xl font-bold text-gray-100 mb-4">404</p>
            <h1 className="text-xl font-bold text-gray-800 mb-2">
                記事が見つかりません
            </h1>
            <p className="text-gray-500 text-sm mb-6">
                この記事は削除されたか、まだ公開されていません
            </p>
            <Link
                href="/"
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
                記事一覧へ戻る
            </Link>
        </div>
    )
}