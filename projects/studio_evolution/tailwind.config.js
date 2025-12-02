/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./src/**/*.{html,js}",
    "./index.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Open Sans"', ...defaultTheme.fontFamily.sans],
        display: ['Montserrat', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: {
          DEFAULT: '#FFCE00',
          hover: '#FFAE00',   
          disabled: '#FFF2BD', 
          dark: '#E5B900',
        },

        accent: {
          DEFAULT: '#00AFED',
          hover: '#0092C7',
          disabled: '#BEE1ED',
        },
        discount: '#7F21F7',

        success: {
          DEFAULT: '#379634',
          hover: '#246322',
          disabled: '#C2E3C1',
        },

        danger: {
          DEFAULT: '#E50000',
          hover: '#B20000',
          disabled: '#E5B8B8',
        },

        dark: {
          deep: '#000000',
          bg: '#0A0B0F',
          main: '#212121',
        },

        gray: {
          white: '#FFFFFF',
          light: '#F5F5F5',
          DEFAULT: '#EEEEEE',
          hover: '#D4D4D4',
          text: '#979797',
        }
      },
      borderRadius: {
        '20px': '20px',
      },
      fontSize: {
        '22px': '22px',
      },
      width: {
        '100px': '100px',
      },
      height: {
        '100px': '100px',
      },
    },
  },
  plugins: [],
}

