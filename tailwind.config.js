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
        "background": '#f0f9ff',
        "background-dark": '#254e39ff',
        "primary": '#0369a1',
        "primary-dark": '#0369a1',
        "secondary": '#FFFFFE',
        "secondary-dark": '#254e39ff',
        "accent": '#FACC15',
        "accent-dark": '#FACC15',
        "success": '#48bb78',
        "success-dark": '#48bb78',
        "warning": '#ff9e28ff',
        "warning-dark": '#ff9d25ff',
        "error": '#ff4949ff',
        "error-dark": '#ff4949ff',
        "text": '#27272a',
        "text-light": "#f0f9ff",
        "text-dark": '#254e39ff',
      }
    },
  },
  plugins: [],
}