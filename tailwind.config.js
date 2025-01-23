/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["**/views/*.{html,js}", "**/js/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        "darkblue": "#0A0F14",
        "brown": "#1E1E1E",
        "gray": "#464646",
        "white": "#FFE6D7",
        "blue": "#192832",
        "orange": "#BE6900",
      },

      fontFamily: {
        "serif": ["'Libre Baskerville'", "'Times New Roman'", "serif"],
      }
    },
  },
  plugins: [],
}

