# Vercel デプロイ手順書

App2 フルスタックブログプラットフォームを Vercel + Supabase に本番デプロイする手順。

---

## 前提条件

- [ ] GitHub アカウントを持っている
- [ ] Vercel アカウントを持っている（GitHub でログイン可）
- [ ] Supabase プロジェクトが作成済みで接続文字列を持っている
- [ ] `npm run build` がローカルでエラーなく通っている

---

## 1. ビルド確認

```bash
cd app2-blog-platform
npm run build
```

エラーがある場合はデプロイ前に必ず解消する。

---

## 2. GitHub にプッシュ

### 初回の場合

```bash
git init
git add .
git commit -m "feat: initial commit"

# GitHub で app2-blog-platform リポジトリを作成後
git remote add origin https://github.com/<ユーザー名>/app2-blog-platform.git
git branch -M main
git push -u origin main
```

### 2回目以降

```bash
git add .
git commit -m "コミットメッセージ"
git push origin main
```

---

## 3. GitHub OAuth アプリを本番用に作成

1. `https://github.com/settings/developers` を開く
2. **「New OAuth App」** をクリック
3. 以下を入力して「Register application」：

   | 項目 | 値 |
   |------|---|
   | Application name | `app2-blog-platform（本番）` |
   | Homepage URL | `https://（Vercel のドメイン）` ※後で設定 |
   | Authorization callback URL | `https://（Vercel のドメイン）/api/auth/callback/github` |

4. 「Generate a new client secret」をクリック
5. **Client ID** と **Client Secret** を控えておく（Secret は一度しか表示されない）

> ⚠️ ローカル用（localhost:3000）と本番用は別の OAuth アプリが必要。
> callback URL のドメインが異なるため。

---

## 4. Vercel CLI のインストール・ログイン

```bash
# インストール（未インストールの場合）
npm i -g vercel@latest

# ログイン
vercel login
# ブラウザが開くので GitHub でログイン
```

---

## 5. Vercel プロジェクトを作成・リンク

```bash
# app2-blog-platform ディレクトリで実行
vercel link
```

対話形式の回答：

```
? Set up and deploy? → No（設定だけ先にする）
? Which scope? → 自分のアカウント名
? Link to existing project? → No
? What's your project's name? → app2-blog-platform
? In which directory is your code located? → ./
```

---

## 6. 環境変数を Vercel に登録

以下のコマンドを1つずつ実行する。
実行するとプロンプトで値の入力を求められる。

```bash
# Supabase の接続文字列（Direct タブの URI）
vercel env add DATABASE_URL production
# 入力例: postgresql://postgres:[PASSWORD]@db.xxxx.supabase.co:5432/postgres

# DIRECT_URL（DATABASE_URL と同じ値で OK）
vercel env add DIRECT_URL production

# AUTH_SECRET（ランダム文字列を生成して使う）
openssl rand -base64 32
# ↑ の出力をコピーして以下に貼り付ける
vercel env add AUTH_SECRET production

# GitHub OAuth（本番用アプリの値）
vercel env add AUTH_GITHUB_ID production
vercel env add AUTH_GITHUB_SECRET production
```

### 登録確認

```bash
vercel env ls production
```

5つの環境変数が表示されれば OK。

---

## 7. 本番デプロイ

```bash
vercel --prod
```

完了後に表示される URL（例: `https://app2-blog-platform.vercel.app`）を控える。

---

## 8. GitHub OAuth の callback URL を更新

1. `https://github.com/settings/developers` → 手順3で作成したアプリを選択
2. 以下を **本番 URL** に更新：

   ```
   Homepage URL:
     https://app2-blog-platform.vercel.app

   Authorization callback URL:
     https://app2-blog-platform.vercel.app/api/auth/callback/github
   ```

3. 「Update application」をクリック

---

## 9. 本番 DB にマイグレーションを実行

Vercel の環境変数をローカルに引っ張ってきてマイグレーションを実行する。

```bash
# Vercel の環境変数をローカルファイルに書き出す
vercel env pull .env.production.local

# 本番 DB にマイグレーションを適用
npx dotenv -e .env.production.local -- npx prisma migrate deploy
```

成功メッセージが表示されれば OK。

```
The following migration(s) have been applied:
  migrations/xxxxx_init/migration.sql
```

> **`migrate deploy` と `migrate dev` の違い**
> - `migrate dev`：ローカル開発用。マイグレーションファイルを新規生成して適用する。
> - `migrate deploy`：本番用。既存のマイグレーションファイルだけを適用する（生成しない）。

---

## 10. 動作確認

| 確認項目 | URL |
|---------|-----|
| トップページが表示される | `https://（本番URL）/` |
| ログインページが表示される | `https://（本番URL）/login` |
| GitHub ログインが通る | ログインボタンをクリック |
| 記事を投稿できる | ログイン後に「記事を書く」 |
| 404 が表示される | `https://（本番URL）/xxxxx` |

---

## 11. 2回目以降のデプロイ

コードを変更して GitHub にプッシュするだけで自動デプロイされる。

```bash
git add .
git commit -m "変更内容"
git push origin main
# → Vercel が自動でビルド・デプロイを実行
```

手動でデプロイする場合：

```bash
vercel --prod
```

---

## トラブルシューティング

| 症状 | 原因 | 対処 |
|------|------|------|
| ログインが無限ループする | `AUTH_SECRET` が未設定 | `vercel env add AUTH_SECRET production` を実行 |
| `redirect_uri_mismatch` エラー | OAuth の callback URL が間違っている | GitHub OAuth アプリの callback URL を本番 URL に修正 |
| DB 接続エラー | `DATABASE_URL` が間違っている or マイグレーション未実行 | 手順9のマイグレーションを実行 |
| ビルドエラーでデプロイ失敗 | 型エラーなど | `npm run build` をローカルで通してから再デプロイ |
| 環境変数が反映されない | デプロイ前に登録した変数が古い | `vercel --prod` で再デプロイ |

---

## 関連リンク

- Vercel ダッシュボード: `https://vercel.com/dashboard`
- Supabase ダッシュボード: `https://supabase.com/dashboard`
- GitHub OAuth Apps: `https://github.com/settings/developers`
- デプロイ済みアプリ: `https://（本番URL）`
