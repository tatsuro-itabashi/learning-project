import { describe, it, expect } from 'vitest'
import { filterCards, sortCards } from '@/utils/cardFilter'
import type { Card, FilterState } from '@/types'
import { CARD_STATUS, PRIORITY } from '@/types'

// ───────────────
// テスト用フィクスチャ（共通データ）
// ───────────────
const makeCard = (overrides: Partial<Card>): Card => ({
    id: 'card-1',
    title: 'テストカード',
    description: '',
    priority: PRIORITY.MEDIUM,
    labels: [],
    dueDate: null,
    status: CARD_STATUS.TODO,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
})

const defaultFilter: FilterState = {
    labels: [],
    priorities: [],
    sortKey: 'none',
    sortOrder: 'asc',
}

const cards: Card[] = [
    makeCard({ id: '1', title: 'カードA', priority: PRIORITY.HIGH,   labels: ['bug'],     dueDate: '2024-12-01' }),
    makeCard({ id: '2', title: 'カードB', priority: PRIORITY.MEDIUM, labels: ['feature'], dueDate: '2024-11-01' }),
    makeCard({ id: '3', title: 'カードC', priority: PRIORITY.LOW,    labels: [],          dueDate: null }),
    makeCard({ id: '4', title: 'カードD', priority: PRIORITY.HIGH,   labels: ['bug', 'docs'], dueDate: '2024-10-01' }),
]

// ───────────────
// filterCards のテスト
// ───────────────
describe('filterCards', () => {
    it('フィルタなしの場合、全カードを返す', () => {
        const result = filterCards(cards, defaultFilter)
        expect(result).toHaveLength(4)
    })

    it('ラベル "bug" でフィルタすると該当カードのみ返す', () => {
        const filter: FilterState = { ...defaultFilter, labels: ['bug'] }
        const result = filterCards(cards, filter)
        expect(result).toHaveLength(2)
        expect(result.map((c) => c.id)).toEqual(['1', '4'])
    })

    it('複数ラベルはOR条件で動作する', () => {
        const filter: FilterState = { ...defaultFilter, labels: ['bug', 'feature'] }
        const result = filterCards(cards, filter)
        expect(result).toHaveLength(3)
    })

    it('優先度 "high" でフィルタすると該当カードのみ返す', () => {
        const filter: FilterState = { ...defaultFilter, priorities: [PRIORITY.HIGH] }
        const result = filterCards(cards, filter)
        expect(result).toHaveLength(2)
        result.forEach((card) => {
            expect(card.priority).toBe('high')
        })
    })

    it('ラベルと優先度のAND条件で絞り込める', () => {
        const filter: FilterState = {
            ...defaultFilter,
            labels: ['bug'],
            priorities: [PRIORITY.HIGH],
        }
        const result = filterCards(cards, filter)
        expect(result).toHaveLength(2)
    })

    it('一致するカードがない場合、空配列を返す', () => {
        const filter: FilterState = { ...defaultFilter, labels: ['refactor'] }
        const result = filterCards(cards, filter)
        expect(result).toHaveLength(0)
    })
})

// ───────────────
// sortCards のテスト
// ───────────────
describe('sortCards', () => {
    it('sortKey が "none" のとき順序を変えない', () => {
        const result = sortCards(cards, defaultFilter)
        expect(result.map((c) => c.id)).toEqual(['1', '2', '3', '4'])
    })

    it('優先度の昇順ソート：high → medium → low', () => {
        const filter: FilterState = { ...defaultFilter, sortKey: 'priority', sortOrder: 'asc' }
        const result = sortCards(cards, filter)
        expect(result.map((c) => c.priority)).toEqual(['high', 'high', 'medium', 'low'])
    })

    it('優先度の降順ソート：low → medium → high', () => {
        const filter: FilterState = { ...defaultFilter, sortKey: 'priority', sortOrder: 'desc' }
        const result = sortCards(cards, filter)
        expect(result.map((c) => c.priority)).toEqual(['low', 'medium', 'high', 'high'])
    })

    it('期限日の昇順ソート：早い順・null は末尾', () => {
        const filter: FilterState = { ...defaultFilter, sortKey: 'dueDate', sortOrder: 'asc' }
        const result = sortCards(cards, filter)
        expect(result.map((c) => c.id)).toEqual(['4', '2', '1', '3'])
    })

    it('期限日が null のカードは常に末尾になる', () => {
        const filter: FilterState = { ...defaultFilter, sortKey: 'dueDate', sortOrder: 'asc' }
        const result = sortCards(cards, filter)
        expect(result.at(-1)?.dueDate).toBeNull()
    })
})