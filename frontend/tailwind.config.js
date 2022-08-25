/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontFamily: {
      display: ['Quicksand', 'sans-serif'],
      body: ['Quicksand', 'sans-serif'],
    },
    extend: {
      colors: {
        'primary' : '#333333',
        'secondary' : '#f7f7f8',
        'muted' : '#e8eaec'
      },
      fontSize: {
        14: '14px',
      },
      backgroundColor: {
        'primary' : '#333333',
        'secondary' : '#f7f7f8',
        'muted' : '#e8eaec'

      },
      borderWidth: {
        1: '1px',
      },
      borderColor: {
        'primary' : '#333333',
        'secondary' : '#f7f7f8',
        'muted' : '#e8eaec'
      },
      width: {
        400: '400px',
        760: '760px',
        780: '780px',
        800: '800px',
        1000: '1000px',
        1200: '1200px',
        1400: '1400px',
      },
      height: {
        80: '80px',
      },
      minHeight: {
        navbar : '4rem'
      }
    },
  },
  plugins: [require("@tailwindcss/forms")],
}
