'use client'

import { useEffect } from 'react'
import Link from 'next/link'

interface PostErrorProps {
    error: Error & { digest?: string }
    reset: () => void
}

export default function PostError({ error, reset }: PostErrorProps) {
    useEffect(() => {
        console.error('[PostError]', error)
    }, [error])

    return (
        <div className="max-w-3xl mx-auto text-center py-16">
            <p className="text-4xl mb-4">😵</p>
            <h1 className="text-xl font-bold text-gray-800 mb-2">
                記事の読み込みに失敗しました
            </h1>
            <p className="text-gray-500 text-sm mb-6">
                ネットワークエラーまたはサーバーエラーが発生しました
            </p>
            <div className="flex gap-3 justify-center">
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
                一覧へ戻る
                </Link>
            </div>
        </div>
    )
}