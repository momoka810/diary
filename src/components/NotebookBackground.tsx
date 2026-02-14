import { motion } from 'framer-motion';
import { useWeather, WeatherType } from '../hooks/useWeather';

const weatherColors: Record<WeatherType, string> = {
  sunny: '#FFF9E6',
  cloudy: '#F5F5F5',
  rainy: '#E8F4F8',
  snowy: '#F0F8FF',
  default: '#FFF9E6',
};

export function NotebookBackground() {
  const weather = useWeather();
  const bgColor = weatherColors[weather.type];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="fixed inset-0 -z-10"
      style={{ backgroundColor: bgColor }}
    >
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="lines" width="100%" height="40" patternUnits="userSpaceOnUse">
            <line
              x1="0"
              y1="39"
              x2="100%"
              y2="39"
              stroke="#D1D5DB"
              strokeWidth="1"
              opacity="0.5"
            />
          </pattern>

          <pattern id="margin" width="100%" height="40" patternUnits="userSpaceOnUse">
            <line
              x1="80"
              y1="0"
              x2="80"
              y2="40"
              stroke="#FCA5A5"
              strokeWidth="2"
              opacity="0.3"
            />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#lines)" />
        <rect width="100%" height="100%" fill="url(#margin)" />

        <g className="ring-holes">
          {[120, 280, 440, 600].map((y, i) => (
            <g key={i}>
              <circle
                cx="40"
                cy={y}
                r="8"
                fill="white"
                stroke="#9CA3AF"
                strokeWidth="2"
              />
              <circle
                cx="40"
                cy={y}
                r="4"
                fill="#E5E7EB"
              />
            </g>
          ))}
        </g>
      </svg>

      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/5 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
    </motion.div>
  );
}
