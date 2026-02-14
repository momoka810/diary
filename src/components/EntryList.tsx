import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { EmotionType } from './EmotionPicker';
import { HandDrawnEmoji } from './HandDrawnEmoji';

interface Entry {
  id: string;
  emotion: EmotionType | 'custom';
  note: string | null;
  weather: string | null;
  created_at: string;
  custom_emotion_id: string | null;
  custom_emotions?: {
    name: string;
    image_url: string;
  };
}

const emotionLabels: Record<EmotionType, string> = {
  joy: '喜',
  anger: '怒',
  sadness: '哀',
  pleasure: '楽',
  calm: '平',
};

interface EntryListProps {
  refresh: number;
}

export function EntryList({ refresh }: EntryListProps) {
  const { user, isGuestMode } = useAuth();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        if (isGuestMode) {
          const existingEntries = localStorage.getItem('guest_entries');
          const entries = existingEntries ? JSON.parse(existingEntries) : [];
          setEntries(entries.slice(0, 30));
        } else {
          const { data, error } = await supabase
            .from('entries')
            .select('*, custom_emotions(name, image_url)')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(30);

          if (error) {
            throw error;
          }

          setEntries(data || []);
        }
      } catch (error) {
        console.error('読み込みエラー:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntries();
  }, [refresh, user, isGuestMode]);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">まだ記録がありません</p>
        <p className="text-sm text-gray-400 mt-2">今の気持ちを記録してみましょう</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto mt-12"
    >
      <h2 className="text-2xl font-light text-gray-700 mb-6 text-center">
        これまでの記録
      </h2>

      <div className="space-y-4">
        <AnimatePresence>
          {entries.map((entry, index) => {
            const date = new Date(entry.created_at);
            const formattedDate = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;

            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-white/60 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {entry.emotion === 'custom' && entry.custom_emotions ? (
                      <img
                        src={entry.custom_emotions.image_url}
                        alt={entry.custom_emotions.name}
                        className="w-12 h-12 object-contain"
                      />
                    ) : (
                      <HandDrawnEmoji emotion={entry.emotion as EmotionType} size={48} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-medium text-gray-700">
                        {entry.emotion === 'custom' && entry.custom_emotions
                          ? entry.custom_emotions.name
                          : emotionLabels[entry.emotion as EmotionType]}
                      </span>
                      <span className="text-sm text-gray-500">{formattedDate}</span>
                    </div>

                    {entry.note && (
                      <p className="text-gray-600 mb-2 whitespace-pre-wrap break-words">
                        {entry.note}
                      </p>
                    )}

                    {entry.weather && (
                      <p className="text-xs text-gray-400">天気: {entry.weather}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
