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
          canvas: '#F8FAFC',       // Crisp enterprise off-white (slate-50)
          surface: '#FFFFFF',      // Pure white card/table background
          subtle: '#F1F5F9',       // Subtle table striping / hover (slate-100)
          border: '#E2E8F0',       // Crisp 1px enterprise border (slate-200)
          borderStrong: '#CBD5E1', // Pronounced border (slate-300)
          navy: '#0B2545',         // Official Indian Government Deep Navy
          navyDark: '#081D37',     // Darker Navy for mastheads
          navyLight: '#1E3A8A',    // Primary institutional blue
          blue: '#1D4ED8',         // Action blue
          sky: '#0284C7',          // Accent sky blue
          slate: '#334155',        // High-contrast slate body text (slate-700)
          slateDark: '#0F172A',    // Main headings (slate-900)
          muted: '#64748B',        // Secondary labels (slate-500)
          gold: '#D97706',         // Official Audit Gold / Amber
          saffron: '#FF9933',      // National Flag Saffron
          indiaGreen: '#138808',   // National Flag India Green
        },
        risk: {
          low: '#16A34A',          // Green-600
          medium: '#D97706',       // Amber-600
          high: '#EA580C',         // Orange-600
          critical: '#DC2626',     // Red-600
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace']
      },
      boxShadow: {
        'gov-sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'gov-card': '0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.08)',
        'gov-hover': '0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.06)',
        'gov-dropdown': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      }
    },
  },
  plugins: [],
}
