/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'slide-left-to-center': {
          '0%': {
            transform: 'translateX(0)'
          },
          '100%': {
            transform: 'translateX(calc(100% + 1rem))'  // 1rem = 16px (space-x-4)
          }
        },
        'slide-right-to-center': {
          '0%': {
            transform: 'translateX(0)'
          },
          '100%': {
            transform: 'translateX(calc(-100% - 1rem))'  // 1rem = 16px (space-x-4)
          }
        },
        'slide-out-left': {
          '0%': {
            transform: 'translateX(0)',
            opacity: '1'
          },
          '100%': {
            transform: 'translateX(-150%)',
            opacity: '0'
          }
        },
        'slide-out-right': {
          '0%': {
            transform: 'translateX(0)',
            opacity: '1'
          },
          '100%': {
            transform: 'translateX(150%)',
            opacity: '0'
          }
        },
        'wiggle': {
          '0%, 100%': {
            transform: 'rotate(-3deg)'
          },
          '50%': {
            transform: 'rotate(3deg)'
          }
        },
        'bounce-gentle': {
          '0%, 100%': {
            transform: 'translateY(0)'
          },
          '50%': {
            transform: 'translateY(-25%)'
          }
        },
        'shake': {
          '0%, 100%': {
            transform: 'translateX(0)'
          },
          '25%': {
            transform: 'translateX(-10%)'
          },
          '75%': {
            transform: 'translateX(10%)'
          }
        }
      },
      animation: {
        'slide-left-to-center': 'slide-left-to-center 0.3s ease-in-out forwards',
        'slide-right-to-center': 'slide-right-to-center 0.3s ease-in-out forwards',
        'slide-out-left': 'slide-out-left 0.3s ease-in-out forwards',
        'slide-out-right': 'slide-out-right 0.3s ease-in-out forwards',
        'wiggle': 'wiggle 0.5s ease-in-out infinite',
        'bounce-gentle': 'bounce-gentle 0.5s ease-in-out infinite',
        'shake': 'shake 0.5s ease-in-out infinite'
      }
    }
  },
  plugins: [],
}
