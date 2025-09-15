/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./App.tsx", 
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'background': '#FFFFFE',
        'background-dark': '#254e39ff',
        'primary': '#FFFFFE',
        'primary-dark': '#254e39ff',
        'secondary': '#FFFFFE',
        'secondary-dark': '#254e39ff',
        'accent': '#FACC15',
        'accent-dark': '#FACC15',
        'success': '#FFFFFE',
        'success-dark': '#254e39ff',
        'error': '#FFFFFE',
        'error-dark': '#254e39ff',
        'text': '#27272A',
        'text-dark': '#254e39ff'
      }
    },
  },
  plugins: [],
}