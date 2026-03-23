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
        },
        blob: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
        },
        'float-card': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'bounce-x': {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(4px)' },
        },
        'feedback-pop': {
          '0%': { transform: 'scale(0) rotate(-45deg)', opacity: '0' },
          '55%': { transform: 'scale(1.12) rotate(6deg)', opacity: '1' },
          '75%': { transform: 'scale(0.95) rotate(-2deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        'feedback-fade-up': {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'feedback-ripple': {
          '0%': { transform: 'scale(0.65)', opacity: '0.55' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        'feedback-shimmer': {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        'feedback-glow-pulse': {
          '0%, 100%': { opacity: '0.35', transform: 'scale(1)' },
          '50%': { opacity: '0.65', transform: 'scale(1.08)' },
        },
      },
      animation: {
        'slide-left-to-center': 'slide-left-to-center 0.3s ease-in-out forwards',
        'slide-right-to-center': 'slide-right-to-center 0.3s ease-in-out forwards',
        'slide-out-left': 'slide-out-left 0.3s ease-in-out forwards',
        'slide-out-right': 'slide-out-right 0.3s ease-in-out forwards',
        'wiggle': 'wiggle 0.5s ease-in-out infinite',
        'bounce-gentle': 'bounce-gentle 0.5s ease-in-out infinite',
        'shake': 'shake 0.5s ease-in-out infinite',
        blob: 'blob 10s ease-in-out infinite alternate',
        'float-card': 'float-card 6s ease-in-out infinite',
        'bounce-x': 'bounce-x 1.5s ease-in-out infinite',
        'feedback-pop': 'feedback-pop 0.65s cubic-bezier(0.34,1.56,0.64,1) forwards',
        'feedback-fade-up': 'feedback-fade-up 0.45s ease-out forwards',
        'feedback-ripple': 'feedback-ripple 0.85s ease-out forwards',
        'feedback-shimmer': 'feedback-shimmer 1.1s ease-in-out',
        'feedback-glow-pulse': 'feedback-glow-pulse 1.2s ease-in-out infinite',
      }
    }
  },
  plugins: [],
}
