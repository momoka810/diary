import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';
import { EmotionPicker, SelectedEmotion } from './EmotionPicker';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useWeather } from '../hooks/useWeather';

interface DiaryFormProps {
  onSaved: () => void;
  emotionRefreshKey?: number;
}

export function DiaryForm({ onSaved, emotionRefreshKey }: DiaryFormProps) {
  const { user, isGuestMode } = useAuth();
  const [selectedEmotion, setSelectedEmotion] = useState<SelectedEmotion | null>(null);
  const [note, setNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const weather = useWeather();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedEmotion) {
      return;
    }

    setIsSaving(true);

    try {
      if (!user) return;

      const entryData: any = {
        id: Date.now().toString(),
        user_id: user.id,
        note: note.trim() || null,
        weather: weather.description,
        created_at: new Date().toISOString(),
      };

      if (selectedEmotion.type === 'default') {
        entryData.emotion = selectedEmotion.value;
      } else {
        entryData.emotion = 'custom';
        entryData.custom_emotion_id = selectedEmotion.value;
      }

      if (isGuestMode) {
        const existingEntries = localStorage.getItem('guest_entries');
        const entries = existingEntries ? JSON.parse(existingEntries) : [];
        entries.unshift(entryData);
        localStorage.setItem('guest_entries', JSON.stringify(entries));
      } else {
        const { error } = await supabase.from('entries').insert(entryData);

        if (error) {
          throw error;
        }
      }

      setSelectedEmotion(null);
      setNote('');
      onSaved();
    } catch (error) {
      console.error('保存エラー:', error);
      alert('保存に失敗しました。もう一度お試しください。');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="w-full max-w-3xl mx-auto space-y-8"
    >
      <div className="text-center">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl md:text-4xl font-light text-gray-700 mb-2"
        >
          いま、どんな感じ？
        </motion.h1>
        <p className="text-sm text-gray-500">3秒で記録できます</p>
      </div>

      <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-lg border border-white/60">
        <div className="space-y-8">
          <EmotionPicker
            selectedEmotion={selectedEmotion}
            onSelect={setSelectedEmotion}
            refreshKey={emotionRefreshKey}
          />

          {selectedEmotion && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <label htmlFor="note" className="block text-sm text-gray-600">
                ひとこと（任意・140文字まで）
              </label>
              <textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value.slice(0, 140))}
                placeholder="今日の気持ちを自由に..."
                className="w-full h-24 px-4 py-3 rounded-xl bg-white/70 border-2 border-gray-200 focus:border-gray-400 focus:outline-none resize-none transition-colors text-gray-700"
                maxLength={140}
              />
              <div className="text-right text-xs text-gray-500">
                {note.length}/140
              </div>

              <motion.button
                type="submit"
                disabled={isSaving}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 px-6 bg-gray-700 hover:bg-gray-800 disabled:bg-gray-400 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors shadow-md"
              >
                <Save className="w-5 h-5" />
                {isSaving ? '保存中...' : '記録する'}
              </motion.button>
            </motion.div>
          )}

          {!selectedEmotion && (
            <p className="text-center text-sm text-gray-500">
              今の気持ちを選んでください
            </p>
          )}
        </div>
      </div>
    </motion.form>
  );
}
