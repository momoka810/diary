# 3秒日記

毎日続けられない人のための、超シンプルな感情記録アプリ。

喜怒哀楽のアイコンをタップして、一言添えるだけ。それだけで日記が完成します。
自分で描いたオリジナルのアイコンも登録できます。

## 機能一覧

### 感情の記録
- **喜・怒・哀・楽・平** の5種類の感情アイコンから選ぶだけ
- 一言メモは任意（最大140文字）。アイコンだけでも記録できる
- 記録時の天気を自動取得して一緒に保存（OpenWeather API）

### カスタム表情
- 自分で描いたイラストやオリジナルアイコンを登録して使える
- 不要なデフォルトアイコンは非表示にカスタマイズ可能

### 記録の閲覧
| ビュー | 内容 |
|--------|------|
| リスト表示 | 過去の記録を時系列で一覧表示 |
| カレンダー表示 | 月ごとの感情の流れを俯瞰 |

### その他
- **天気連動背景** — 晴れ・曇り・雨・雪で背景が変化
- **ゲストモード** — ログインなしで localStorage に記録（お試し用）
- **認証** — Supabase Auth によるログイン対応

## 技術スタック

| 技術 | 用途 |
|------|------|
| React + TypeScript | UIフレームワーク |
| Vite | ビルドツール |
| Tailwind CSS | スタイリング |
| Framer Motion | アニメーション |
| Supabase | 認証 + データ永続化（PostgreSQL） |
| OpenWeather API | 天気情報の取得 |

## データベース設計

```
entries
├── id (uuid)
├── user_id (text)
├── emotion (joy | anger | sadness | pleasure | calm | custom)
├── custom_emotion_id (uuid, nullable)
├── note (text, nullable) ※140文字以内
├── weather (text, nullable)
└── created_at (timestamptz)

custom_emotions
├── id (uuid)
├── user_id (text)
├── name (text)
├── image_url (text)
└── created_at (timestamptz)

user_emotion_settings
├── user_id (text)
├── emotion (text)
└── is_enabled (boolean)
```

## ファイル構成

```
diary/
├── src/
│   ├── App.tsx                       # メインアプリ・ビュー切替
│   ├── components/
│   │   ├── DiaryForm.tsx             # 日記入力フォーム
│   │   ├── EmotionPicker.tsx         # 感情アイコン選択
│   │   ├── HandDrawnEmoji.tsx        # 手書き風アイコン描画
│   │   ├── EntryList.tsx             # 記録一覧
│   │   ├── CalendarView.tsx          # カレンダー表示
│   │   ├── CustomEmotionManager.tsx  # カスタム表情管理
│   │   ├── WeatherBackground.tsx     # 天気連動背景
│   │   └── AuthScreen.tsx            # 認証画面
│   ├── contexts/
│   │   └── AuthContext.tsx           # 認証 + ゲストモード管理
│   ├── hooks/
│   │   └── useWeather.ts             # 天気情報取得フック
│   └── lib/
│       └── supabase.ts               # Supabase クライアント
├── supabase/
│   └── migrations/                   # DBマイグレーション
└── vite.config.ts
```

## セットアップ

### 1. インストール

```bash
npm install
```

### 2. 環境変数の設定

`.env` ファイルを作成：

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENWEATHER_API_KEY=your_openweather_api_key  # 任意
```

- Supabase: https://supabase.com でプロジェクトを作成
- OpenWeather: https://openweathermap.org/api でAPIキーを取得（天気機能を使う場合）

### 3. データベースの初期化

Supabase の SQL Editor で `supabase/migrations/` 内のファイルを順番に実行してください。

### 4. 起動

```bash
npm run dev
```

## 作者

[ATELIER MOMO](https://momoka810.github.io/portfolio/)
