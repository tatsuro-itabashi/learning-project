import type { Card } from '@/types'
import { PRIORITY_CONFIG, LABEL_CONFIG } from '@/types'
import { CardBadge } from '@/components/ui/CardBadge'

interface CardItemProps {
    card: Card
    onClick: (card: Card) => void
}

export function CardItem({ card, onClick }: CardItemProps) {
    const isOverdue =
        card.dueDate !== null && new Date(card.dueDate) < new Date() && card.status !== 'done'

    return (
        <div
            onClick={() => {
                onClick(card)
            }}
            className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all duration-150 select-none"
        >
            {/* ラベル */}
            {card.labels.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                {card.labels.map((labelKey) => {
                    const config = LABEL_CONFIG[labelKey]
                    return (
                    <CardBadge
                        key={labelKey}
                        label={config.label}
                        color={config.color}
                        size="xs"
                    />
                    )
                })}
                </div>
            )}

            {/* タイトル */}
            <p className="text-sm font-medium text-gray-800 leading-snug">{card.title}</p>

            {/* 説明（あれば） */}
            {card.description && (
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{card.description}</p>
            )}

            {/* フッター：優先度・期限日 */}
            <div className="flex items-center justify-between mt-3">
                <CardBadge
                label={PRIORITY_CONFIG[card.priority].label}
                color={PRIORITY_CONFIG[card.priority].color}
                size="xs"
                />

                {card.dueDate && (
                <span className={`text-xs ${isOverdue ? 'text-red-500 font-semibold' : 'text-gray-400'}`}>
                    {isOverdue ? '⚠ ' : ''}
                    {new Date(card.dueDate).toLocaleDateString('ja-JP', {
                    month: 'numeric',
                    day: 'numeric',
                    })}
                </span>
                )}
            </div>
        </div>
    )
}