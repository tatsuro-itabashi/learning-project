import { useState, type SyntheticEvent } from 'react'
import type { Card, CardFormValues, CardFormErrors } from '@/types'
import { PRIORITY, PRIORITY_CONFIG, LABEL_CONFIG } from '@/types'
import { useBoardStore } from '@/store/boardStore'
import { Modal } from '@/components/ui/Modal'

// ───────────────
// フォームのデフォルト値
// ───────────────
const defaultValues: CardFormValues = {
  title: '',
  description: '',
  priority: PRIORITY.MEDIUM,
  labels: [],
  dueDate: '',
}

// カードから初期フォーム値を生成
const cardToFormValues = (card: Card): CardFormValues => ({
  title: card.title,
  description: card.description,
  priority: card.priority,
  labels: [...card.labels],
  dueDate: card.dueDate ?? '',
})

// ───────────────
// バリデーション
// ───────────────
function validate(values: CardFormValues): CardFormErrors {
  const errors: CardFormErrors = {}
  if (values.title.trim() === '') {
    errors.title = 'タイトルは必須です'
  }
  return errors
}

// ───────────────
// Props
// ───────────────
type CardModalProps =
  | { mode: 'create'; columnId: string; onClose: () => void }
  | { mode: 'edit'; card: Card; onClose: () => void }

export function CardModal(props: CardModalProps) {
  const { addCard, updateCard, deleteCard } = useBoardStore()

  const [values, setValues] = useState<CardFormValues>(
    props.mode === 'edit' ? cardToFormValues(props.card) : defaultValues,
  )
  const [errors, setErrors] = useState<CardFormErrors>({})

  // ───────────────
  // イベントハンドラ
  // ───────────────
  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    const newErrors = validate(values)
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    if (props.mode === 'create') {
      addCard(props.columnId, {
        ...values,
        dueDate: values.dueDate || null,
        status: 'todo',
      })
    } else {
      updateCard({
        id: props.card.id,
        ...values,
        dueDate: values.dueDate || null,
      })
    }

    props.onClose()
  }

  const handleDelete = () => {
    if (props.mode !== 'edit') return
    deleteCard(props.card.id)
    props.onClose()
  }

  const toggleLabel = (labelKey: keyof typeof LABEL_CONFIG) => {
    setValues((prev) => ({
      ...prev,
      labels: prev.labels.includes(labelKey)
        ? prev.labels.filter((l) => l !== labelKey)
        : [...prev.labels, labelKey],
    }))
  }

  // ───────────────
  // レンダリング
  // ───────────────
  return (
    <Modal
      isOpen
      onClose={props.onClose}
      title={props.mode === 'create' ? 'カードを追加' : 'カードを編集'}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">

        {/* タイトル */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            タイトル <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={values.title}
            onChange={(e) => {
              setValues((prev) => ({ ...prev, title: e.target.value }))
              setErrors((prev) => ({ ...prev, title: undefined }))
            }}
            placeholder="カードのタイトルを入力"
            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.title ? 'border-red-400' : 'border-gray-300'
            }`}
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title}</p>
          )}
        </div>

        {/* 説明 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">説明</label>
          <textarea
            value={values.description}
            onChange={(e) => {
              setValues((prev) => ({ ...prev, description: e.target.value }))
            }}
            placeholder="詳細を入力（任意）"
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* 優先度 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">優先度</label>
          <div className="flex gap-2">
            {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setValues((prev) => ({ ...prev, priority: key as keyof typeof PRIORITY_CONFIG }))
                }}
                className={`flex-1 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                  values.priority === key
                    ? `${config.color} border-transparent`
                    : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}
              >
                {config.label}
              </button>
            ))}
          </div>
        </div>

        {/* ラベル */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ラベル</label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(LABEL_CONFIG).map(([key, config]) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  toggleLabel(key as keyof typeof LABEL_CONFIG)
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium border-2 transition-all ${
                  values.labels.includes(key as keyof typeof LABEL_CONFIG)
                    ? `${config.color} border-transparent scale-105`
                    : 'border-gray-200 text-gray-400 hover:border-gray-300'
                }`}
              >
                {config.label}
              </button>
            ))}
          </div>
        </div>

        {/* 期限日 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">期限日</label>
          <input
            type="date"
            value={values.dueDate ?? ''}
            onChange={(e) => {
              setValues((prev) => ({ ...prev, dueDate: e.target.value }))
            }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* フッターボタン */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          {props.mode === 'edit' ? (
            <button
              type="button"
              onClick={handleDelete}
              className="text-sm text-red-500 hover:text-red-700 transition-colors"
            >
              削除する
            </button>
          ) : (
            <div />
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={props.onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              {props.mode === 'create' ? '追加' : '保存'}
            </button>
          </div>
        </div>

      </form>
    </Modal>
  )
}