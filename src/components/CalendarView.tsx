import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { EmotionType } from './EmotionPicker';
import { HandDrawnEmoji } from './HandDrawnEmoji';

interface Entry {
  id: string;
  emotion: EmotionType | 'custom';
  note: string | null;
  created_at: string;
  custom_emotion_id: string | null;
  custom_emotions?: {
    name: string;
    image_url: string;
  };
}

interface CalendarViewProps {
  refresh: number;
}

export function CalendarView({ refresh }: CalendarViewProps) {
  const { user, isGuestMode } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);

  useEffect(() => {
    const fetchEntries = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        if (isGuestMode) {
          const existingEntries = localStorage.getItem('guest_entries');
          const entries = existingEntries ? JSON.parse(existingEntries) : [];
          setEntries(entries);
        } else {
          const { data, error } = await supabase
            .from('entries')
            .select('*, custom_emotions(name, image_url)')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

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

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();

  const weeks: (number | null)[][] = [];
  let currentWeek: (number | null)[] = new Array(startDayOfWeek).fill(null);

  for (let day = 1; day <= daysInMonth; day++) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  const getEntriesForDay = (day: number): Entry[] => {
    const targetDate = new Date(year, month, day);
    return entries.filter((entry) => {
      const entryDate = new Date(entry.created_at);
      return (
        entryDate.getFullYear() === targetDate.getFullYear() &&
        entryDate.getMonth() === targetDate.getMonth() &&
        entryDate.getDate() === targetDate.getDate()
      );
    });
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const weekDays = ['日', '月', '火', '水', '木', '金', '土'];

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-5xl mx-auto"
    >
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-lg border border-white/60">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={goToPreviousMonth}
            className="p-2 hover:bg-white/50 rounded-xl transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>

          <h2 className="text-2xl font-medium text-gray-700">
            {year}年 {month + 1}月
          </h2>

          <button
            onClick={goToNextMonth}
            className="p-2 hover:bg-white/50 rounded-xl transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map((day, index) => (
            <div
              key={day}
              className={`text-center text-sm font-medium py-2 ${
                index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-gray-600'
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weeks.map((week, weekIndex) =>
            week.map((day, dayIndex) => {
              if (day === null) {
                return <div key={`empty-${weekIndex}-${dayIndex}`} className="aspect-square" />;
              }

              const dayEntries = getEntriesForDay(day);
              const hasEntries = dayEntries.length > 0;
              const isToday =
                day === new Date().getDate() &&
                month === new Date().getMonth() &&
                year === new Date().getFullYear();

              return (
                <motion.button
                  key={day}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedEntry(dayEntries[0] || null)}
                  className={`
                    aspect-square p-2 rounded-xl flex flex-col items-center justify-start gap-1
                    transition-all
                    ${isToday ? 'bg-amber-100 border-2 border-amber-400' : 'bg-white/40 hover:bg-white/60'}
                    ${hasEntries ? 'cursor-pointer' : 'cursor-default'}
                  `}
                >
                  <span
                    className={`text-sm font-medium ${
                      dayIndex === 0 ? 'text-red-500' : dayIndex === 6 ? 'text-blue-500' : 'text-gray-700'
                    }`}
                  >
                    {day}
                  </span>

                  {hasEntries && (
                    <div className="flex-1 flex items-center justify-center">
                      {dayEntries[0].emotion === 'custom' && dayEntries[0].custom_emotions ? (
                        <img
                          src={dayEntries[0].custom_emotions.image_url}
                          alt={dayEntries[0].custom_emotions.name}
                          className="w-7 h-7 object-contain"
                        />
                      ) : (
                        <HandDrawnEmoji emotion={dayEntries[0].emotion as EmotionType} size={30} />
                      )}
                    </div>
                  )}

                  {dayEntries.length > 1 && (
                    <div className="flex gap-0.5">
                      {Array.from({ length: Math.min(dayEntries.length - 1, 3) }).map((_, i) => (
                        <div key={i} className="w-1 h-1 bg-gray-400 rounded-full" />
                      ))}
                    </div>
                  )}
                </motion.button>
              );
            })
          )}
        </div>
      </div>

      {selectedEntry && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/60"
        >
          <div className="flex items-start gap-4">
            {selectedEntry.emotion === 'custom' && selectedEntry.custom_emotions ? (
              <img
                src={selectedEntry.custom_emotions.image_url}
                alt={selectedEntry.custom_emotions.name}
                className="w-12 h-12 object-contain flex-shrink-0"
              />
            ) : (
              <HandDrawnEmoji emotion={selectedEntry.emotion as EmotionType} size={50} />
            )}
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-2">
                {new Date(selectedEntry.created_at).toLocaleString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              {selectedEntry.note && (
                <p className="text-gray-700 whitespace-pre-wrap">{selectedEntry.note}</p>
              )}
            </div>
            <button
              onClick={() => setSelectedEntry(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
