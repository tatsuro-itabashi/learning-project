// import { Suspense } from 'react'
// import { PostList } from '@/components/post/PostList'
// import { PostListSkeleton } from '@/components/post/PostCardSkeleton'

// export default function HomePage() {
//   return (
//     <div>
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">最新の記事</h1>
//       </div>

//       {/*
//         Suspense でラップすることで:
//         1. PostList の DB 取得が終わるまでスケルトンを表示
//         2. ページ全体のブロッキングなしに他のコンテンツを表示（Streaming）
//       */}
//       <Suspense fallback={<PostListSkeleton />}>
//         <PostList />
//       </Suspense>
//     </div>
//   )
// }
// ポイント（Streaming）
// PostList は非同期 RSC なので DB 取得が完了するまで待ちます。
// Suspense で包むことで、待っている間はスケルトンを表示しつつ、ページの他の部分（ヘッダーなど）はすぐにブラウザへ送信されます。
// これが App Router の Streaming です。

import { Suspense } from 'react'
import { PostList } from '@/components/post/PostList'
import { PostListSkeleton } from '@/components/post/PostCardSkeleton'
import { SearchBar } from '@/components/search/SearchBar'

interface HomePageProps {
  searchParams: Promise<Record<string, string>>
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams
  const query = params.q ?? ''
  const page = Number(params.page ?? '1')

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 shrink-0">最新の記事</h1>
        <div className="flex-1 max-w-md">
        <div className="flex-1 max-w-md">
            <Suspense fallback={
              <div className="h-10 bg-gray-100 rounded-xl animate-pulse" />
            }>
              <SearchBar />
            </Suspense>
          </div>
        </div>
      </div>

      {/*
        key に query と page を含めることで、
        検索条件が変わるたびに Suspense がリセットされ
        スケルトンが再表示される
      */}
      <Suspense key={`${query}-${page}`} fallback={<PostListSkeleton />}>
        <PostList
          options={{ query, page }}
          searchParams={params}
        />
      </Suspense>
    </div>
  )
}

// ポイント（key で Suspense をリセット）
//  <Suspense key={...}> に key を渡すことで、検索条件やページが変わるたびに
// Suspense がアンマウント→マウントされ、スケルトンが再表示されます。
// key なしでは同じ Suspense インスタンスが使い回され、スケルトンが表示されません。