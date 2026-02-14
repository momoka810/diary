/*
  # ユーザー認証機能の追加

  1. セキュリティ
    - 各テーブルでRLSポリシーを更新
    - 認証済みユーザーが自分のデータのみ操作できるポリシーを追加
    
  2. 重要な注意事項
    - user_idはtext型を使用（既存の構造を維持）
    - auth.uid()をtext型にキャストして比較
*/

-- entriesテーブルのRLSポリシー
DROP POLICY IF EXISTS "Users can view own entries" ON entries;
DROP POLICY IF EXISTS "Users can insert own entries" ON entries;
DROP POLICY IF EXISTS "Users can update own entries" ON entries;
DROP POLICY IF EXISTS "Users can delete own entries" ON entries;

CREATE POLICY "Users can view own entries"
  ON entries FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own entries"
  ON entries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own entries"
  ON entries FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own entries"
  ON entries FOR DELETE
  TO authenticated
  USING (auth.uid()::text = user_id);

-- custom_emotionsテーブルのRLSポリシー
DROP POLICY IF EXISTS "Users can view own emotions" ON custom_emotions;
DROP POLICY IF EXISTS "Users can insert own emotions" ON custom_emotions;
DROP POLICY IF EXISTS "Users can update own emotions" ON custom_emotions;
DROP POLICY IF EXISTS "Users can delete own emotions" ON custom_emotions;

CREATE POLICY "Users can view own emotions"
  ON custom_emotions FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own emotions"
  ON custom_emotions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own emotions"
  ON custom_emotions FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own emotions"
  ON custom_emotions FOR DELETE
  TO authenticated
  USING (auth.uid()::text = user_id);

-- user_emotion_settingsテーブルのRLSポリシーを更新
DROP POLICY IF EXISTS "Users can view own emotion settings" ON user_emotion_settings;
DROP POLICY IF EXISTS "Users can insert own emotion settings" ON user_emotion_settings;
DROP POLICY IF EXISTS "Users can update own emotion settings" ON user_emotion_settings;
DROP POLICY IF EXISTS "Users can delete own emotion settings" ON user_emotion_settings;

CREATE POLICY "Users can view own emotion settings"
  ON user_emotion_settings FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own emotion settings"
  ON user_emotion_settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own emotion settings"
  ON user_emotion_settings FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own emotion settings"
  ON user_emotion_settings FOR DELETE
  TO authenticated
  USING (auth.uid()::text = user_id);