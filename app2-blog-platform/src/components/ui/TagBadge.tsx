import Link from 'next/link'

interface TagBadgeProps {
    name: string
    size?: 'sm' | 'md'
    // リンクにするかどうか（詳細ページでは href なし、タグ一覧ではリンクあり）
    asLink?: boolean
}

export function TagBadge({ name, size = 'sm', asLink = true }: TagBadgeProps) {
    const className =
        size === 'sm'
            ? 'px-2 py-0.5 text-xs rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors'
            : 'px-3 py-1 text-sm rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors'

    if (!asLink) {
        return <span className={className}>{name}</span>
    }

    return (
        <Link href={`/tags/${encodeURIComponent(name)}`} className={className}>
            {name}
        </Link>
    )
}