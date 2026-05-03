import { useEffect, type ReactNode } from 'react'

interface ModalProps {
    isOpen: boolean,
    onClose: () => void,
    title: string,
    children: ReactNode,
}

export function Modal({ isOpen, onClose, title, children}: ModalProps) {
    // Escapeキーでモーダルを閉じる
    useEffect(() => {
        if (!isOpen) return

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [isOpen, onClose])

    // body のスクロールを止める
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            aria-modal="true"
            role="dialog"
        >
            {/* オーバーレイ */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* モーダル本体 */}
            <div className="relative z-10 bg-white w-full max-w-lg mx-auto max-h-[92vh] flex flex-col
                rounded-t-2xl md:rounded-xl shadow-2xl
                fixed bottom-0 md:static">
            {/* ヘッダー */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="閉じる"
                >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                </button>
            </div>

            {/* コンテンツ */}
            <div className="overflow-y-auto flex-1 px-6 py-4">
                {children}
            </div>
            </div>
        </div>
    )
}