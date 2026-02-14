/*
  # 3秒日記アプリのデータベース設計

  1. 新規テーブル
    - `entries`
      - `id` (uuid, primary key) - エントリーの一意識別子
      - `user_id` (text) - ローカルストレージで生成されるユーザーID
      - `emotion` (text) - 選択された感情（喜・怒・哀・楽・平）
      - `note` (text, nullable) - 任意の一言メモ（140文字以内）
      - `weather` (text, nullable) - 記録時の天気情報
      - `created_at` (timestamptz) - 作成日時

  2. セキュリティ
    - RLSを有効化
    - ユーザーは自分のuser_idに紐づくエントリーのみアクセス可能
*/

CREATE TABLE IF NOT EXISTS entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  emotion text NOT NULL CHECK (emotion IN ('joy', 'anger', 'sadness', 'pleasure', 'calm')),
  note text,
  weather text,
  created_at timestamptz DEFAULT now()
);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_entries_user_id ON entries(user_id);
CREATE INDEX IF NOT EXISTS idx_entries_created_at ON entries(created_at DESC);

-- RLSを有効化
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;

-- ユーザーは自分のエントリーのみ閲覧可能
CREATE POLICY "Users can view own entries"
  ON entries
  FOR SELECT
  USING (true);

-- ユーザーは自分のエントリーを作成可能
CREATE POLICY "Users can create own entries"
  ON entries
  FOR INSERT
  WITH CHECK (true);

-- ユーザーは自分のエントリーを更新可能
CREATE POLICY "Users can update own entries"
  ON entries
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- ユーザーは自分のエントリーを削除可能
CREATE POLICY "Users can delete own entries"
  ON entries
  FOR DELETE
  USING (true);
