import { useBoardStore } from '@/store/boardStore'
import { PRIORITY, CARD_STATUS } from '@/types'

// テストごとにストアをリセットする
beforeEach(() => {
    useBoardStore.setState({
        board: {
            id: 'board-test',
            title: 'テストボード',
            columns: [
                { id: 'col-1', title: 'ToDo',       status: CARD_STATUS.TODO,        cardIds: [] },
                { id: 'col-2', title: 'In Progress', status: CARD_STATUS.IN_PROGRESS, cardIds: [] },
            ],
            cards: {},
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    })
})

describe('useBoardStore - addCard', () => {
    it('カードを追加するとカラムの cardIds に追加される', () => {
        const { addCard } = useBoardStore.getState()

        addCard('col-1', {
            title: 'テストカード',
            description: '',
            priority: PRIORITY.MEDIUM,
            labels: [],
            dueDate: null,
            status: CARD_STATUS.TODO,
        })

        const { board } = useBoardStore.getState()
        expect(board.columns[0]?.cardIds).toHaveLength(1)
        expect(Object.keys(board.cards)).toHaveLength(1)
    })

    it('追加したカードのタイトルが正しく保存される', () => {
        const { addCard } = useBoardStore.getState()
        addCard('col-1', {
            title: '型安全なカード',
            description: 'テスト',
            priority: PRIORITY.HIGH,
            labels: ['feature'],
            dueDate: '2024-12-31',
            status: CARD_STATUS.TODO,
        })

        const { board } = useBoardStore.getState()
        const cardId = board.columns[0]?.cardIds[0]
        if (cardId === undefined) {
            throw new Error('カードIDが追加されていません')
        }
        const card = board.cards[cardId]
        expect(card?.title).toBe('型安全なカード')
        expect(card?.priority).toBe('high')
    })
})

describe('useBoardStore - deleteCard', () => {
    it('カードを削除するとカラムの cardIds からも除去される', () => {
        const { addCard, deleteCard } = useBoardStore.getState()
        addCard('col-1', {
            title: '削除するカード',
            description: '',
            priority: PRIORITY.LOW,
            labels: [],
            dueDate: null,
            status: CARD_STATUS.TODO,
        })

        const cardId = useBoardStore.getState().board.columns[0]?.cardIds[0]
        if (cardId === undefined) {
            throw new Error('カードIDが追加されていません')
        }

        deleteCard(cardId)

        const { board } = useBoardStore.getState()
        expect(board.columns[0]?.cardIds).toHaveLength(0)
        expect(board.cards[cardId]).toBeUndefined()
    })
})

describe('useBoardStore - moveCard', () => {
    it('カードを別カラムへ移動するとステータスが更新される', () => {
        const { addCard, moveCard } = useBoardStore.getState()
        addCard('col-1', {
            title: '移動するカード',
            description: '',
            priority: PRIORITY.MEDIUM,
            labels: [],
            dueDate: null,
            status: CARD_STATUS.TODO,
        })

        const cardId = useBoardStore.getState().board.columns[0]?.cardIds[0]
        if (cardId === undefined) {
            throw new Error('カードIDが追加されていません')
        }

        moveCard(cardId, 'col-1', 'col-2', 0)

        const { board } = useBoardStore.getState()
        expect(board.columns[0]?.cardIds).toHaveLength(0)
        expect(board.columns[1]?.cardIds).toContain(cardId)
        expect(board.cards[cardId]?.status).toBe(CARD_STATUS.IN_PROGRESS)
    })
})