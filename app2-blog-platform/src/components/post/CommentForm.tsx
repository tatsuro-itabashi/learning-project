'use client'

import { useActionState, useRef } from 'react'
import { addComment } from '@/app/posts/_actions/commentActions'

interface CommentFormProps {
    postId: string
    userImage: string | null
    userName: string | null
}

type FormState = { error?: string } | null

export function CommentForm({ postId, userImage, userName }: CommentFormProps) {
    const formRef = useRef<HTMLFormElement>(null)

    const [state, formAction, isPending] = useActionState(
        async (_prev: FormState, formData: FormData): Promise<FormState> => {
            const result = await addComment(postId, formData)
            if (result.success) {
                formRef.current?.reset()  // 送信成功後にフォームをクリア
                return null
            }
            return { error: result.error }
        },
        null,
    )

    return (
        <form ref={formRef} action={formAction} className="flex gap-3">
            {/* アバター */}
            {userImage ? (
                <img
                    src={userImage}
                    alt={userName ?? ''}
                    className="w-8 h-8 rounded-full shrink-0 mt-1"
                />
            ) : (
                <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0 mt-1" />
            )}

            {/* 入力欄 */}
            <div className="flex-1">
                <textarea
                    name="content"
                    placeholder="コメントを入力..."
                    rows={2}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                            focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                {state?.error && (
                    <p className="text-red-500 text-xs mt-1">{state.error}</p>
                )}
                <div className="flex justify-end mt-2">
                    <button
                        type="submit"
                        disabled={isPending}
                        className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600
                                hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
                    >
                        {isPending ? '投稿中...' : 'コメントする'}
                    </button>
                </div>
            </div>
        </form>
    )
}