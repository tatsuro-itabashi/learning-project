// CSV 生成・ダウンロード処理
import type { TransactionWithCategory } from '@/lib/transactions'

// ───────────────────────────────────────
// CSV の値をエスケープする
// ───────────────────────────────────────
// CSV では「,」「"」「改行」を含む値をダブルクォートで囲む必要がある
// さらに値の中の「"」は「""」に変換する（CSVのエスケープルール）
function escapeCsvValue(value: string): string {
    if (/[",\n]/.test(value)) {
        return `"${value.replace(/"/g, '""')}"`
    }
    return value
}

// ───────────────────────────────────────
// 収支データを CSV 文字列に変換
// ───────────────────────────────────────
export function transactionsToCsv(transactions: TransactionWithCategory[]): string {
    const header = ['日付', '種別', 'カテゴリ', '金額', 'メモ']

    const rows = transactions.map((t) => [
        t.date,
        t.type === 'income' ? '収入' : '支出',
        t.categories?.name ?? '未分類',
        String(t.amount),
        t.memo ?? '',
    ])

    // ヘッダーと各行をエスケープしながら CSV 形式の文字列に組み立てる
    const lines = [header, ...rows].map((row) =>
        row.map(escapeCsvValue).join(','),
    )

    // CSV の改行コードは慣習的に \r\n（CRLF）を使う
    return lines.join('\r\n')
}

// ───────────────────────────────────────
// CSV 文字列をファイルとしてダウンロードさせる
// ───────────────────────────────────────
export function downloadCsv(csvContent: string, filename: string): void {
    // \uFEFF（BOM: Byte Order Mark）を先頭に付けることで
    // Excel が文字コードを UTF-8 と正しく認識し、日本語の文字化けを防ぐ
    const bom = '\uFEFF'
    const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' })

    // Blob から一時的な URL を作成し、<a> タグ経由でダウンロードを発生させる
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()

    // 後始末：DOM から要素を削除し、作成した URL を解放する
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
}

// ───────────────────────────────────────
// ファイル名を生成（例：household-budget_2024-05.csv）
// ───────────────────────────────────────
export function buildCsvFilename(year: number, month: number): string {
    const monthStr = String(month).padStart(2, '0')
    return `household-budget_${year}-${monthStr}.csv`
}

// ポイント①：なぜ BOM（\uFEFF）を付けるか
// UTF-8 で書き出した CSV を Excel でそのまま開くと、日本語が文字化けすることがあります。
// これは Excel が「文字コードを自動判定する際に UTF-8 と認識できない」ことが原因です。
// 先頭に BOM という特別なバイト列を付けることで「これは UTF-8 ですよ」と明示でき、文字化けを防げます。

// ポイント②：なぜ CSV のエスケープが必要か
// CSV はカンマ区切りのフォーマットなので、
// メモ欄に「スーパーで買い物, ついでに外食」のようにカンマが含まれていると、列がズレてしまいます。
// 値をダブルクォートで囲むことで「これは1つの値です」と明示し、データの整合性を保ちます。

// ポイント③：URL.createObjectURL と revokeObjectURL の対応
// createObjectURL はメモリ上に一時的な参照（Blob URL）を作ります。
// これを revokeObjectURL で明示的に解放しないと、
// ブラウザがメモリを保持し続けてしまいます（小規模な使用では大きな問題になりにくいですが、適切な後片付けの習慣として重要です）。