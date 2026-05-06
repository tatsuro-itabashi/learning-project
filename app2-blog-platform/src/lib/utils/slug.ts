/**
 * 日本語タイトルから URL に使える slug を生成する
 * 例: "TypeScript を学ぶ" → "typescript-2024-05-01-abc123"
 */
export function generateSlug(title: string): string {
    const date = new Date().toISOString().slice(0, 10)          // "2024-05-01"
    const random = Math.random().toString(36).slice(2, 8)       // "abc123"
    const sanitized = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')   // 英数字・スペース・ハイフン以外を除去
        .replace(/\s+/g, '-')           // スペースをハイフンに
        .slice(0, 30)                   // 先頭30文字
        .replace(/-+$/, '')             // 末尾ハイフンを除去

    return sanitized ? `${sanitized}-${date}-${random}` : `post-${date}-${random}`
}