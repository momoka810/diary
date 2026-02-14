/*
  # カスタム表情機能の追加

  1. 新規テーブル
    - `custom_emotions`
      - `id` (uuid, primary key) - カスタム表情の一意識別子
      - `user_id` (text) - ユーザーID
      - `name` (text) - 表情の名前
      - `image_url` (text) - Storageに保存された画像のURL
      - `created_at` (timestamptz) - 作成日時

  2. Storageバケット
    - `emotion-images` - カスタム表情の画像を保存するバケット

  3. エントリーテーブルの更新
    - `custom_emotion_id` (uuid, nullable) - カスタム表情への参照

  4. セキュリティ
    - RLSを有効化
    - ユーザーは自分のカスタム表情のみアクセス可能
*/

-- カスタム表情テーブルの作成
CREATE TABLE IF NOT EXISTS custom_emotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  name text NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_custom_emotions_user_id ON custom_emotions(user_id);

-- RLSを有効化
ALTER TABLE custom_emotions ENABLE ROW LEVEL SECURITY;

-- ポリシーの作成
CREATE POLICY "Users can view own custom emotions"
  ON custom_emotions
  FOR SELECT
  USING (true);

CREATE POLICY "Users can create own custom emotions"
  ON custom_emotions
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own custom emotions"
  ON custom_emotions
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete own custom emotions"
  ON custom_emotions
  FOR DELETE
  USING (true);

-- エントリーテーブルにカスタム表情IDを追加
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'entries' AND column_name = 'custom_emotion_id'
  ) THEN
    ALTER TABLE entries ADD COLUMN custom_emotion_id uuid REFERENCES custom_emotions(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Storageバケットの作成
INSERT INTO storage.buckets (id, name, public)
VALUES ('emotion-images', 'emotion-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storageのポリシー削除と再作成（既存のものがあればスキップ）
DO $$
BEGIN
  DROP POLICY IF EXISTS "Anyone can view emotion images" ON storage.objects;
  DROP POLICY IF EXISTS "Users can upload emotion images" ON storage.objects;
  DROP POLICY IF EXISTS "Users can update own emotion images" ON storage.objects;
  DROP POLICY IF EXISTS "Users can delete own emotion images" ON storage.objects;
END $$;

-- Storageのポリシー設定
CREATE POLICY "Anyone can view emotion images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'emotion-images');

CREATE POLICY "Users can upload emotion images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'emotion-images');

CREATE POLICY "Users can update own emotion images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'emotion-images');

CREATE POLICY "Users can delete own emotion images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'emotion-images');
