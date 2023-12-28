module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'media', 
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#e6f2fb',
          100: '#cce6f7',
          200: '#b3d9f3',
          300: '#99cdef',
          400: '#80c2ec',
          500: '#0070ba', 
          600: '#0070ba',
          700: '#339fcf',
          800: '#1a93cb',
          900: '#0070ba',
        },
      },
    },
  },

  variants: {
    extend: {},
  },
  plugins: [],
}
