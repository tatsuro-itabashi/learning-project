import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { Card, Column as ColumnType, DroppableColumnData } from '@/types'
import { CardItem } from '@/components/Card/CardItem'

interface ColumnProps {
    column: ColumnType
    cards: Card[]
    onCardClick: (card: Card) => void
    onAddCard: (columnId: string) => void
    isOver?: boolean  // ドラッグオーバー中かどうか
}

export function Column({ column, cards, onCardClick, onAddCard, isOver }: ColumnProps) {
    const dropData: DroppableColumnData = { type: 'column', columnId: column.id }

    const { setNodeRef } = useDroppable({ id: column.id, data: dropData })

    return (
        <div
            className={`flex flex-col bg-gray-50 rounded-xl w-full md:w-72 md:shrink-0 transition-colors duration-150 ${
                isOver ? 'bg-blue-50 ring-2 ring-blue-300' : ''
            }`}
        >
            {/* ヘッダー */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                <div className="flex items-center gap-2">
                <h2 className="font-semibold text-gray-700 text-sm">{column.title}</h2>
                <span className="bg-gray-200 text-gray-600 text-xs font-medium rounded-full px-2 py-0.5">
                    {cards.length}
                </span>
                </div>
            </div>

            {/* カード一覧（SortableContext でソート順を管理） */}
            <div ref={setNodeRef} className="flex flex-col gap-2 p-3 flex-1 min-h-24">
                <SortableContext items={column.cardIds} strategy={verticalListSortingStrategy}>
                {cards.map((card) => (
                    <CardItem
                    key={card.id}
                    card={card}
                    columnId={column.id}
                    onClick={onCardClick}
                    />
                ))}
                </SortableContext>
            </div>

            {/* 追加ボタン */}
            <div className="px-3 pb-3">
                <button
                    onClick={() => {
                        onAddCard(column.id)
                    }}
                    className="w-full text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg py-2 transition-colors duration-150 flex items-center justify-center gap-1"
                >
                    <span className="text-lg leading-none">+</span>
                    <span>カードを追加</span>
                </button>
            </div>
        </div>
    )
}