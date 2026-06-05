'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getMonthlyData, getCategoryData, type MonthlyData } from '@/lib/chart'
import { getTransactionsByMonth } from '@/lib/transactions'
import { ChartContainer } from '@/components/charts/ChartContainer'
import { MonthlyBarChart } from '@/components/charts/MonthlyBarChart'
import { CategoryPieChart } from '@/components/charts/CategoryPieChart'
import type { CategoryData } from '@/lib/chart'

export default function ChartsPage() {
    const now = new Date()
    const [monthlyData, setMonthlyData]   = useState<MonthlyData[]>([])
    const [categoryData, setCategoryData] = useState<CategoryData[]>([])
    const [isLoading, setIsLoading]       = useState(true)

    useEffect(() => {
        const load = async () => {
            try {
                const [monthly, transactions] = await Promise.all([
                    getMonthlyData(6),
                    getTransactionsByMonth(now.getFullYear(), now.getMonth() + 1),
                ])
                setMonthlyData(monthly)
                setCategoryData(getCategoryData(transactions))
            } finally {
                setIsLoading(false)
            }
        }
        void load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="min-h-screen bg-gray-50">
            {/* ヘッダー */}
            <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
                <Link href="/dashboard" className="text-gray-400 hover:text-gray-600">
                ←
                </Link>
                <h1 className="font-bold text-gray-900">グラフ</h1>
            </header>

            <main className="max-w-lg mx-auto px-4 py-6 flex flex-col gap-4">
                {isLoading ? (
                <>
                    <div className="bg-white rounded-xl p-4 shadow-sm animate-pulse">
                        <div className="h-4 w-24 bg-gray-200 rounded mb-4" />
                        <div className="h-48 bg-gray-100 rounded" />
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm animate-pulse">
                        <div className="h-4 w-24 bg-gray-200 rounded mb-4" />
                        <div className="h-48 bg-gray-100 rounded" />
                    </div>
                </>
                ) : (
                <>
                    {/* 月別収支グラフ */}
                    <ChartContainer
                        title="月別収支（直近6ヶ月）"
                        isEmpty={monthlyData.every((d) => d.income === 0 && d.expense === 0)}
                    >
                        <MonthlyBarChart data={monthlyData} />
                    </ChartContainer>

                    {/* カテゴリ別支出グラフ */}
                    <ChartContainer
                        title={`カテゴリ別支出（${now.getMonth() + 1}月）`}
                        isEmpty={categoryData.length === 0}
                        emptyMessage="今月の支出データがありません"
                    >
                        <CategoryPieChart data={categoryData} />
                    </ChartContainer>
                </>
                )}
            </main>
        </div>
    )
}