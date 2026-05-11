/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary:      '#F97316',   // orange — fire / energy
        'primary-light': '#FB923C',
        secondary:    '#FBBF24',   // amber — flame tips
        accent:       '#EF4444',   // red — danger / emphasis
        danger:       '#EF4444',
        success:      '#22C55E',
        dark:         '#0D0D0D',
        'dark-card':  '#141414',
        'dark-card2': '#1C1C1C',
        'dark-border':'#262626',
        'dark-muted': '#2A2A2A',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      animation: {
        'glow-pulse': 'glow-pulse 2.5s ease-in-out infinite',
        'float':      'float 6s ease-in-out infinite',
        'shimmer':    'shimmer 1.8s infinite linear',
        'scan-line':  'scan-line 3s linear infinite',
        'fade-in':    'fade-in 0.5s ease forwards',
        'slide-up':   'slide-up 0.5s ease forwards',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(249,115,22,0.45)' },
          '50%':      { boxShadow: '0 0 55px rgba(249,115,22,0.85)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-18px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition:  '1000px 0' },
        },
        'scan-line': {
          '0%':   { top: '0%', opacity: '0' },
          '10%':  { opacity: '1' },
          '90%':  { opacity: '1' },
          '100%': { top: '100%', opacity: '0' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
