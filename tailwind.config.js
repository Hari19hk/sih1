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
        space: {
          950: '#060911',
          900: '#0B0F19',
          800: '#111827',
          700: '#1F2937',
          600: '#374151'
        },
        accent: {
          cyan: '#06B6D4',
          indigo: '#6366F1',
          crimson: '#EF4444',
          solar: '#F97316',
          emerald: '#10B981',
          amber: '#EAB308'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace']
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
      }
    },
  },
  plugins: [],
}
