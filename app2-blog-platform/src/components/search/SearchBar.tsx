'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTransition, useCallback } from 'react'
import { useDebouncedCallback } from 'use-debounce'

export function SearchBar() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()

    // URL の searchParams を操作するヘルパー
    const createQueryString = useCallback(
        (updates: Record<string, string | null>) => {
            const params = new URLSearchParams(searchParams.toString())
            Object.entries(updates).forEach(([key, value]) => {
                if (value === null || value === '') {
                    params.delete(key)
                } else {
                    params.set(key, value)
                }
            })
            return params.toString()
        },
        [searchParams],
    )

    // 300ms デバウンス：入力のたびに URL を更新しない
    const handleSearch = useDebouncedCallback((value: string) => {
        startTransition(() => {
            const qs = createQueryString({ q: value || null, page: null })
            router.push(`${pathname}?${qs}`)
        })
    }, 300)

    return (
        <div className="relative">
            <input
                type="search"
                defaultValue={searchParams.get('q') ?? ''}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="記事を検索..."
                className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-2.5 text-sm
                        focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
            {/* 検索アイコン */}
            <svg
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                    isPending ? 'text-blue-500 animate-pulse' : 'text-gray-400'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
            </svg>
        </div>
    )
}


// use-debounce のインストールが必要です：
// npm install use-debounce
// ポイント（デバウンス）
// キー入力のたびにルーター遷移すると、1文字入力するごとに DB クエリが走ってしまいます。
// useDebouncedCallback で 300ms 待ってから URL を更新することで、入力が落ち着いてから検索します。