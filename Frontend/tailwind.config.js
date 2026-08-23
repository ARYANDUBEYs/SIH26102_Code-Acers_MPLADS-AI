/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gov: {
          darkest: '#0B1220',
          dark: '#111827',
          card: '#1E293B',
          cardLight: '#0F172A',
          border: '#334155',
          borderLight: '#1E293B',
          blue: '#2563EB',
          lightBlue: '#3B82F6',
          accent: '#06B6D4',
          gold: '#F59E0B',
          saffron: '#FF9933',
          indiaGreen: '#138808'
        },
        risk: {
          low: '#22C55E',
          medium: '#EAB308',
          high: '#F97316',
          critical: '#EF4444'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace']
      },
      boxShadow: {
        'glow-blue': '0 0 20px -5px rgba(37, 99, 235, 0.4)',
        'glow-red': '0 0 20px -5px rgba(239, 68, 68, 0.4)',
        'glow-orange': '0 0 20px -5px rgba(249, 115, 22, 0.4)',
        'glow-green': '0 0 20px -5px rgba(34, 197, 94, 0.4)',
        'card-dark': '0 4px 20px -2px rgba(0, 0, 0, 0.5)'
      }
    },
  },
  plugins: [],
}
