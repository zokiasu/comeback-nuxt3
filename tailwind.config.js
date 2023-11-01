module.exports = {
  darkMode: 'class',
  content: [],
  theme: {
    extend: {
      colors: {
        primary: '#9E0102', // red
        secondary: '#1F1D1D', // black
        tertiary: '#E1E1E1', // white
        quaternary: '#2B2B2B', // gray
        quinary: '#3A3A3A', // gray medium
      },
      keyframes: {
        shimmer: {
          '100%': {
            transform: 'translateX(100%)',
          },
        },
      },
    },
  },
}
