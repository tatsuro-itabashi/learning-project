import { auth } from '@/auth'
import { getCommentsByPostId } from '@/lib/comments'
import { CommentItem } from './CommentItem'
import { CommentForm } from './CommentForm'

interface CommentListProps {
    postId: string
    postSlug: string
}

export async function CommentList({ postId, postSlug }: CommentListProps) {
    const [comments, session] = await Promise.all([
        getCommentsByPostId(postId),
        auth(),
    ])
    const user = session?.user

    return (
        <section className="mt-10 pt-8 border-t border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-6">
                コメント
                <span className="ml-2 text-sm font-normal text-gray-400">{comments.length}件</span>
            </h2>

            {/* コメント一覧 */}
            {comments.length > 0 ? (
                <div className="flex flex-col gap-5 mb-8">
                {comments.map((comment) => (
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                        currentUserId={user?.id ?? null}
                        postSlug={postSlug}
                    />
                ))}
                </div>
            ) : (
                <p className="text-gray-400 text-sm mb-8">
                まだコメントはありません。最初のコメントを投稿しましょう。
                </p>
            )}

            {/* 投稿フォーム */}
            {user ? (
                <CommentForm
                    postId={postId}
                    userImage={user.image ?? null}
                    userName={user.name ?? null}
                />
            ) : (
                <p className="text-sm text-gray-500">
                    コメントするには{' '}
                    <a href="/login" className="text-blue-600 hover:underline">ログイン</a>
                    が必要です。
                </p>
            )}
        </section>
    )
}