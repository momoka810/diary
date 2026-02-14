# Vercelへのデプロイガイド

## 問題: 画面が真っ白になる

画面が真っ白になる最も一般的な原因は**環境変数が設定されていない**ことです。

## 解決方法

### 1. Vercelダッシュボードにアクセス
https://vercel.com/dashboard にアクセス

### 2. プロジェクトを選択
デプロイしたプロジェクトをクリック

### 3. Settings → Environment Variables に移動
左サイドバーの「Settings」→「Environment Variables」をクリック

### 4. 以下の環境変数を追加

#### VITE_SUPABASE_URL
```
https://fxstlilgyhwbcbnpgasq.supabase.co
```

#### VITE_SUPABASE_ANON_KEY
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4c3RsaWxneWh3YmNibnBnYXNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwMDYxOTQsImV4cCI6MjA4NjU4MjE5NH0.Yz9VJtqTxO4Fe4YqLjVINPfdoNY-LzPLLxGKXc_gEE4
```

#### VITE_OPENWEATHER_API_KEY
```
4490cdc1d67e026c49cd422e680d74ad
```

### 5. 環境変数の適用先を選択
- Production: ✅ チェック
- Preview: ✅ チェック
- Development: ✅ チェック（推奨）

### 6. 再デプロイ
環境変数を追加後、以下の手順で再デプロイが必要です：

1. 上部の「Deployments」タブをクリック
2. 最新のデプロイメントの右側にある「⋮」（3点メニュー）をクリック
3. 「Redeploy」を選択
4. 「Redeploy」ボタンをクリックして確認

### 7. 確認
再デプロイが完了したら、サイトにアクセスして正常に表示されるか確認してください。

## トラブルシューティング

### それでも真っ白な画面が表示される場合

1. **ブラウザの開発者ツールを開く**（F12）
2. **Console タブを確認**してエラーメッセージを確認
3. **Network タブを確認**して失敗しているリクエストがないか確認

### よくあるエラー

#### "Failed to load module"
→ ビルドエラーの可能性。Vercelのビルドログを確認してください。

#### "Supabase client not initialized"
→ 環境変数が正しく設定されていません。手順4を再確認してください。

#### CORS エラー
→ Supabaseの設定でドメインが許可されているか確認してください。

## サポート

問題が解決しない場合は、以下の情報を収集してください：
- Vercelのデプロイメントログ
- ブラウザのコンソールエラー
- Network タブのエラー
