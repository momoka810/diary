import { useState, useEffect } from 'react';

export type WeatherType = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'default';

interface WeatherData {
  type: WeatherType;
  description: string;
}

export function useWeather(): WeatherData {
  const [weather, setWeather] = useState<WeatherData>({
    type: 'default',
    description: '天気情報を取得中...',
  });

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const { latitude, longitude } = position.coords;
        const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

        if (!apiKey) {
          setWeather({ type: 'default', description: '晴れ' });
          return;
        }

        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&lang=ja`
        );

        if (!response.ok) {
          setWeather({ type: 'default', description: '晴れ' });
          return;
        }

        const data = await response.json();
        const weatherMain = data.weather[0].main.toLowerCase();
        const description = data.weather[0].description;

        let type: WeatherType = 'default';
        if (weatherMain.includes('clear')) {
          type = 'sunny';
        } else if (weatherMain.includes('cloud')) {
          type = 'cloudy';
        } else if (weatherMain.includes('rain') || weatherMain.includes('drizzle')) {
          type = 'rainy';
        } else if (weatherMain.includes('snow')) {
          type = 'snowy';
        }

        console.log('🌤️ 天気情報取得成功:', {
          weatherMain,
          description,
          type,
          location: data.name,
          temp: data.main.temp
        });

        setWeather({ type, description });
      } catch (error) {
        console.log('⚠️ 天気情報取得エラー:', error);
        setWeather({ type: 'default', description: '晴れ' });
      }
    };

    fetchWeather();
  }, []);

  return weather;
}
