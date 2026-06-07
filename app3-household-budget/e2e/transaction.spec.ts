import { test, expect } from '@playwright/test'
import { loginAsTestUser } from './fixtures/auth'

test.describe('収支の記録', () => {
    // 各テストの前にログインを済ませておく
    test.beforeEach(async ({ page }) => {
        await loginAsTestUser(page)
    })

    test('収支を記録して一覧に表示され、削除できる', async ({ page }) => {
        // テストデータが他のテストと衝突しないよう、メモにユニークな文字列を含める
        const uniqueMemo = `E2Eテスト_${Date.now()}`

        // ───── 収支を記録 ─────
        await page.getByRole('button', { name: '＋ 収支を記録' }).click()

        await page.getByLabel('金額').fill('1500')
        await page.getByLabel('メモ').fill(uniqueMemo)
        await page.getByRole('button', { name: '記録する' }).click()

        // ───── 一覧に表示されることを確認 ─────
        const item = page.getByText(uniqueMemo)
        await expect(item).toBeVisible()

        // ───── 削除する ─────
        // 該当の行にマウスオーバーして削除ボタンを表示させてからクリック
        const row = page.locator('div').filter({ hasText: uniqueMemo }).first()
        await row.hover()

        // ★ 先にダイアログのリスナーを登録してから操作する
        page.once('dialog', (dialog) => void dialog.accept())
        await row.getByRole('button', { name: '削除' }).click()

        // ───── 一覧から消えたことを確認 ─────
        await expect(item).not.toBeVisible()

        // 確認ダイアログ（window.confirm）を自動的に「OK」する
        page.once('dialog', (dialog) => void dialog.accept())

        // ───── 一覧から消えたことを確認 ─────
        await expect(item).not.toBeVisible()
    })
})

// ポイント①：なぜ uniqueMemo でユニークな値を作るか
// E2Eテストは実際のDBに対して操作を行うため、
// 同じ条件で何度も実行すると過去のテストデータが残り、「期待した1件だけが表示される」というテストが書きにくくなります。
// Date.now() でユニークな文字列を作ることで、各テスト実行が独立し、お互いに干渉しません。

// ポイント②：page.once('dialog', ...) の役割
// window.confirm() はブラウザのネイティブダイアログで、
// 自動テストでは何もしないと処理が止まってしまいます。
// Playwright の dialog イベントをリッスンし、accept() を呼ぶことで、
// 「OK」を自動的にクリックした状態を再現できます。

// 注意
// 実際の confirm のタイミングと dialog リスナーの登録タイミングによっては、
// リスナー登録を削除ボタンクリックの前に置く必要がある場合があります。
// エラーが出たら、page.once('dialog', ...) を
// row.getByRole('button', { name: '削除' }).click() の直前に移動してみてください。