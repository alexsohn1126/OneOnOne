/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        'green-1': '#C2C5AA',
        'green-2': '#A4AC86',
        'green-3': '#656D4A',
        'green-4': '#414833',
        'green-5': '#333D29',
        'header': '#333D29',
        'footer': '#333D29',
        'active-link': '#FFFFFF',
        'non-active-link': '#dee0d1',
        'hover-nav-link': '#CCFFDC'
      },
    },
  },
  plugins: [],
}
