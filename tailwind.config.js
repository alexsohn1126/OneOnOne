/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/*.html'
  ],
  theme: {
    extend: {
      colors: {
        'green-1': '#C2C5AA',
        'green-2': '#A4AC86',
        'green-3': '#656D4A',
        'green-4': '#414833',
        'green-5': '#333D29',
        'header': '#475569',
        'footer': '#475569',
        'active-link': '#CCFFDC',
        'non-active-link': '#C2C5AA',
      },
    },
  },
  plugins: [],
}

