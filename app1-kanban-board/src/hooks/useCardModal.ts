import { useState, useCallback } from 'react'
import type { Card } from '@/types'

// モーダルの種別を Discriminated Union で表現
type ModalStatus =
| { mode: 'closed'}
| { mode: 'create', columnId: string}
| { mode: 'edit', card: Card}

export function useCardModal() {
    const [modalState, setModalState] = useState<ModalStatus>({ mode: 'closed'})

    const openCreate = useCallback((columnId: string) => {
        setModalState({mode: 'create', columnId})
    }, [])

    const openEdit = useCallback((card: Card) => {
        setModalState({mode: 'edit', card})
    }, [])

    const close = useCallback(() => {
        setModalState({ mode: 'closed' })
      }, [])

    return {
        modalState,
        isOpen: modalState.mode !== 'closed',
        openCreate,
        openEdit,
        close,
    }
}

// ポイント
// ModalState を Discriminated Union にすることで、
// mode === 'edit' のときだけ card プロパティが存在することを TypeScript が保証します。
// mode === 'create' のときに card を参照しようとすると型エラーになります。