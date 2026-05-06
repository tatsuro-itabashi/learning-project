import Link from 'next/link'
import { auth, signOut } from '@/auth'

export async function Header() {
    const session = await auth()
    const user = session?.user

    return (
        <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="font-bold text-gray-900 text-lg">
            Blog
            </Link>

            <nav className="flex items-center gap-4">
            {user ? (
                <>
                <Link
                    href="/posts/new"
                    className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    記事を書く
                </Link>

                <div className="flex items-center gap-2">
                    {user.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={user.image}
                        alt={user.name ?? ''}
                        className="w-8 h-8 rounded-full"
                    />
                    )}
                    <span className="text-sm text-gray-700">{user.name}</span>
                </div>

                <form
                    action={async () => {
                    'use server'
                    await signOut({ redirectTo: '/' })
                    }}
                >
                    <button
                    type="submit"
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                    >
                    ログアウト
                    </button>
                </form>
                </>
            ) : (
                <Link
                href="/login"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                ログイン
                </Link>
            )}
            </nav>
        </div>
        </header>
    )
}