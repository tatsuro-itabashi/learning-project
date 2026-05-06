import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const pathname = req.nextUrl.pathname

    // 保護するパスのリスト
    const protectedPaths = ['/posts/new', '/posts/edit']
    const isProtected = protectedPaths.some((path) => pathname.startsWith(path))

    if (isProtected && !isLoggedIn) {
        const loginUrl = new URL('/login', req.url)
        loginUrl.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
})

export const config = {
    // 静的ファイルと API 認証ルートは除外
    matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
}