'use strict'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  plugins: [],
  theme: {
    extend: {
      colors: {
        // https://tailwindcss.com/docs/customizing-colors#using-css-variables
        accent: 'hsl(var(--color-accent) / <alpha-value>)',
        primary: 'hsl(var(--color-primary) / <alpha-value>)',
      },
    },
  },
}
