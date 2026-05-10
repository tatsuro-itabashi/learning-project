'use client'

import { useOptimistic, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toggleLike } from '@/app/posts/_actions/likeActions'

interface LikeButtonProps {
  postId: string
  initialLiked: boolean
  initialCount: number
}

// ──────────────────────────────────────
// 楽観的更新の State 型
// ──────────────────────────────────────
interface LikeState {
  liked: boolean
  count: number
}

export function LikeButton({ postId, initialLiked, initialCount }: LikeButtonProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // useOptimistic：
  // - 第1引数：実際の State（Server からの確定値）
  // - 第2引数：楽観的に適用する更新関数
  const [optimisticState, addOptimistic] = useOptimistic<LikeState, 'toggle'>(
    { liked: initialLiked, count: initialCount },
    (current, action) => {
      if (action === 'toggle') {
        return {
          liked: !current.liked,
          count: current.liked ? current.count - 1 : current.count + 1,
        }
      }
      return current
    },
  )

  const handleClick = () => {
    startTransition(async () => {
      // 1. UI を即座に更新（楽観的更新）
      addOptimistic('toggle')

      // 2. Server Action を実行
      const result = await toggleLike(postId)

      if (!result.success) {
        if (result.error === 'UNAUTHORIZED') {
          router.push('/login')
          return
        }
        // 失敗時は useOptimistic が自動でロールバックする
        console.error('いいねに失敗しました:', result.error)
      }
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      aria-label={optimisticState.liked ? 'いいねを取り消す' : 'いいねする'}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-full border-2 font-medium text-sm
        transition-all duration-150 select-none
        ${
          optimisticState.liked
            ? 'border-red-400 bg-red-50 text-red-600 hover:bg-red-100'
            : 'border-gray-300 bg-white text-gray-500 hover:border-red-300 hover:text-red-500'
        }
        ${isPending ? 'scale-95' : 'hover:scale-105'}
        disabled:cursor-not-allowed
      `}
    >
      <span
        className={`text-lg transition-transform ${isPending ? 'scale-110' : ''}`}
        aria-hidden
      >
        {optimisticState.liked ? '♥' : '♡'}
      </span>
      <span>{optimisticState.count}</span>
    </button>
  )
}

// ポイント（useOptimistic）: React 19 の新フックです。
// 1. ボタンを押すと addOptimistic('toggle') が呼ばれ、UI が即座に更新される
// 2.並行して Server Action が実行される
// 3. Server Action が成功すると、revalidatePath によって Server から確定値が届き、initialLiked / initialCount が更新される
// 4. Server Action が失敗すると、useOptimistic は自動で元の State に戻す（ロールバック）
// ユーザーはサーバーのレスポンスを待たずに操作感を得られます。