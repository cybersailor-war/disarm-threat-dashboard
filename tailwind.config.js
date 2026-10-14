/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#090A0F',
        surface: {
          DEFAULT: '#111827',
          darker: '#0B0F19',
          card: '#0f172a',
          hover: '#1e293b',
          muted: '#1e293b',
        },
        border: 'rgba(255, 255, 255, 0.08)',
        tactical: {
          cyan: '#38BDF8',
          blue: '#0284C7',
          crimson: '#EF4444',
          amber: '#F59E0B',
          emerald: '#10B981',
          violet: '#8B5CF6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -5px rgba(56, 189, 248, 0.25)',
        'glow-crimson': '0 0 20px -5px rgba(239, 68, 68, 0.25)',
        'tactical': '0 4px 20px -2px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.06)',
      },
    },
  },
  plugins: [],
};
