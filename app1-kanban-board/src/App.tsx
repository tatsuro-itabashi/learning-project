import { useBoardStore } from '@/store/boardStore'
import { PRIORITY, CARD_STATUS } from '@/types'

function App() {
  const { board, addCard, deleteCard } = useBoardStore()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">{board.title}</h1>

      <div className="flex gap-4">
        {board.columns.map((column) => (
          <div key={column.id} className="bg-gray-100 rounded-lg p-4 w-64">
            <h2 className="font-semibold mb-3">{column.title}</h2>

            {column.cardIds.map((cardId) => {
              const card = board.cards[cardId]
              if (!card) return null
              return (
                <div key={card.id} className="bg-white rounded p-3 mb-2 shadow-sm">
                  <p className="text-sm font-medium">{card.title}</p>
                  <p className="text-xs text-gray-500">{card.priority}</p>
                  <button
                    onClick={() => {
                      deleteCard(card.id)
                    }}
                    className="text-xs text-red-500 mt-1"
                  >
                    削除
                  </button>
                </div>
              )
            })}

            <button
              onClick={() => {
                addCard(column.id, {
                  title: `新しいカード ${String(Date.now())}`,
                  description: '',
                  priority: PRIORITY.MEDIUM,
                  labels: [],
                  dueDate: null,
                  status: CARD_STATUS.TODO,
                })
              }}
              className="text-sm text-blue-500 mt-2"
            >
              ＋ カードを追加
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App