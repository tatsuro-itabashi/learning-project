'use client'

import { useActionState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { Post } from '@prisma/client'
import type { ActionResult } from '@/lib/validations/post'

interface PostFormProps {
    action: (formData: FormData) => Promise<ActionResult>
    initialData?: Pick<Post, 'title' | 'content' | 'slug' | 'status'> & { tags: string }
}

const initialState: ActionResult = { success: false, errors: {} }

export function PostForm({ action, initialData }: PostFormProps) {
    const router = useRouter()
    const formRef = useRef<HTMLFormElement>(null)

    const [state, formAction, isPending] = useActionState(
        async (_prev: ActionResult, formData: FormData) => {
        const result = await action(formData)
        if (result.success) {
            router.push(`/posts/${result.slug}`)
        }
            return result
        },
        initialState,
    )

    return (
        <form ref={formRef} action={formAction} className="flex flex-col gap-6">

            {/* サーバーエラー */}
            {!state.success && state.errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
                {state.errors.general}
                </div>
            )}

            {/* タイトル */}
            <div>
                <input
                    type="text"
                    name="title"
                    defaultValue={initialData?.title}
                    placeholder="記事のタイトル"
                    className="w-full text-3xl font-bold border-none outline-none placeholder:text-gray-300 focus:ring-0"
                    />
                    {!state.success && state.errors.title && (
                    <p className="text-red-500 text-xs mt-1">{state.errors.title}</p>
                )}
            </div>

            {/* スラッグ */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                スラッグ
                </label>
                <input
                    type="text"
                    name="slug"
                    defaultValue={initialData?.slug}
                    placeholder="my-first-post"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {!state.success && state.errors.slug && (
                <p className="text-red-500 text-xs mt-1">{state.errors.slug}</p>
                )}
            </div>

            {/* 本文 */}
            <div>
                <textarea
                    name="content"
                    defaultValue={initialData?.content}
                    placeholder="本文を Markdown で書く..."
                    rows={20}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                />
                {!state.success && state.errors.content && (
                <p className="text-red-500 text-xs mt-1">{state.errors.content}</p>
                )}
            </div>

            {/* タグ */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                タグ <span className="text-gray-400 font-normal">（カンマ区切り）</span>
                </label>
                <input
                    type="text"
                    name="tags"
                    defaultValue={initialData?.tags}
                    placeholder="typescript, react, nextjs"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* 送信ボタン */}
            <div className="flex gap-3 justify-end pt-2 border-t border-gray-200">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                キャンセル
                </button>

                {/* 下書き保存 */}
                <button
                    type="submit"
                    name="status"
                    value="DRAFT"
                    disabled={isPending}
                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                    {isPending ? '保存中...' : '下書き保存'}
                </button>

                {/* 公開 */}
                <button
                    type="submit"
                    name="status"
                    value="PUBLISHED"
                    disabled={isPending}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
                    >
                    {isPending ? '公開中...' : '公開する'}
                </button>
            </div>
        </form>
    )
}