import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()

  // 型補完が効くことを確認（VSCode でホバーしてみる）
  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('*')

  if (error) console.error(error)

  // transactions は Transaction[] 型になっている
  console.log(transactions)

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">家計簿アプリ</h1>
      <p className="text-gray-500 mt-2">
        {transactions?.length ?? 0} 件のトランザクション
      </p>
    </div>
  )
}