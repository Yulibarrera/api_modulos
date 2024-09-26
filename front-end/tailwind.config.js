/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js}',
    './public/**/*.{html,js}',
  ],
  theme: {
    fontFamily: {
      roboto: ['Roboto'],
      serif: ['sans-serif'],
      montserrat: ['Montserrat'],
    objectPosition: {
      center: 'center'}
    },
    extend: {
      colors: {
        customgray: '#f7fafc',
        danger: "#ff5f40",
        bom: "#f59a73",
        bum: "#e68a5c",
        bam: "#f4f4f4",
        bim: "#333",
        info: {
          100: '#24a19c',
          200: '#6ebfb5',
        boxShadow: ['active'],
        borderRadius: ['hover', 'focus'],
        borderWidth: ['hover', 'focus'],
        padding: ['hover', 'focus'],
        objectPosition: ['hover', 'focus'],
        }
      }
    },
  },
  plugins: [],
}

