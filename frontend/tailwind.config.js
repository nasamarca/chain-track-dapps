/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', 
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'chainTColors': {
          50: '#deffff',
          100: '#b3fffd',
          200: '#86fefa',
          300: '#5bfef9',
          400: '#40fef7',
          500: '#34e5de',
          600: '#24b2ac',
          700: '#147f7c',
          800: '#004442',
          900: '#001b1a',
        },
        'chainColors':{
          50: '#b4efb4',
          100: '#a4eba4',
          200: '#95e895',
          300: '#86e586',
          400: '#77e177',
          500: '#68de68',
          600: '#5ec85e',
          700: '#53b253',
          800: '#499b49',
          900: '#3e853e',
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}