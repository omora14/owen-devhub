import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sunset: {
          orange: '#E8650A',
          flame: '#F5831F',
          gold: '#FFAB00',
          amber: '#FF8C00',
        },
        ocean: {
          deep: '#080F1A',
          navy: '#0D1F35',
          mid: '#1A3050',
          light: '#2C4A6E',
        },
        sand: {
          DEFAULT: '#C4956A',
          light: '#E8D5B7',
          warm: '#F0EDE8',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'sunset-gradient': 'linear-gradient(135deg, #E8650A 0%, #FFAB00 50%, #FF8C00 100%)',
        'ocean-gradient': 'linear-gradient(180deg, #080F1A 0%, #0D1F35 50%, #1A3050 100%)',
        'hero-overlay': 'linear-gradient(to bottom, rgba(8,15,26,0.3) 0%, rgba(8,15,26,0.6) 60%, rgba(8,15,26,0.95) 100%)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'glow': 'glow 3s ease-in-out infinite',
        'wave': 'wave 8s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        glow: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        wave: {
          '0%, 100%': { transform: 'translateX(0) scaleY(1)' },
          '50%': { transform: 'translateX(-2%) scaleY(0.97)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

export default config
