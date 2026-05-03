import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCardModal } from '@/hooks/useCardModal'
import type { Card } from '@/types'
import { PRIORITY, CARD_STATUS } from '@/types'

const mockCard: Card = {
    id: 'card-1',
    title: 'モックカード',
    description: '',
    priority: PRIORITY.MEDIUM,
    labels: [],
    dueDate: null,
    status: CARD_STATUS.TODO,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
}

describe('useCardModal', () => {
    it('初期状態は closed', () => {
        const { result } = renderHook(() => useCardModal())
        expect(result.current.modalState.mode).toBe('closed')
        expect(result.current.isOpen).toBe(false)
    })

    it('openCreate を呼ぶと create モードで開く', () => {
        const { result } = renderHook(() => useCardModal())

        act(() => {
            result.current.openCreate('col-1')
        })

        expect(result.current.modalState.mode).toBe('create')
        expect(result.current.isOpen).toBe(true)
        // Discriminated Union で mode を絞り込んでアクセス
        if (result.current.modalState.mode === 'create') {
            expect(result.current.modalState.columnId).toBe('col-1')
        }
    })

    it('openEdit を呼ぶと edit モードで開く', () => {
        const { result } = renderHook(() => useCardModal())

        act(() => {
            result.current.openEdit(mockCard)
        })

        expect(result.current.modalState.mode).toBe('edit')
        if (result.current.modalState.mode === 'edit') {
            expect(result.current.modalState.card.id).toBe('card-1')
        }
    })

    it('close を呼ぶと closed に戻る', () => {
        const { result } = renderHook(() => useCardModal())

        act(() => {
            result.current.openCreate('col-1')
        })
        expect(result.current.isOpen).toBe(true)

        act(() => {
            result.current.close()
        })
        expect(result.current.modalState.mode).toBe('closed')
        expect(result.current.isOpen).toBe(false)
    })
})