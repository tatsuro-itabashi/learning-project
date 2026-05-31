'use client'

interface GlobalErrorProps {
    error: Error & { digest?: string }
    reset: () => void
}

// global-error は layout.tsx ごと置き換えるため
// <html><body> を自前で書く必要がある
export default function RootError({ error, reset }: GlobalErrorProps) {
    return (
        <html lang="ja">
        <body>
            <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'sans-serif',
                textAlign: 'center',
                padding: '1rem',
            }}
            >
            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>💥</p>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                アプリケーションエラー
            </h1>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                {error.digest && `Error ID: ${error.digest}`}
            </p>
            <button
                onClick={reset}
                style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                }}
            >
                再試行する
            </button>
            </div>
        </body>
        </html>
    )
}