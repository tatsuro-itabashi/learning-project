import { useState } from 'react'
import {
    DndContext,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
    type DragStartEvent,
    type DragOverEvent,
    type DragEndEvent,
} from '@dnd-kit/core'
import type { Card, DraggableCardData, DroppableColumnData } from '@/types'
import { useBoardStore } from '@/store/boardStore'
import { Column } from '@/components/Column/Column'
import { CardItem } from '@/components/Card/CardItem'
import { CardModal } from '@/components/Card/CardModal'
import { useCardModal } from '@/hooks/useCardModal'

// dnd-kit の data が unknown なのでカスタム型に絞り込む型ガード関数
function isDraggableCardData(data: unknown): data is DraggableCardData {
    return (
        typeof data === 'object' &&
        data !== null &&
        'type' in data &&
        (data as { type?: unknown }).type === 'card'
    )
}

function isDroppableColumnData(data: unknown): data is DroppableColumnData {
    return (
        typeof data === 'object' &&
        data !== null &&
        'type' in data &&
        (data as { type?: unknown }).type === 'column'
    )
}

export function Board() {
    const { board, moveCard } = useBoardStore()
    const { modalState, openCreate, openEdit, close } = useCardModal()

    // ドラッグ中のカード（DragOverlay 表示用）
    const [activeCard, setActiveCard] = useState<Card | null>(null)
    // ドラッグオーバー中のカラム ID
    const [overColumnId, setOverColumnId] = useState<string | null>(null)

    // PointerSensor：8px 動かしてからドラッグ開始（クリックと区別）
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
    )

    const getCardsForColumn = (cardIds: string[]): Card[] =>
        cardIds.flatMap((id) => {
            const card = board.cards[id]
            return card ? [card] : []
        })

    // ドラッグ開始：アクティブカードを記録
    const handleDragStart = (event: DragStartEvent) => {
        const data = event.active.data.current
        if (!isDraggableCardData(data)) return
        const card = board.cards[data.cardId]
        if (card) setActiveCard(card)
    }

    // ドラッグ中：オーバー先のカラムを記録（ハイライト用）
    const handleDragOver = (event: DragOverEvent) => {
        const overData = event.over?.data.current
        if (isDroppableColumnData(overData)) {
            setOverColumnId(overData.columnId)
        } else if (isDraggableCardData(overData)) {
            setOverColumnId(overData.columnId)
        } else {
            setOverColumnId(null)
        }
    }

    // ドラッグ終了：moveCard を呼んでストアを更新
    const handleDragEnd = (event: DragEndEvent) => {
        setActiveCard(null)
        setOverColumnId(null)

        const { active, over } = event
        if (!over) return

        const activeData = active.data.current
        const overData = over.data.current

        if (!isDraggableCardData(activeData)) return

        const fromColumnId = activeData.columnId
        let toColumnId: string
        let toIndex: number

        if (isDroppableColumnData(overData)) {
            // カラム自体にドロップ → 末尾に追加
            toColumnId = overData.columnId
            const toColumn = board.columns.find((c) => c.id === toColumnId)
            toIndex = toColumn?.cardIds.length ?? 0
        } else if (isDraggableCardData(overData)) {
            // 別のカードの上にドロップ → そのカードの位置に挿入
            toColumnId = overData.columnId
            const toColumn = board.columns.find((c) => c.id === toColumnId)
            toIndex = toColumn?.cardIds.indexOf(over.id as string) ?? 0
        } else {
            return
        }

        // 同じ場所へのドロップは無視
        if (fromColumnId === toColumnId && active.id === over.id) return

        moveCard(activeData.cardId, fromColumnId, toColumnId, toIndex)
    }

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
        <div className="flex flex-col h-screen bg-blue-600">
            <header className="px-6 py-4">
            <h1 className="text-white text-xl font-bold">{board.title}</h1>
            </header>

            <main className="flex gap-4 px-6 pb-6 overflow-x-auto flex-1">
                {board.columns.map((column) => (
                    <Column
                    key={column.id}
                    column={column}
                    cards={getCardsForColumn(column.cardIds)}
                    onCardClick={openEdit}
                    onAddCard={openCreate}
                    isOver={overColumnId === column.id}
                    />
                ))}
            </main>
        </div>

        {/* ドラッグ中のゴースト表示 */}
        <DragOverlay>
            {activeCard && (
            <div className="rotate-2 scale-105 opacity-90">
                <CardItem
                card={activeCard}
                columnId=""
                onClick={() => undefined}
                />
            </div>
            )}
        </DragOverlay>

        {/* モーダル */}
        {modalState.mode === 'create' && (
            <CardModal mode="create" columnId={modalState.columnId} onClose={close} />
        )}
        {modalState.mode === 'edit' && (
            <CardModal mode="edit" card={modalState.card} onClose={close} />
        )}
        </DndContext>
    )
}