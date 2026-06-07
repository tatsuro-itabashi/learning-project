// E2E テストで使うログイン処理を共通化したヘルパー
import 'dotenv/config'
import type { Page } from '@playwright/test'

const EMAIL = process.env.E2E_TEST_EMAIL ?? ''
const PASSWORD = process.env.E2E_TEST_PASSWORD ?? ''

// メール/パスワードでログインし、ダッシュボード遷移まで待つ
export async function loginAsTestUser(page: Page): Promise<void> {
    if (!EMAIL || !PASSWORD) {
        throw new Error(
            'E2E_TEST_EMAIL / E2E_TEST_PASSWORD が .env.local に設定されていません',
        )
    }

    await page.goto('/login')

    // Supabase Auth UI のフォーム要素を取得して入力
    await page.getByLabel('メールアドレス').fill(EMAIL)
    await page.getByLabel('パスワード').fill(PASSWORD)
    await page.getByRole('button', { name: 'ログイン' }).click()

    // ダッシュボードへの遷移完了を待つ（URLの変化で判定）
    await page.waitForURL('/dashboard')
}

// ポイント：なぜヘルパー関数として切り出すか
// 「ログイン」はほぼすべてのテストの前提条件になります。
// 各テストファイルに同じ処理を書くと、ログインフォームの構造が変わったときに何箇所も修正することになります。
// 共通化しておけば、修正箇所は1箇所で済みます（DRY原則）。