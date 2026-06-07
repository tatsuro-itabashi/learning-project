# App3（家計簿アプリ）デプロイ手順

App3 を Vercel に本番デプロイするための手順をまとめます。
App2 のデプロイ（`app2-blog-platform/docs/deploy-guide.md`）と基本的な流れは同じですが、
Supabase Auth のリダイレクトURL設定など、App3 特有の作業があるため、その点を中心に記載します。

---

## 0. 前提

- GitHub リポジトリへのプッシュが完了していること
- Vercel CLI がインストール・ログイン済みであること（`vercel --version` で確認）
- Supabase プロジェクトが作成済みで、`.env.local` に開発用の環境変数が設定済みであること

---

## 1. 本番ビルドの確認

デプロイ前に、ローカルで本番ビルドが通ることを確認します。

```bash
cd app3-household-budget
npm run build
```

**チェックポイント**

- 型エラーが出ていないか（`src/types/supabase.ts` が最新のテーブル定義に追従しているか）
- ESLint の警告でビルドが失敗していないか
- 環境変数が無い状態でもビルド自体は通るか（実行時エラーとビルドエラーの違いに注意）

---

## 2. GitHub にプッシュ

```bash
git add .
git commit -m "デプロイ準備"
git push origin main
```

---

## 3. Vercel プロジェクトを作成・連携

```bash
cd app3-household-budget
vercel link
```

対話形式での回答例：

```
? Set up and deploy "~/.../app3-household-budget"? [Y/n] y
? Which scope should contain your project? <自分のアカウント>
? Link to existing project? [y/N] n
? What's your project's name? app3-household-budget
? In which directory is your code located? ./
```

> App1・App2 とは別の Vercel プロジェクトとして作成します。1リポジトリ＝1プロジェクトの対応関係になるため、`learning-project` の各アプリフォルダごとに `vercel link` を実行する形になります。

---

## 4. 本番環境変数を登録

`.env.local` に書いている以下の値を、Vercel の **Production** 環境に登録します。

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
```

実行するとそれぞれ値の入力を求められるので、Supabase の値を貼り付けます。

開発時とプレビューデプロイでも同じ Supabase プロジェクトを使う場合は、以下も登録しておくと
プレビュー環境（PRごとのデプロイなど）でも動作確認ができます。

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL preview
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview
```

> **登録した環境変数は再デプロイしないと反映されません。** 環境変数を追加・変更した後は、必ず Step 5 のデプロイを（再）実行してください。

---

## 5. デプロイ

```bash
vercel --prod
```

完了すると、以下のような本番URLが発行されます。

```
https://app3-household-budget-xxxx.vercel.app
```

---

## 6. Supabase Auth の Redirect URL を設定（重要）

ここが App3 特有の作業です。アプリのログイン処理（`src/app/login/page.tsx`）では、
ログイン成功後に `redirectTo` で指定したURLへ遷移する仕組みになっています。
本番ドメインが Supabase 側の許可リストに登録されていないと、ログイン後の遷移が正しく機能しません。

1. Supabase ダッシュボード → **Authentication → URL Configuration** を開く
2. **Site URL** に本番URLを設定する

   ```
   https://app3-household-budget-xxxx.vercel.app
   ```

3. **Redirect URLs** に以下を追加する

   ```
   https://app3-household-budget-xxxx.vercel.app/**
   http://localhost:3000/**
   ```

   `/**` のワイルドカードにより、`/dashboard` や `/login` など配下のすべてのパスへの
   リダイレクトを許可しつつ、ローカル開発用の `localhost` も同時に有効にできます。

---

## 7. 本番動作確認チェックリスト

本番URLにアクセスし、以下を一通り確認します。

- [ ] `/login` が表示される
- [ ] ログインでき、`/dashboard` に遷移する
- [ ] 収支の登録・編集・削除ができる
- [ ] グラフ（月別棒グラフ・カテゴリ円グラフ）が表示される
- [ ] 予算設定・超過アラートが機能する
- [ ] CSVエクスポートができる
- [ ] 別タブを開き、リアルタイム同期が機能する

---

## 8. トラブルシューティング

| 症状 | 原因・対処 |
|---|---|
| ログイン後に `/dashboard` に遷移しない、またはエラー画面になる | Supabase の Redirect URL に本番ドメインが未登録。Step 6 を確認 |
| 「Your project's URL and Key are required ...」が出る | Vercel の環境変数が未設定、または登録後に再デプロイしていない |
| ローカルでは動くのに本番でデータが取得できない | RLS（Row Level Security）ポリシーが正しく設定されているか確認。`anon` キーでアクセスしている前提のポリシーになっているか |
| グラフ・予算など特定機能だけ動かない | 該当テーブル（`budgets` など）のマイグレーションが本番の Supabase プロジェクトに反映されているか確認 |
| デプロイ後に環境変数を変えても反映されない | `vercel env add` の後は必ず `vercel --prod` で再デプロイする |

---

## 9. 参考：再デプロイの基本コマンド

コードを変更して再デプロイする場合は、GitHub 連携済みであれば `git push` だけで
自動的にデプロイが走ります。手動で本番デプロイしたい場合は以下を使用します。

```bash
git push origin main      # GitHub 連携で自動デプロイされる場合
# または
vercel --prod             # 手動でデプロイする場合
```
