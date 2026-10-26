/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'psygma-bg': '#F4F0E8',
        'psygma-surface': '#FBF9F4',
        'psygma-muted-surface': '#E9E5D9',
        'psygma-sage': '#A6B59A',
        'psygma-forest': '#34483A',
        'psygma-olive': '#777B51',
        'psygma-sand': '#D7C5AC',
        'psygma-earth': '#34483A',
        'psygma-text': '#292B26',
        'psygma-secondary': '#77766D',
        'psygma-muted': '#77766D',
        'psygma-border': '#E4DED2',
        'psygma-glass': 'rgba(251, 249, 244, 0.75)',
      },
      fontFamily: {
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
        sans: ['"Manrope"', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
