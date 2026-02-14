import { EmotionType } from './EmotionPicker';

interface HandDrawnEmojiProps {
  emotion: EmotionType;
  size?: number;
}

export function HandDrawnEmoji({ emotion, size = 60 }: HandDrawnEmojiProps) {
  const getEmoji = () => {
    switch (emotion) {
      case 'joy':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#FFA500"
              strokeWidth="3"
              fill="#FFF9E6"
              strokeLinecap="round"
              style={{
                filter: 'drop-shadow(2px 2px 3px rgba(0,0,0,0.1))',
              }}
            />
            <ellipse cx="35" cy="40" rx="5" ry="8" fill="#333" />
            <ellipse cx="65" cy="40" rx="5" ry="8" fill="#333" />
            <path
              d="M 30 60 Q 50 75 70 60"
              stroke="#333"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        );
      case 'anger':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#DC2626"
              strokeWidth="3"
              fill="#FFE6E6"
              strokeLinecap="round"
              style={{
                filter: 'drop-shadow(2px 2px 3px rgba(0,0,0,0.1))',
              }}
            />
            <line x1="28" y1="35" x2="42" y2="42" stroke="#333" strokeWidth="3" strokeLinecap="round" />
            <line x1="72" y1="35" x2="58" y2="42" stroke="#333" strokeWidth="3" strokeLinecap="round" />
            <ellipse cx="35" cy="45" rx="5" ry="6" fill="#333" />
            <ellipse cx="65" cy="45" rx="5" ry="6" fill="#333" />
            <path
              d="M 35 70 Q 50 62 65 70"
              stroke="#333"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        );
      case 'sadness':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#3B82F6"
              strokeWidth="3"
              fill="#E6F2FF"
              strokeLinecap="round"
              style={{
                filter: 'drop-shadow(2px 2px 3px rgba(0,0,0,0.1))',
              }}
            />
            <ellipse cx="35" cy="42" rx="5" ry="7" fill="#333" />
            <ellipse cx="65" cy="42" rx="5" ry="7" fill="#333" />
            <path
              d="M 35 70 Q 50 60 65 70"
              stroke="#333"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 38 32 Q 35 28 32 32"
              stroke="#333"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 68 32 Q 65 28 62 32"
              stroke="#333"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        );
      case 'pleasure':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#EC4899"
              strokeWidth="3"
              fill="#FFE6F0"
              strokeLinecap="round"
              style={{
                filter: 'drop-shadow(2px 2px 3px rgba(0,0,0,0.1))',
              }}
            />
            <path
              d="M 32 38 Q 35 32 38 38"
              stroke="#333"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 62 38 Q 65 32 68 38"
              stroke="#333"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
            <ellipse cx="35" cy="42" rx="4" ry="5" fill="#333" />
            <ellipse cx="65" cy="42" rx="4" ry="5" fill="#333" />
            <path
              d="M 32 62 Q 50 72 68 62"
              stroke="#333"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="28" cy="55" r="3" fill="#FFB6C1" opacity="0.6" />
            <circle cx="72" cy="55" r="3" fill="#FFB6C1" opacity="0.6" />
          </svg>
        );
      case 'calm':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#6B7280"
              strokeWidth="3"
              fill="#F5F5F5"
              strokeLinecap="round"
              style={{
                filter: 'drop-shadow(2px 2px 3px rgba(0,0,0,0.1))',
              }}
            />
            <ellipse cx="35" cy="42" rx="4" ry="5" fill="#333" />
            <ellipse cx="65" cy="42" rx="4" ry="5" fill="#333" />
            <line
              x1="35"
              y1="62"
              x2="65"
              y2="62"
              stroke="#333"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return <div className="inline-block">{getEmoji()}</div>;
}
