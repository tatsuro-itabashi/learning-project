'use client'

import { useEffect } from 'react'
import Link from 'next/link'

interface DashboardErrorProps {
    error: Error & { digest?: string }
    reset: () => void
}

export default function DashboardError({ error, reset }: DashboardErrorProps) {
    useEffect(() => {
        console.error('[DashboardError]', error)
    }, [error])

    return (
        <div className="max-w-4xl mx-auto text-center py-16">
            <p className="text-4xl mb-4">🔧</p>
            <h1 className="text-xl font-bold text-gray-800 mb-2">
                ダッシュボードの読み込みに失敗しました
            </h1>
            <p className="text-gray-500 text-sm mb-6">
                しばらくしてから再度お試しください
            </p>
            <button
                onClick={reset}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
                再試行する
            </button>
        </div>
    )
}