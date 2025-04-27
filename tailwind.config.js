module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        header: '#93A399',
        accent: '#4DB6AC',
        background: '#FFFFFF',
        offwhite: '#F7F7F7',
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        card: '1rem',
      },
      boxShadow: {
        card: '0 2px 8px 0 rgba(60, 60, 60, 0.10)',
      },
    },
  },
  plugins: [],
};
