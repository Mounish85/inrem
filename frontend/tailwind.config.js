/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#F8F4E8",
        brutal: "#09090B",
        acid: "#D2E823",
        coral: "#FF4B4B",
        cyan: "#00D2FF",
        amber: "#FF8A00",
        surface: "#FFFFFF",
      },
      fontFamily: {
        heading: ['"Dela Gothic One"', 'cursive', 'sans-serif'],
        body: ['"Space Grotesk"', 'sans-serif'],
      },
      boxShadow: {
        'brutal-sm': '2px 2px 0 #09090B',
        'brutal': '4px 4px 0 #09090B',
        'brutal-lg': '6px 6px 0 #09090B',
        'brutal-xl': '8px 8px 0 #09090B',
        'brutal-acid': '4px 4px 0 #D2E823',
      },
      borderRadius: {
        'brutal': '12px',
        'brutal-sm': '8px',
        'brutal-lg': '16px',
        'brutal-xl': '24px',
      },
      borderWidth: {
        'brutal': '2px',
      },
      animation: {
        'marquee': 'marquee 20s linear infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}

