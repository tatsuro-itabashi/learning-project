'use client'

import { useTransition } from 'react'
import type { CommentWithAuthor } from '@/lib/comments'
import { deleteComment } from '@/app/posts/_actions/commentActions'

interface CommentItemProps {
    comment: CommentWithAuthor
    currentUserId: string | null
    postSlug: string
}

export function CommentItem({ comment, currentUserId, postSlug }: CommentItemProps) {
    const [isPending, startTransition] = useTransition()
    const isOwner = currentUserId === comment.author.id

    const handleDelete = () => {
        if (!confirm('このコメントを削除しますか？')) return
        startTransition(async () => {
            await deleteComment(comment.id, postSlug)
        })
    }

    const formattedDate = new Intl.DateTimeFormat('ja-JP', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(comment.createdAt))

    return (
        <div className={`flex gap-3 ${isPending ? 'opacity-50' : ''} transition-opacity`}>
            {/* アバター */}
            {comment.author.image ? (
                <img
                    src={comment.author.image}
                    alt={comment.author.name ?? ''}
                    className="w-8 h-8 rounded-full shrink-0"
                />
            ) : (
                <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0" />
            )}

            {/* 本文 */}
            <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-800">
                        {comment.author.name}
                    </span>
                    <span className="text-xs text-gray-400">{formattedDate}</span>
                    {isOwner && (
                        <button
                            onClick={handleDelete}
                            disabled={isPending}
                            className="ml-auto text-xs text-gray-400 hover:text-red-500 transition-colors"
                        >削除</button>
                    )}
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                    {comment.content}
                </p>
            </div>
        </div>
    )
}