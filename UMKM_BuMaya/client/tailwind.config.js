/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kupi: {
          orange: '#E8913A',
          'orange-hover': '#D57C26',
          'orange-light': '#FDF4EB',
          'orange-soft': '#FEEAD4',
          krem: '#FFF5E6',
          'krem-100': '#FFFDF9',
          'krem-200': '#FAEEE0',
          dark: '#4A2C0A',
          'dark-soft': '#694115',
          muted: '#8C5A2B',
          accentGreen: '#22C55E',
          accentRed: '#EF4444',
          accentYellow: '#F59E0B',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
