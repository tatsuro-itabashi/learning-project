import type { Board } from '@/types'
import { CARD_STATUS, PRIORITY } from '@/types'

export const initialBoard: Board = {
    id: 'board-1',
    title: 'My Kanban Board',
    columns: [
        { id: 'col-todo',        title: 'ToDo',       status: CARD_STATUS.TODO,        cardIds: ['card-1', 'card-2'] },
        { id: 'col-in-progress', title: 'In Progress', status: CARD_STATUS.IN_PROGRESS, cardIds: ['card-3'] },
        { id: 'col-done',        title: 'Done',        status: CARD_STATUS.DONE,        cardIds: [] },
    ],
    cards: {
        'card-1': {
            id: 'card-1',
            title: 'Zustand のストアを実装する',
            description: '型安全なストアを作る',
            priority: PRIORITY.HIGH,
            labels: ['feature'],
            dueDate: '2024-12-31',
            status: CARD_STATUS.TODO,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        'card-2': {
            id: 'card-2',
            title: 'TypeScript の型設計',
            description: 'interface と type を使い分ける',
            priority: PRIORITY.MEDIUM,
            labels: ['docs'],
            dueDate: null,
            status: CARD_STATUS.TODO,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        'card-3': {
            id: 'card-3',
            title: 'Vite 環境構築',
            description: 'strict mode で設定完了',
            priority: PRIORITY.LOW,
            labels: [],
            dueDate: null,
            status: CARD_STATUS.IN_PROGRESS,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
}