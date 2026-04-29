import type { Card, Column as ColumnType } from '@/types'
import { CardItem } from '@/components/Card/CardItem'

interface ColumnProps {
    column: ColumnType
    cards: Card[]
    onCardClick: (card: Card) => void
    onAddCard: (columnId: string) => void
}

export function Column({ column, cards, onCardClick, onAddCard }: ColumnProps) {
    return (
        <div className="flex flex-col bg-gray-50 rounded-xl w-72 shrink-0">
            {/* カラムヘッダー */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                <div className="flex items-center gap-2">
                <h2 className="font-semibold text-gray-700 text-sm">{column.title}</h2>
                <span className="bg-gray-200 text-gray-600 text-xs font-medium rounded-full px-2 py-0.5">
                    {cards.length}
                </span>
                </div>
            </div>

            {/* カード一覧 */}
            <div className="flex flex-col gap-2 p-3 flex-1 min-h-24">
                {cards.map((card) => (
                <CardItem key={card.id} card={card} onClick={onCardClick} />
                ))}
            </div>

            {/* カード追加ボタン */}
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