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
    extend: {},
  },
  plugins: [],
}