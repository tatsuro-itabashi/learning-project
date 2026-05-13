import { redirect } from 'next/navigation'
import type { Session } from 'next-auth'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import type { Post } from '@prisma/client'

type AuthenticatedSession = Session & {
  user: NonNullable<Session['user']> & { id: string }
}

function hasUserId(session: Session | null): session is AuthenticatedSession {
    return typeof session?.user?.id === 'string'
}

// ───────────────────────────────────────
// 認可エラーの種別（Discriminated Union）
// ───────────────────────────────────────
export type AuthError =
  | { type: 'UNAUTHENTICATED' }   // 未ログイン
  | { type: 'FORBIDDEN' }         // ログイン済みだが権限なし
  | { type: 'NOT_FOUND' }         // リソースが存在しない

// ───────────────────────────────────────
// ログイン済みユーザーを取得（未ログインはログインページへ）
// ───────────────────────────────────────
export async function requireAuth(): Promise<AuthenticatedSession> {
    const session = await auth()
    if (!hasUserId(session)) redirect('/login')
    return session
}

// ───────────────────────────────────────
// 記事の編集権限を確認する
// ───────────────────────────────────────
export type PostAuthResult =
    | { ok: true; post: Post; userId: string }
    | { ok: false; error: AuthError }

export async function requirePostOwner(postId: string): Promise<PostAuthResult> {
    const session = await auth()
    if (!hasUserId(session)) return { ok: false, error: { type: 'UNAUTHENTICATED' } }

    const post = await prisma.post.findUnique({ where: { id: postId } })
    if (!post) return { ok: false, error: { type: 'NOT_FOUND' } }

    if (post.authorId !== session.user.id) {
        return { ok: false, error: { type: 'FORBIDDEN' } }
    }

    return { ok: true, post, userId: session.user.id }
}

// ───────────────────────────────────────
// AuthError を処理する（never で網羅性を保証）
// ───────────────────────────────────────
export function handleAuthError(error: AuthError): never {
    switch (error.type) {
        case 'UNAUTHENTICATED':
            redirect('/login')
        case 'FORBIDDEN':
            redirect('/403')
        case 'NOT_FOUND':
            redirect('/404')
        default:
        // TypeScript が「ここには到達しない」と判断できない場合、
        // never 型で網羅チェックを行う
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _exhaustiveCheck: never = error
            redirect('/500')
    }
}