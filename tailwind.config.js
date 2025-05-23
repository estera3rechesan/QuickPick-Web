/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        title: ['Pally', 'sans-serif'],   // Pentru titluri
        body: ['Chubbo', 'sans-serif'],   // Pentru restul textului
      },
      colors: {
        text: "#353935",
        background: "#FFECEC",
        "verde-inchis": "#93c572",
        "verde-deschis": "#c9e2b8",
        "roz-inchis": "#FF8787",
        // Pentru utilizare rapidă cu bg-primary, text-primary etc:
        primary: "#93c572",
        accent: "#c9e2b8",
        secondary: "#FF8787",
      },
    },
  },
  plugins: [],
}
