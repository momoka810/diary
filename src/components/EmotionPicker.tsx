import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { HandDrawnEmoji } from './HandDrawnEmoji';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export type EmotionType = 'joy' | 'anger' | 'sadness' | 'pleasure' | 'calm';

export interface SelectedEmotion {
  type: 'default' | 'custom';
  value: EmotionType | string;
}

interface CustomEmotion {
  id: string;
  name: string;
  image_url: string;
}

interface EmotionPickerProps {
  selectedEmotion: SelectedEmotion | null;
  onSelect: (emotion: SelectedEmotion) => void;
  refreshKey?: number;
}

const emotions: Array<{ type: EmotionType; label: string }> = [
  { type: 'joy', label: '喜' },
  { type: 'anger', label: '怒' },
  { type: 'sadness', label: '哀' },
  { type: 'pleasure', label: '楽' },
  { type: 'calm', label: '平' },
];

export function EmotionPicker({ selectedEmotion, onSelect, refreshKey }: EmotionPickerProps) {
  const { user, isGuestMode } = useAuth();
  const [customEmotions, setCustomEmotions] = useState<CustomEmotion[]>([]);
  const [emotionSettings, setEmotionSettings] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (user) {
      fetchCustomEmotions();
      fetchEmotionSettings();
    }
  }, [refreshKey, user]);

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
        emotions.forEach((emotion) => {
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
        emotions.forEach((emotion) => {
          const setting = data?.find((s) => s.emotion === emotion.type);
          settings[emotion.type] = setting ? setting.is_enabled : true;
        });

        setEmotionSettings(settings);
      }
    } catch (error) {
      console.error('表情設定の読み込みエラー:', error);
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-3 md:gap-6">
      {emotions
        .filter(({ type }) => emotionSettings[type] !== false)
        .map(({ type, label }) => {
          const isSelected = selectedEmotion?.type === 'default' && selectedEmotion.value === type;

          return (
          <motion.button
            key={type}
            type="button"
            onClick={() => onSelect({ type: 'default', value: type })}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            animate={
              isSelected
                ? {
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0],
                  }
                : {}
            }
            transition={{ duration: 0.3 }}
            className={`
              relative flex flex-col items-center gap-2 p-3 md:p-4 rounded-2xl
              transition-all duration-300
              ${isSelected ? 'bg-white/70 shadow-lg' : 'bg-white/30 hover:bg-white/50'}
            `}
          >
            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -inset-1 rounded-2xl border-3 border-gray-700"
                style={{
                  borderStyle: 'dashed',
                  borderWidth: '3px',
                }}
              />
            )}

            <HandDrawnEmoji emotion={type} size={48} />

            <span className="text-xs md:text-sm font-medium text-gray-700">
              {label}
            </span>
          </motion.button>
          );
        })}

      {customEmotions.map((emotion) => {
        const isSelected = selectedEmotion?.type === 'custom' && selectedEmotion.value === emotion.id;

        return (
          <motion.button
            key={emotion.id}
            type="button"
            onClick={() => onSelect({ type: 'custom', value: emotion.id })}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            animate={
              isSelected
                ? {
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0],
                  }
                : {}
            }
            transition={{ duration: 0.3 }}
            className={`
              relative flex flex-col items-center gap-2 p-3 md:p-4 rounded-2xl
              transition-all duration-300
              ${isSelected ? 'bg-white/70 shadow-lg' : 'bg-white/30 hover:bg-white/50'}
            `}
          >
            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -inset-1 rounded-2xl border-3 border-gray-700"
                style={{
                  borderStyle: 'dashed',
                  borderWidth: '3px',
                }}
              />
            )}

            <img
              src={emotion.image_url}
              alt={emotion.name}
              className="w-12 h-12 object-contain"
            />

            <span className="text-xs md:text-sm font-medium text-gray-700 truncate max-w-[60px]">
              {emotion.name}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
