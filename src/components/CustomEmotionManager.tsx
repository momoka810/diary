import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Upload, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { EmotionType } from './EmotionPicker';
import { HandDrawnEmoji } from './HandDrawnEmoji';

export interface CustomEmotion {
  id: string;
  name: string;
  image_url: string;
}

interface CustomEmotionManagerProps {
  onUpdate: () => void;
}

const defaultEmotions: Array<{ type: EmotionType; label: string }> = [
  { type: 'joy', label: '喜' },
  { type: 'anger', label: '怒' },
  { type: 'sadness', label: '哀' },
  { type: 'pleasure', label: '楽' },
  { type: 'calm', label: '平' },
];

export function CustomEmotionManager({ onUpdate }: CustomEmotionManagerProps) {
  const { user, isGuestMode } = useAuth();
  const [customEmotions, setCustomEmotions] = useState<CustomEmotion[]>([]);
  const [emotionSettings, setEmotionSettings] = useState<Record<string, boolean>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [newEmotionName, setNewEmotionName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCustomEmotions();
      fetchEmotionSettings();
    }
  }, [user]);

  const fetchCustomEmotions = async () => {
    if (!user) return;

    try {
      if (isGuestMode) {
        const stored = localStorage.getItem('guest_custom_emotions');
        const emotions = stored ? JSON.parse(stored) : [];
        setCustomEmotions(emotions);
      } else {
        const { data, error } = await supabase
          .from('custom_emotions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setCustomEmotions(data || []);
      }
    } catch (error) {
      console.error('カスタム表情の読み込みエラー:', error);
    }
  };

  const fetchEmotionSettings = async () => {
    if (!user) return;

    try {
      if (isGuestMode) {
        const stored = localStorage.getItem('guest_emotion_settings');
        const settings = stored ? JSON.parse(stored) : {};
        const defaultSettings: Record<string, boolean> = {};
        defaultEmotions.forEach((emotion) => {
          defaultSettings[emotion.type] = settings[emotion.type] !== false;
        });
        setEmotionSettings(defaultSettings);
      } else {
        const { data, error } = await supabase
          .from('user_emotion_settings')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;

        const settings: Record<string, boolean> = {};
        defaultEmotions.forEach((emotion) => {
          const setting = data?.find((s) => s.emotion === emotion.type);
          settings[emotion.type] = setting ? setting.is_enabled : true;
        });

        setEmotionSettings(settings);
      }
    } catch (error) {
      console.error('表情設定の読み込みエラー:', error);
    }
  };

  const toggleDefaultEmotion = async (emotionType: EmotionType) => {
    if (!user) return;

    try {
      const newValue = !emotionSettings[emotionType];

      if (isGuestMode) {
        const newSettings = {
          ...emotionSettings,
          [emotionType]: newValue,
        };
        localStorage.setItem('guest_emotion_settings', JSON.stringify(newSettings));
        setEmotionSettings(newSettings);
      } else {
        const { error } = await supabase
          .from('user_emotion_settings')
          .upsert({
            user_id: user.id,
            emotion: emotionType,
            is_enabled: newValue,
          });

        if (error) throw error;

        setEmotionSettings((prev) => ({
          ...prev,
          [emotionType]: newValue,
        }));
      }

      onUpdate();
    } catch (error) {
      console.error('表情設定の更新エラー:', error);
      alert('設定の更新に失敗しました');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('画像サイズは2MB以下にしてください');
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert('画像ファイルを選択してください');
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!user || !selectedFile || !newEmotionName.trim()) {
      alert('名前と画像を選択してください');
      return;
    }

    setIsUploading(true);

    try {
      if (isGuestMode) {
        const newEmotion: CustomEmotion = {
          id: Date.now().toString(),
          name: newEmotionName.trim(),
          image_url: previewUrl || '',
        };

        const stored = localStorage.getItem('guest_custom_emotions');
        const emotions = stored ? JSON.parse(stored) : [];
        emotions.unshift(newEmotion);
        localStorage.setItem('guest_custom_emotions', JSON.stringify(emotions));
      } else {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('emotion-images')
          .upload(fileName, selectedFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('emotion-images')
          .getPublicUrl(fileName);

        const { error: insertError } = await supabase
          .from('custom_emotions')
          .insert({
            user_id: user.id,
            name: newEmotionName.trim(),
            image_url: publicUrl,
          });

        if (insertError) throw insertError;
      }

      setNewEmotionName('');
      setSelectedFile(null);
      setPreviewUrl(null);
      setIsAdding(false);
      await fetchCustomEmotions();
      onUpdate();
    } catch (error) {
      console.error('アップロードエラー:', error);
      alert('アップロードに失敗しました');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (emotion: CustomEmotion) => {
    if (!confirm(`「${emotion.name}」を削除しますか？`)) {
      return;
    }

    try {
      if (isGuestMode) {
        const stored = localStorage.getItem('guest_custom_emotions');
        const emotions = stored ? JSON.parse(stored) : [];
        const filtered = emotions.filter((e: CustomEmotion) => e.id !== emotion.id);
        localStorage.setItem('guest_custom_emotions', JSON.stringify(filtered));
      } else {
        const fileName = emotion.image_url.split('/').slice(-2).join('/');

        await supabase.storage
          .from('emotion-images')
          .remove([fileName]);

        const { error } = await supabase
          .from('custom_emotions')
          .delete()
          .eq('id', emotion.id);

        if (error) throw error;
      }

      await fetchCustomEmotions();
      onUpdate();
    } catch (error) {
      console.error('削除エラー:', error);
      alert('削除に失敗しました');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-medium text-gray-700 mb-4">基本の表情</h3>
        <p className="text-sm text-gray-500 mb-4">
          表示したい表情をオンにしてください
        </p>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
          {defaultEmotions.map((emotion) => {
            const isEnabled = emotionSettings[emotion.type] !== false;

            return (
              <motion.button
                key={emotion.type}
                onClick={() => toggleDefaultEmotion(emotion.type)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  relative bg-white/50 rounded-xl p-4 transition-all
                  ${isEnabled ? 'opacity-100' : 'opacity-40'}
                `}
              >
                <div className="flex flex-col items-center gap-2">
                  <HandDrawnEmoji emotion={emotion.type} size={48} />
                  <span className="text-sm font-medium text-gray-700">
                    {emotion.label}
                  </span>
                </div>
                <div className="absolute top-2 right-2">
                  {isEnabled ? (
                    <Eye className="w-4 h-4 text-green-600" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-gray-300 pt-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-medium text-gray-700">自分で追加した表情</h3>
            <p className="text-sm text-gray-500 mt-1">
              自分で描いた表情を追加できます
            </p>
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            追加
          </button>
        </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white/60 rounded-2xl p-6 space-y-4"
          >
            <div>
              <label htmlFor="emotion-name" className="block text-sm font-medium text-gray-700 mb-2">
                表情の名前
              </label>
              <input
                id="emotion-name"
                type="text"
                value={newEmotionName}
                onChange={(e) => setNewEmotionName(e.target.value)}
                placeholder="例: わくわく、モヤモヤ"
                className="w-full px-4 py-2 rounded-xl bg-white/70 border-2 border-gray-200 focus:border-gray-400 focus:outline-none"
                maxLength={20}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                画像を選択（2MB以下）
              </label>
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-gray-400 transition-colors"
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="プレビュー"
                    className="h-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">クリックして画像を選択</span>
                  </div>
                )}
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleUpload}
                disabled={isUploading || !selectedFile || !newEmotionName.trim()}
                className="flex-1 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-800 disabled:bg-gray-300 transition-colors"
              >
                {isUploading ? '保存中...' : '保存'}
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setNewEmotionName('');
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}
                className="px-6 py-2 bg-white/70 text-gray-700 rounded-xl hover:bg-white transition-colors"
              >
                キャンセル
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
        {customEmotions.map((emotion) => (
          <motion.div
            key={emotion.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="relative bg-white/50 rounded-xl p-3 group"
          >
            <img
              src={emotion.image_url}
              alt={emotion.name}
              className="w-full aspect-square object-contain rounded-lg mb-2"
            />
            <p className="text-center text-sm text-gray-700 truncate">
              {emotion.name}
            </p>
            <button
              onClick={() => handleDelete(emotion)}
              className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </div>

        {customEmotions.length === 0 && !isAdding && (
          <p className="text-center text-gray-500 py-8">
            まだ追加した表情がありません
          </p>
        )}
      </div>
    </div>
  );
}
