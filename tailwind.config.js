/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#073B4C',       // dark blue (matches globe color)
        accent: '#D4AF37',        // gold (matches globe gold color)
        'accent-hover': '#c19f2f',// darker gold for hover
        secondary: '#118ab2',     // blue accent
        background: '#FFF8E7',    // light cream background
        surface: '#FFFFFF',       // white surface
        'text-primary': '#073B4C',
        'text-secondary': '#555555',
        danger: '#dc2626',        // red for errors
        'on-primary': '#FFFFFF',  // text on primary color
      },
    },
  },
  plugins: [],
}
