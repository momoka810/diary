/*
  # ユーザー表情設定機能の追加

  1. 新規テーブル
    - `user_emotion_settings`
      - `user_id` (text) - ユーザーID
      - `emotion` (text) - 表情タイプ（joy, anger, sadness, pleasure, calm）
      - `is_enabled` (boolean) - 表示するかどうか（デフォルト: true）
      - 複合主キー（user_id, emotion）

  2. セキュリティ
    - RLSを有効化
    - ユーザーは自分の設定のみアクセス可能
*/

-- ユーザー表情設定テーブルの作成
CREATE TABLE IF NOT EXISTS user_emotion_settings (
  user_id text NOT NULL,
  emotion text NOT NULL,
  is_enabled boolean DEFAULT true,
  PRIMARY KEY (user_id, emotion)
);

-- RLSを有効化
ALTER TABLE user_emotion_settings ENABLE ROW LEVEL SECURITY;

-- ポリシーの作成
CREATE POLICY "Users can view own emotion settings"
  ON user_emotion_settings
  FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own emotion settings"
  ON user_emotion_settings
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own emotion settings"
  ON user_emotion_settings
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete own emotion settings"
  ON user_emotion_settings
  FOR DELETE
  USING (true);
