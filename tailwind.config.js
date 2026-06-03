/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ember: '#F97316',
        honey: '#FBBF24',
        cream: '#FFF7ED',
        cocoa: '#2F1C12',
        mint: '#059669',
        base: '#0052FF',
        ink: '#171412'
      },
      boxShadow: {
        soft: '0 22px 70px rgba(47, 28, 18, 0.12)'
      }
    }
  },
  plugins: []
};
