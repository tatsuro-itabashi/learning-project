import { auth } from '@/auth'

export default async function HomePage() {
  const session = await auth()
  const user = session?.user

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        最新の記事
      </h1>
      {user ? (
        <p className="text-gray-600">
          ようこそ、{user.name} さん！（ID: {user.id}）
        </p>
      ) : (
        <p className="text-gray-600">
          ログインして記事を投稿しましょう。
        </p>
      )}
    </div>
  )
}