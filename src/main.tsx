import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import App from './App.tsx';
import './index.css';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  const root = document.getElementById('root')!;
  root.innerHTML = `
    <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(to bottom right, #fef3c7, #fed7aa); padding: 1rem;">
      <div style="background: white; border-radius: 1rem; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); padding: 2rem; max-width: 42rem; width: 100%;">
        <h1 style="font-size: 1.5rem; font-weight: bold; color: #dc2626; margin-bottom: 1rem;">環境変数が設定されていません</h1>
        <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 0.5rem; padding: 1rem; margin-bottom: 1rem;">
          <p style="font-size: 0.875rem; color: #991b1b;">Vercelの環境変数が設定されていません</p>
        </div>
        <div style="font-size: 0.875rem; color: #4b5563; margin-bottom: 1rem;">
          <p style="margin-bottom: 0.5rem;">Vercelダッシュボードで以下の環境変数を設定してください：</p>
          <ul style="list-style-type: disc; margin-left: 2rem; margin-top: 0.5rem;">
            <li>VITE_SUPABASE_URL</li>
            <li>VITE_SUPABASE_ANON_KEY</li>
            <li>VITE_OPENWEATHER_API_KEY</li>
          </ul>
          <p style="margin-top: 1rem; padding: 0.75rem; background: #f3f4f6; border-radius: 0.375rem;">
            Settings → Environment Variables から追加できます。<br>
            追加後、再デプロイが必要です。
          </p>
        </div>
        <button
          onclick="window.location.reload()"
          style="margin-top: 1.5rem; background: #2563eb; color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; border: none; cursor: pointer; width: 100%; font-size: 1rem;"
          onmouseover="this.style.background='#1d4ed8'"
          onmouseout="this.style.background='#2563eb'"
        >
          再読み込み
        </button>
      </div>
    </div>
  `;
} else {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ErrorBoundary>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ErrorBoundary>
    </StrictMode>
  );
}
