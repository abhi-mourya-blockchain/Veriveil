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
        obsidian: {
          950: '#02040a',
          900: '#050914',
          850: '#091024',
          800: '#0d1836',
          700: '#15254f',
          600: '#1e356e',
        },
        midnight: {
          950: '#030712',
          900: '#070d1e',
          850: '#0b142d',
          800: '#0f1c3f',
          700: '#172b5c',
          600: '#223e80',
          500: '#325bb5',
        },
        celestial: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
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
        'arc-glow': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(56, 189, 248, 0.35), rgba(99, 102, 241, 0.15), rgba(3, 7, 18, 0) 70%)',
        'submerged-card': 'linear-gradient(180deg, rgba(14, 24, 52, 0.85) 0%, rgba(5, 9, 20, 0.95) 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.02) 100%)',
        'gold-metallic': 'linear-gradient(135deg, #fef08a 0%, #eab308 50%, #854d0e 100%)',
      },
      boxShadow: {
        'arc-light': '0 -10px 50px 10px rgba(56, 189, 248, 0.4)',
        'blue-glow': '0 0 35px -5px rgba(56, 189, 248, 0.35)',
        'glass-card': '0 20px 50px rgba(0, 0, 0, 0.7), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
        'pill-glow': '0 0 25px rgba(255, 255, 255, 0.4)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s infinite ease-in-out',
        'shimmer-fast': 'shimmer 2.5s infinite linear',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', filter: 'drop-shadow(0 0 15px rgba(56, 189, 248, 0.4))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 30px rgba(56, 189, 248, 0.8))' },
        },
      }
    },
  },
  plugins: [],
}
;
