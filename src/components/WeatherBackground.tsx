import { motion } from 'framer-motion';
import { useWeather, WeatherType } from '../hooks/useWeather';

const weatherColors: Record<WeatherType, string> = {
  sunny: 'from-amber-100 via-yellow-50 to-orange-100',
  cloudy: 'from-gray-200 via-slate-100 to-gray-200',
  rainy: 'from-blue-200 via-slate-200 to-blue-100',
  snowy: 'from-blue-50 via-white to-slate-100',
  default: 'from-amber-100 via-yellow-50 to-orange-100',
};

export function WeatherBackground() {
  const weather = useWeather();

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className={`fixed inset-0 bg-gradient-to-br ${weatherColors[weather.type]} -z-10`}
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="fixed top-6 right-6 z-50 bg-white/70 backdrop-blur-md rounded-2xl px-5 py-3 shadow-lg border border-white/60"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">
            {weather.type === 'sunny' && '☀️'}
            {weather.type === 'cloudy' && '☁️'}
            {weather.type === 'rainy' && '🌧️'}
            {weather.type === 'snowy' && '❄️'}
            {weather.type === 'default' && '🌤️'}
          </span>
          <div>
            <p className="text-sm font-medium text-gray-700">現在の天気</p>
            <p className="text-xs text-gray-600">{weather.description}</p>
          </div>
        </div>
      </motion.div>
    </>
  );
}
