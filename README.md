# 3秒日記

毎日続けられない人のための、超シンプルな感情記録アプリ。

喜怒哀楽のアイコンをタップして、一言添えるだけ。それだけで日記が完成します。自分で描いたオリジナルのアイコンも登録できます。

## 機能

- **感情アイコンで記録** — 喜怒哀楽など感情をアイコンで選ぶだけ
- **一言メモ** — テキストは任意。アイコンだけでもOK
- **カスタム表情** — 自分で描いたアイコンを登録して使える
- **リスト表示** — 過去の記録を一覧で確認
- **カレンダー表示** — 月ごとの感情の流れを俯瞰
- **天気背景** — その日の気分に合わせた背景演出
- **認証機能** — Supabaseによるログイン/ログアウト対応

## 技術スタック

| 技術 | 用途 |
|------|------|
| React + TypeScript | UIフレームワーク |
| Vite | ビルドツール |
| Tailwind CSS | スタイリング |
| Supabase | 認証 + データ永続化 |
| Framer Motion | アニメーション |

## ファイル構成

```
diary/
├── src/
│   ├── App.tsx                       # メインアプリ
│   ├── components/
│   │   ├── DiaryForm.tsx             # 日記入力フォーム
│   │   ├── EmotionPicker.tsx         # 感情アイコン選択
│   │   ├── EntryList.tsx             # 記録一覧
│   │   ├── CalendarView.tsx          # カレンダー表示
│   │   ├── CustomEmotionManager.tsx  # カスタム表情管理
│   │   └── WeatherBackground.tsx     # 天気背景
│   ├── contexts/
│   │   └── AuthContext.tsx           # 認証コンテキスト
│   └── hooks/                        # カスタムフック
├── supabase/                         # DBスキーマ
└── vite.config.ts
```

## セットアップ

```bash
npm install
```

`.env`ファイルを作成して Supabase の接続情報を設定：

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

```bash
npm run dev
```

## 作者

[ATELIER MOMO](https://momoka810.github.io/portfolio/)
