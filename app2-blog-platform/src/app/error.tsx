'use client'

import Link from 'next/link'
import { useEffect } from 'react'

interface ErrorPageProps {
    error: Error & { digest?: string }
    reset: () => void
}

export default function GlobalError({ error, reset }: ErrorPageProps) {
    // エラーをログに記録（本番では Sentry などに送る）
    useEffect(() => {
        console.error('[GlobalError]', error)
    }, [error])

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
            <div className="text-5xl mb-4">⚠️</div>
            <h1 className="text-xl font-bold text-gray-800 mb-2">
                予期しないエラーが発生しました
            </h1>
            <p className="text-gray-500 text-sm mb-2">
                問題が続く場合はページをリロードしてください
            </p>

            {/* digest はサーバーログとの照合用 ID */}
            {error.digest && (
                <p className="text-xs text-gray-400 font-mono mb-6">
                    Error ID: {error.digest}
                </p>
            )}

            <div className="flex gap-3">
                <button
                    onClick={reset}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                再試行する
                </button>
                <Link
                    href="/"
                    className="px-4 py-2 border border-gray-300 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                >
                トップへ戻る
                </Link>
            </div>
        </div>
    )
}