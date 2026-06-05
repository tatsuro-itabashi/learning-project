'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import type { CategoryData } from '@/lib/chart'

interface CategoryPieChartProps {
    data: CategoryData[]
}

const formatTooltip = (value: unknown): string =>
    `¥${new Intl.NumberFormat('ja-JP').format(Number(value ?? 0))}`

export function CategoryPieChart({ data }: CategoryPieChartProps) {
    return (
        <div className="flex flex-col gap-4">
            {/* 円グラフ */}
            <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}    // ドーナツ形にする
                    outerRadius={85}
                    paddingAngle={2}
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip
                    formatter={formatTooltip}
                    contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    fontSize: '12px',
                    }}
                />
                </PieChart>
            </ResponsiveContainer>

            {/* 凡例（カスタム） */}
            <div className="flex flex-col gap-2">
                {data.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                    <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                    />
                    <span className="text-gray-700 truncate max-w-[120px]">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <span className="text-gray-400 text-xs">{item.percentage}%</span>
                        <span className="font-medium text-gray-700">
                            ¥{new Intl.NumberFormat('ja-JP').format(item.value)}
                        </span>
                    </div>
                </div>
                ))}
            </div>
        </div>
    )
}