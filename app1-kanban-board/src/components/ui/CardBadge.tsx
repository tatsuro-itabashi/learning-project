interface CardBadgeProps {
    label: string
    color: string
    size?: 'sm' | 'xs'
}

export function CardBadge({ label, color, size = 'sm' }: CardBadgeProps) {
    const sizeClass = size === 'xs' ? 'text-xs px-1.5 py-0.5' : 'text-sm px-2 py-0.5'

    return (
        <span className={`inline-block rounded-full font-medium ${sizeClass} ${color}`}>
            {label}
        </span>
    )
}