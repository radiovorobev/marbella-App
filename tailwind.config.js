// tailwind.config.js
export default {
  important: '.admin-panel',
  content: [
    "./src/admin/**/*.{js,ts,jsx,tsx}",
  ],
  corePlugins: {
    preflight: false, 
  },
  theme: {
    extend: {},
  },
  plugins: [],
}