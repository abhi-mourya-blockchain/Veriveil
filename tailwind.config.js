/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        midnight: {
          950: '#030712',
          900: '#070d1e',
          850: '#0b142d',
          800: '#0f1c3f',
          700: '#172b5c',
          600: '#223e80',
          500: '#325bb5',
        },
        gold: {
          50: '#fffdf5',
          100: '#fef9e7',
          200: '#fcf0c3',
          300: '#f9e295',
          400: '#f5cd5a',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
        cyber: {
          cyan: '#00f0ff',
          neon: '#10b981',
          violet: '#8b5cf6',
          amber: '#f59e0b',
        }
      },
      backgroundImage: {
        'gold-metallic': 'linear-gradient(135deg, #fef08a 0%, #eab308 50%, #854d0e 100%)',
        'gold-shimmer': 'linear-gradient(90deg, #fef08a 0%, #facc15 25%, #ca8a04 50%, #facc15 75%, #fef08a 100%)',
        'midnight-radial': 'radial-gradient(circle at 50% 0%, #172b5c 0%, #070d1e 70%, #030712 100%)',
        'card-gradient': 'linear-gradient(180deg, rgba(15, 28, 63, 0.75) 0%, rgba(7, 13, 30, 0.85) 100%)',
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(234, 179, 8, 0.35)',
        'gold-glow-lg': '0 0 45px -5px rgba(234, 179, 8, 0.55)',
        'cyan-glow': '0 0 20px -3px rgba(0, 240, 255, 0.35)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s infinite ease-in-out',
        'shimmer': 'shimmer 3s infinite linear',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', filter: 'drop-shadow(0 0 8px rgba(234, 179, 8, 0.4))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 18px rgba(234, 179, 8, 0.8))' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
};
