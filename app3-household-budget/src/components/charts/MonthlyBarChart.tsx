'use client'

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts'
import type { MonthlyData } from '@/lib/chart'

interface MonthlyBarChartProps {
    data: MonthlyData[]
}

// ツールチップのカスタムフォーマット（円表示）
const formatYAxis = (value: number): string => {
    if (value >= 10000) return `${(value / 10000).toFixed(0)}万`
    return `${value}`
}

const formatTooltip = (value: unknown): string =>
    `¥${new Intl.NumberFormat('ja-JP').format(Number(value ?? 0))}`

export function MonthlyBarChart({ data }: MonthlyBarChartProps) {
    return (
        <ResponsiveContainer width="100%" height={240}>
            <BarChart
                data={data}
                margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
                barCategoryGap="30%"
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    axisLine={false}
                    tickLine={false}
                />
                <YAxis
                    tickFormatter={formatYAxis}
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                    axisLine={false}
                    tickLine={false}
                    width={40}
                />
                <Tooltip
                    formatter={formatTooltip}
                    contentStyle={{
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                        fontSize: '12px',
                    }}
                />
                <Legend
                    wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
                    formatter={(value) => (value === 'income' ? '収入' : '支出')}
                />
                <Bar dataKey="income"  name="income"  fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    )
}