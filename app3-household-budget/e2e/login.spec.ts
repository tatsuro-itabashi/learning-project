import { test, expect } from '@playwright/test'

test.describe('ログインページ', () => {
    test('ログインフォームが表示される', async ({ page }) => {
        await page.goto('/login')

        // タイトルとフォーム要素が表示されていることを確認
        await expect(page.getByRole('heading', { name: '家計簿アプリ' })).toBeVisible()
        await expect(page.getByLabel('メールアドレス')).toBeVisible()
        await expect(page.getByLabel('パスワード')).toBeVisible()
        await expect(page.getByRole('button', { name: 'ログイン' })).toBeVisible()
    })

    test('未ログイン状態で /dashboard にアクセスすると /login にリダイレクトされる', async ({ page }) => {
        await page.goto('/dashboard')

        // ミドルウェアによるリダイレクトを確認（Day 22 で実装した認証保護）
        await page.waitForURL('/login')
        await expect(page.getByRole('heading', { name: '家計簿アプリ' })).toBeVisible()
    })
})

// ポイント：getByRole / getByLabel を優先する理由
// Playwright では page.locator('.css-class') のように
// CSS セレクタで要素を取得することもできますが、
// getByRole や getByLabel を使うと「ユーザーが実際に見て操作する単位」でテストを書けます。
// スタイル変更（クラス名の変更）に強く、アクセシビリティの観点でも適切な要素取得方法です。