import { Suspense } from 'react'
import { PostList } from '@/components/post/PostList'
import { PostListSkeleton } from '@/components/post/PostCardSkeleton'

export default function HomePage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">最新の記事</h1>
      </div>

      {/*
        Suspense でラップすることで:
        1. PostList の DB 取得が終わるまでスケルトンを表示
        2. ページ全体のブロッキングなしに他のコンテンツを表示（Streaming）
      */}
      <Suspense fallback={<PostListSkeleton />}>
        <PostList />
      </Suspense>
    </div>
  )
}
// ポイント（Streaming）
// PostList は非同期 RSC なので DB 取得が完了するまで待ちます。
// Suspense で包むことで、待っている間はスケルトンを表示しつつ、ページの他の部分（ヘッダーなど）はすぐにブラウザへ送信されます。
// これが App Router の Streaming です。