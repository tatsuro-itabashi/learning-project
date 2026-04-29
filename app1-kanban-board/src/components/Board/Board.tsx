import type { Card } from '@/types'
import { PRIORITY } from '@/types'
import { useBoardStore } from '@/store/boardStore'
import { Column } from '@/components/Column/Column'

export function Board() {
    const { board, addCard } = useBoardStore()

    // カラムごとのカード一覧を取得（順序を保持）
    const getCardsForColumn = (cardIds: string[]): Card[] => {
        return cardIds.flatMap((id) => {
            const card = board.cards[id]
            return card ? [card] : []
        })
    }

    // カード追加（仮実装：Day 5 でモーダルに差し替え）
    const handleAddCard = (columnId: string) => {
        const column = board.columns.find((c) => c.id === columnId)
        if (!column) return

        addCard(columnId, {
            title: '新しいカード',
            description: '',
            priority: PRIORITY.MEDIUM,
            labels: [],
            dueDate: null,
            status: column.status,
        })
    }

    // カードクリック（仮実装：Day 5 でモーダルに差し替え）
    const handleCardClick = (card: Card) => {
        console.log('card clicked:', card)
    }

    return (
        <div className="flex flex-col h-screen bg-blue-600">
            {/* ボードヘッダー */}
            <header className="px-6 py-4">
                <h1 className="text-white text-xl font-bold">{board.title}</h1>
            </header>

            {/* カラム一覧 */}
            <main className="flex gap-4 px-6 pb-6 overflow-x-auto flex-1">
                {board.columns.map((column) => (
                <Column
                    key={column.id}
                    column={column}
                    cards={getCardsForColumn(column.cardIds)}
                    onCardClick={handleCardClick}
                    onAddCard={handleAddCard}
                />
                ))}
            </main>
        </div>
    )
}