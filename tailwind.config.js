// tailwind.config.js
const typography = require('@tailwindcss/typography')
const forms = require('@tailwindcss/forms')
const aspectRatio = require('@tailwindcss/aspect-ratio')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {}
  },
  plugins: [
    typography,
    forms,
    aspectRatio
  ]
}