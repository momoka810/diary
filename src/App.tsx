import { useState } from 'react';
import { Calendar, List, Settings, LogOut } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import { AuthScreen } from './components/AuthScreen';
import { WeatherBackground } from './components/WeatherBackground';
import { DiaryForm } from './components/DiaryForm';
import { EntryList } from './components/EntryList';
import { CalendarView } from './components/CalendarView';
import { CustomEmotionManager } from './components/CustomEmotionManager';

type ViewMode = 'list' | 'calendar' | 'settings';

function App() {
  const { user, loading, signOut } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  const [emotionRefreshKey, setEmotionRefreshKey] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const handleEntrySaved = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleEmotionUpdate = () => {
    setEmotionRefreshKey((prev) => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <p className="text-gray-600">読み込み中...</p>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen relative">
      <WeatherBackground />

      <button
        onClick={signOut}
        className="fixed top-6 left-6 z-50 bg-white/70 backdrop-blur-md rounded-xl px-4 py-2 shadow-lg border border-white/60 hover:bg-white/80 transition-all flex items-center gap-2 text-gray-700"
      >
        <LogOut className="w-4 h-4" />
        <span className="text-sm">ログアウト</span>
      </button>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <DiaryForm onSaved={handleEntrySaved} emotionRefreshKey={emotionRefreshKey} />

        <div className="mt-12 flex justify-center gap-3 flex-wrap">
          <button
            onClick={() => setViewMode('list')}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all
              ${viewMode === 'list'
                ? 'bg-gray-700 text-white shadow-lg'
                : 'bg-white/50 text-gray-700 hover:bg-white/70'
              }
            `}
          >
            <List className="w-5 h-5" />
            リスト
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all
              ${viewMode === 'calendar'
                ? 'bg-gray-700 text-white shadow-lg'
                : 'bg-white/50 text-gray-700 hover:bg-white/70'
              }
            `}
          >
            <Calendar className="w-5 h-5" />
            カレンダー
          </button>
          <button
            onClick={() => setViewMode('settings')}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all
              ${viewMode === 'settings'
                ? 'bg-gray-700 text-white shadow-lg'
                : 'bg-white/50 text-gray-700 hover:bg-white/70'
              }
            `}
          >
            <Settings className="w-5 h-5" />
            マイ表情
          </button>
        </div>

        {viewMode === 'list' && <EntryList refresh={refreshKey} />}
        {viewMode === 'calendar' && (
          <div className="mt-8">
            <CalendarView refresh={refreshKey} />
          </div>
        )}
        {viewMode === 'settings' && (
          <div className="mt-8 max-w-5xl mx-auto bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/60">
            <CustomEmotionManager onUpdate={handleEmotionUpdate} />
          </div>
        )}
      </div>

      <footer className="relative z-10 text-center py-8 text-sm text-gray-500">
        3秒日記 - 毎日続けられない人のための超シンプルな記録ツール
      </footer>
    </div>
  );
}

export default App;
