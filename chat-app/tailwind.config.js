/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // ใช้คลาส 'dark' เพื่อเปิดใช้งาน dark mode
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }], // 10px
        '3xs': ['0.5rem', { lineHeight: '0.625rem' }],  // 8px
      },
    },
  },
  plugins: [],
}
