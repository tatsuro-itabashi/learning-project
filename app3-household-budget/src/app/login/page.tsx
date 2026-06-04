// ログインページ
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
    const router = useRouter()
    const supabase = createClient()

    // なぜここでログイン状態が変わったら /dashboard にリダイレクトするかを指定しているのか？
    // ログイン状態が変わったら、ログイン状態に応じて /dashboard にリダイレクトする
    // useEffect は React の副作用を管理するためのReactの機能の一つ
    // 副作用とは、コンポーネントの外部の状態を変更すること
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event) => {
                if (event === 'SIGNED_IN') router.push('/dashboard')
            },
        )
        return () => subscription.unsubscribe()
    }, [router, supabase])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-sm">
                <h1 className="text-xl font-bold text-gray-900 mb-6 text-center">
                    家計簿アプリ
                </h1>
                <Auth
                    supabaseClient={supabase}
                    appearance={{ theme: ThemeSupa }}
                    providers={['github']}
                    redirectTo={typeof window !== 'undefined' ? `${window.location.origin}/dashboard` : '/dashboard'}
                    localization={{
                        variables: {
                            sign_in: { email_label: 'メールアドレス', password_label: 'パスワード', button_label: 'ログイン' },
                            sign_up: { email_label: 'メールアドレス', password_label: 'パスワード', button_label: '新規登録' },
                        },
                    }}
                />
            </div>
        </div>
    )
}