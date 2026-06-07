// 収支テーブルの変更をリアルタイムに購読するフック
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected'

interface UseRealtimeTransactionsOptions {
    // 変更を検知したときに呼び出すコールバック（再取得など）
    onChange: () => void
    // 現在ユーザーが見ている年月（範囲外の変更では再取得しない）
    year: number
    month: number
}

export function useRealtimeTransactions({
    onChange,
    year,
    month,
}: UseRealtimeTransactionsOptions) {
    const [status, setStatus] = useState<ConnectionStatus>('connecting')

    useEffect(() => {
        const supabase = createClient()

        // 表示中の月の範囲（YYYY-MM-DD）
        const startDate = `${year}-${String(month).padStart(2, '0')}-01`
        const endDate = new Date(year, month, 0).toISOString().slice(0, 10)

        // チャンネル名は一意にしておく（複数画面で衝突しないように）
        const channel = supabase
            .channel(`transactions-changes-${year}-${month}`)
            .on(
            'postgres_changes',
            {
                event: '*',                 // INSERT / UPDATE / DELETE すべて
                schema: 'public',
                table: 'transactions',
            },
            (payload: RealtimePostgresChangesPayload<{ date: string }>) => {
                // new（追加・更新後）または old（削除前）の日付を確認
                const changedDate =
                    'date' in payload.new ? payload.new.date :
                    'date' in payload.old ? payload.old.date :
                    undefined

                // 表示中の月に関係する変更だけ再取得する
                if (
                    changedDate === undefined ||
                    (changedDate >= startDate && changedDate <= endDate)
                ) {
                    onChange()
                }
            },
            )
            .subscribe((subscribeStatus) => {
                if (subscribeStatus === 'SUBSCRIBED') setStatus('connected')
                else if (subscribeStatus === 'CHANNEL_ERROR' || subscribeStatus === 'TIMED_OUT') {
                    setStatus('disconnected')
                }
            })

        // クリーンアップ：コンポーネントが消える・依存値が変わるときに必ず購読解除
        return () => {
            void supabase.removeChannel(channel)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [year, month])

    return { status }
}

// ポイント①：なぜチャンネル名に年月を含めるか
// year/month が変わるたびに useEffect がクリーンアップ→再実行されます。
// 古いチャンネルが残っていると同じ名前で subscribe しようとしてエラーになることがあるため、
// 一意な名前にして安全に張り替えます。

// ポイント②：なぜ payload.new/payload.old の日付をチェックするか
// event: '*' で全変更を受け取りますが、
// 表示している月と無関係な変更（例：去年のデータ編集）でも再取得が走ると無駄な通信が発生します。
// 日付を見て「自分の画面に関係ある変更か」を判定し、必要なときだけ onChange を呼びます。

// ポイント③：クリーンアップ関数の重要性
// useEffect の戻り値として渡す関数は、
// 依存配列の値が変わる直前・コンポーネントがアンマウントされる直前に実行されます。
// removeChannel を呼ばないと、ページ遷移してもチャンネルが残り続け、メモリリークや二重購読の原因になります。