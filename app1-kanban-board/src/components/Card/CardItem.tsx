import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Card, DraggableCardData } from '@/types'
import { PRIORITY_CONFIG, LABEL_CONFIG } from '@/types'
import { CardBadge } from '@/components/ui/CardBadge'

interface CardItemProps {
    card: Card
    columnId: string
    onClick: (card: Card) => void
}

export function CardItem({ card, columnId, onClick }: CardItemProps) {
const dragData: DraggableCardData = { type: 'card', cardId: card.id, columnId }

const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
} = useSortable({ id: card.id, data: dragData })

const style = {
    transform: CSS.Transform.toString(transform),
    transition,
}

const isOverdue =
    card.dueDate !== null && new Date(card.dueDate) < new Date() && card.status !== 'done'

return (
    <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        className={`bg-white rounded-lg p-3 shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing transition-shadow duration-150 select-none ${
            isDragging ? 'opacity-50 shadow-lg rotate-1' : 'hover:shadow-md hover:border-blue-300'
        }`}
    >
        {/* ドラッグハンドル + クリックエリアを分離 */}
        <div
            {...listeners}
            className="flex flex-col gap-1"
            onClick={() => {
                if (!isDragging) {
                    onClick(card)
                }
            }}
        >

            {/* ラベル */}
            {card.labels.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-1">
                {card.labels.map((labelKey) => {
                const config = LABEL_CONFIG[labelKey]
                return (
                    <CardBadge key={labelKey} label={config.label} color={config.color} size="xs" />
                )
                })}
            </div>
            )}

            {/* タイトル */}
            <p className="text-sm font-medium text-gray-800 leading-snug">{card.title}</p>

            {/* 説明 */}
            {card.description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{card.description}</p>
            )}

            {/* フッター */}
            <div className="flex items-center justify-between mt-2">
            <CardBadge
                label={PRIORITY_CONFIG[card.priority].label}
                color={PRIORITY_CONFIG[card.priority].color}
                size="xs"
            />
            {card.dueDate && (
                <span className={`text-xs ${isOverdue ? 'text-red-500 font-semibold' : 'text-gray-400'}`}>
                {isOverdue ? '⚠ ' : ''}
                {new Date(card.dueDate).toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })}
                </span>
            )}
            </div>

        </div>
        </div>
    )
}